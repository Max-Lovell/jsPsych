import { ParameterType } from "jspsych";

var _package = {
  name: "@jspsych/extension-webgazer",
  version: "1.1.0",
  description: "jsPsych extension for eye tracking using WebGazer.js",
  type: "module",
  main: "dist/index.cjs",
  exports: {
    import: "./dist/index.js",
    require: "./dist/index.cjs",
  },
  typings: "dist/index.d.ts",
  unpkg: "dist/index.browser.min.js",
  files: ["src", "dist"],
  source: "src/index.ts",
  scripts: {
    test: "jest --passWithNoTests",
    "test:watch": "npm test -- --watch",
    tsc: "tsc",
    build: "rollup --config",
    "build:watch": "npm run build -- --watch",
  },
  repository: {
    type: "git",
    url: "git+https://github.com/jspsych/jsPsych.git",
    directory: "packages/extension-webgazer",
  },
  author: "Josh de Leeuw",
  license: "MIT",
  bugs: {
    url: "https://github.com/jspsych/jsPsych/issues",
  },
  homepage: "https://www.jspsych.org/latest/extensions/webgazer",
  peerDependencies: {
    jspsych: ">=7.0.0",
  },
  devDependencies: {
    "@jspsych/config": "^3.0.0",
    "@jspsych/test-utils": "^1.2.0",
  },
};

class WebGazerExtension {
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
    this.currentTrialData = [];
    this.currentTrialTargets = {};
    this.initialized = false;
    this.activeTrial = false;
    this.initialize = ({
      round_predictions = true,
      auto_initialize = false,
      sampling_interval = 34,
      webgazer,
    }) => {
      this.round_predictions = round_predictions;
      this.sampling_interval = sampling_interval;
      this.gazeUpdateCallbacks = [];
      this.domObserver = new MutationObserver(this.mutationObserverCallback);
      return new Promise((resolve, reject) => {
        if (typeof webgazer === "undefined") {
          if (window.webgazer) {
            this.webgazer = window.webgazer;
          } else {
            reject(
              new Error(
                "Webgazer extension failed to initialize. webgazer.js not loaded. Load webgazer.js before calling initJsPsych()"
              )
            );
          }
        } else {
          this.webgazer = webgazer;
        }
        this.hideVideo();
        this.hidePredictions();
        if (auto_initialize) {
          this.webgazer
            .begin()
            .then(() => {
              this.initialized = true;
              this.stopMouseCalibration();
              this.pause();
              resolve();
            })
            .catch((error) => {
              console.error(error);
              reject(error);
            });
        } else {
          resolve();
        }
      });
    };
    this.on_start = (params) => {
      this.currentTrialData = [];
      this.currentTrialTargets = {};
      this.currentTrialSelectors = params.targets;
      this.domObserver.observe(this.jsPsych.getDisplayElement(), { childList: true });
    };
    this.on_load = () => {
      this.currentTrialStart = performance.now();
      this.startSampleInterval();
      this.activeTrial = true;
    };
    this.on_finish = () => {
      this.stopSampleInterval();
      this.domObserver.disconnect();
      this.activeTrial = false;
      return {
        webgazer_data: this.currentTrialData,
        webgazer_targets: this.currentTrialTargets,
      };
    };
    this.start = () => {
      return new Promise((resolve, reject) => {
        if (typeof this.webgazer == "undefined") {
          const error =
            "Failed to start webgazer. Things to check: Is webgazer.js loaded? Is the webgazer extension included in initJsPsych?";
          console.error(error);
          reject(error);
        }
        this.webgazer
          .begin()
          .then(() => {
            this.initialized = true;
            this.stopMouseCalibration();
            this.pause();
            resolve();
          })
          .catch((error) => {
            console.error(error);
            reject(error);
          });
      });
    };
    this.startSampleInterval = (interval = this.sampling_interval) => {
      this.gazeInterval = setInterval(() => {
        this.webgazer.getCurrentPrediction().then(this.handleGazeDataUpdate);
      }, interval);
      this.webgazer.getCurrentPrediction().then(this.handleGazeDataUpdate);
    };
    this.stopSampleInterval = () => {
      clearInterval(this.gazeInterval);
    };
    this.isInitialized = () => {
      return this.initialized;
    };
    this.faceDetected = () => {
      return this.webgazer.getTracker().predictionReady;
    };
    this.showPredictions = () => {
      this.webgazer.showPredictionPoints(true);
    };
    this.hidePredictions = () => {
      this.webgazer.showPredictionPoints(false);
    };
    this.showVideo = () => {
      this.webgazer.showVideo(true);
      this.webgazer.showFaceOverlay(true);
      this.webgazer.showFaceFeedbackBox(true);
    };
    this.hideVideo = () => {
      this.webgazer.showVideo(false);
      this.webgazer.showFaceOverlay(false);
      this.webgazer.showFaceFeedbackBox(false);
    };
    this.resume = () => {
      this.webgazer.resume();
    };
    this.pause = () => {
      this.webgazer.pause();
      if (document.querySelector("#webgazerGazeDot")) {
        document.querySelector("#webgazerGazeDot").style.display = "none";
      }
    };
    this.resetCalibration = () => {
      this.webgazer.clearData();
    };
    this.stopMouseCalibration = () => {
      this.webgazer.removeMouseEventListeners();
    };
    this.startMouseCalibration = () => {
      this.webgazer.addMouseEventListeners();
    };
    this.calibratePoint = (x, y) => {
      this.webgazer.recordScreenPosition(x, y, "click");
    };
    this.setRegressionType = (regression_type) => {
      var valid_regression_models = ["ridge", "weightedRidge", "threadedRidge"];
      if (valid_regression_models.includes(regression_type)) {
        this.webgazer.setRegression(regression_type);
      } else {
        console.warn(
          "Invalid regression_type parameter for webgazer.setRegressionType. Valid options are ridge, weightedRidge, and threadedRidge."
        );
      }
    };
    this.getCurrentPrediction = () => {
      return this.webgazer.getCurrentPrediction();
    };
    this.onGazeUpdate = (callback) => {
      this.gazeUpdateCallbacks.push(callback);
      return () => {
        this.gazeUpdateCallbacks = this.gazeUpdateCallbacks.filter((item) => {
          return item !== callback;
        });
      };
    };
    this.handleGazeDataUpdate = (gazeData, elapsedTime) => {
      if (gazeData !== null) {
        var d = {
          x: this.round_predictions ? Math.round(gazeData.x) : gazeData.x,
          y: this.round_predictions ? Math.round(gazeData.y) : gazeData.y,
          t: gazeData.t,
        };
        if (this.activeTrial) {
          d.t = Math.round(gazeData.t - this.currentTrialStart);
          this.currentTrialData.push(d);
        }
        this.currentGaze = d;
        for (var i = 0; i < this.gazeUpdateCallbacks.length; i++) {
          this.gazeUpdateCallbacks[i](d);
        }
      } else {
        this.currentGaze = null;
      }
    };
    this.mutationObserverCallback = (mutationsList, observer) => {
      for (const selector of this.currentTrialSelectors) {
        if (!this.currentTrialTargets[selector]) {
          if (this.jsPsych.getDisplayElement().querySelector(selector)) {
            var coords = this.jsPsych
              .getDisplayElement()
              .querySelector(selector)
              .getBoundingClientRect();
            this.currentTrialTargets[selector] = coords;
          }
        }
      }
    };
  }
}
WebGazerExtension.info = {
  name: "webgazer",
  version: _package.version,
  data: {
    webgazer_data: {
      type: ParameterType.INT,
      array: true,
    },
    webgazer_targets: {
      type: ParameterType.COMPLEX,
      nested: {
        x: {
          type: ParameterType.INT,
        },
        y: {
          type: ParameterType.INT,
        },
        width: {
          type: ParameterType.INT,
        },
        height: {
          type: ParameterType.INT,
        },
        top: {
          type: ParameterType.INT,
        },
        bottom: {
          type: ParameterType.INT,
        },
        left: {
          type: ParameterType.INT,
        },
        right: {
          type: ParameterType.INT,
        },
      },
    },
  },
};

export { WebGazerExtension as default };
//# sourceMappingURL=index.js.map
