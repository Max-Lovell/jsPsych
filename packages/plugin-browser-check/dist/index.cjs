"use strict";

var detectBrowser = require("detect-browser");
var jspsych = require("jspsych");

var _package = {
  name: "@jspsych/plugin-browser-check",
  version: "2.0.0",
  description: "jsPsych plugin for checking browser features",
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
    test: "jest",
    "test:watch": "npm test -- --watch",
    tsc: "tsc",
    build: "rollup --config",
    "build:watch": "npm run build -- --watch",
  },
  repository: {
    type: "git",
    url: "git+https://github.com/jspsych/jsPsych.git",
    directory: "packages/plugin-html-keyboard-response",
  },
  author: "Josh de Leeuw",
  license: "MIT",
  bugs: {
    url: "https://github.com/jspsych/jsPsych/issues",
  },
  homepage: "https://www.jspsych.org/latest/plugins/html-keyboard-response",
  peerDependencies: {
    jspsych: ">=7.1.0",
  },
  devDependencies: {
    "@jspsych/config": "^3.0.0",
    "@jspsych/test-utils": "^1.2.0",
  },
  dependencies: {
    "detect-browser": "^5.2.1",
  },
};

const info = {
  name: "browser-check",
  version: _package.version,
  parameters: {
    features: {
      type: jspsych.ParameterType.STRING,
      array: true,
      default: [
        "width",
        "height",
        "webaudio",
        "browser",
        "browser_version",
        "mobile",
        "os",
        "fullscreen",
        "vsync_rate",
        "webcam",
        "microphone",
      ],
    },
    skip_features: {
      type: jspsych.ParameterType.STRING,
      array: true,
      default: [],
    },
    vsync_frame_count: {
      type: jspsych.ParameterType.INT,
      default: 60,
    },
    allow_window_resize: {
      type: jspsych.ParameterType.BOOL,
      default: true,
    },
    minimum_width: {
      type: jspsych.ParameterType.INT,
      default: 0,
    },
    minimum_height: {
      type: jspsych.ParameterType.INT,
      default: 0,
    },
    window_resize_message: {
      type: jspsych.ParameterType.HTML_STRING,
      default: `<p>Your browser window is too small to complete this experiment. Please maximize the size of your browser window. 
        If your browser window is already maximized, you will not be able to complete this experiment.</p>
        <p>The minimum window width is <span id="browser-check-min-width"></span> px.</p>
        <p>Your current window width is <span id="browser-check-actual-width"></span> px.</p>
        <p>The minimum window height is <span id="browser-check-min-height"></span> px.</p>
        <p>Your current window height is <span id="browser-check-actual-height"></span> px.</p>`,
    },
    resize_fail_button_text: {
      type: jspsych.ParameterType.STRING,
      default: "I cannot make the window any larger",
    },
    inclusion_function: {
      type: jspsych.ParameterType.FUNCTION,
      default: () => {
        return true;
      },
    },
    exclusion_message: {
      type: jspsych.ParameterType.FUNCTION,
      default: () => {
        return `<p>Your browser does not meet the requirements to participate in this experiment.</p>`;
      },
    },
  },
  data: {
    width: {
      type: jspsych.ParameterType.INT,
    },
    height: {
      type: jspsych.ParameterType.INT,
    },
    browser: {
      type: jspsych.ParameterType.STRING,
    },
    browser_version: {
      type: jspsych.ParameterType.STRING,
    },
    os: {
      type: jspsych.ParameterType.STRING,
    },
    mobile: {
      type: jspsych.ParameterType.BOOL,
    },
    webaudio: {
      type: jspsych.ParameterType.BOOL,
    },
    fullscreen: {
      type: jspsych.ParameterType.BOOL,
    },
    vsync_rate: {
      type: jspsych.ParameterType.FLOAT,
    },
    webcam: {
      type: jspsych.ParameterType.BOOL,
    },
    microphone: {
      type: jspsych.ParameterType.BOOL,
    },
  },
};
class BrowserCheckPlugin {
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
    this.end_flag = false;
  }
  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
  trial(display_element, trial) {
    this.t = trial;
    const featureCheckFunctionsMap = this.create_feature_fn_map(trial);
    const features_to_check = trial.features.filter((x) => !trial.skip_features.includes(x));
    this.run_trial(featureCheckFunctionsMap, features_to_check);
  }
  async run_trial(fnMap, features) {
    const feature_data = await this.measure_features(fnMap, features);
    const include = await this.inclusion_check(this.t.inclusion_function, feature_data);
    if (include) {
      this.end_trial(feature_data);
    } else {
      this.end_experiment(feature_data);
    }
  }
  create_feature_fn_map(trial) {
    return new Map(
      Object.entries({
        width: () => {
          return window.innerWidth;
        },
        height: () => {
          return window.innerHeight;
        },
        webaudio: () => {
          if (
            window.AudioContext ||
            window.webkitAudioContext ||
            window.mozAudioContext ||
            window.oAudioContext ||
            window.msAudioContext
          ) {
            return true;
          } else {
            return false;
          }
        },
        browser: () => {
          return detectBrowser.detect().name;
        },
        browser_version: () => {
          return detectBrowser.detect().version;
        },
        mobile: () => {
          return /Mobi/i.test(window.navigator.userAgent);
        },
        os: () => {
          return detectBrowser.detect().os;
        },
        fullscreen: () => {
          if (
            document.exitFullscreen ||
            document.webkitExitFullscreen ||
            document.msExitFullscreen
          ) {
            return true;
          } else {
            return false;
          }
        },
        vsync_rate: () => {
          return new Promise((resolve) => {
            let t0 = performance.now();
            let deltas = [];
            let framesToRun = trial.vsync_frame_count;
            const finish = () => {
              let sum = 0;
              for (const v of deltas) {
                sum += v;
              }
              const frame_rate = 1e3 / (sum / deltas.length);
              const frame_rate_two_sig_dig = Math.round(frame_rate * 100) / 100;
              resolve(frame_rate_two_sig_dig);
            };
            const nextFrame = () => {
              let t1 = performance.now();
              deltas.push(t1 - t0);
              t0 = t1;
              framesToRun--;
              if (framesToRun > 0) {
                requestAnimationFrame(nextFrame);
              } else {
                finish();
              }
            };
            const start = () => {
              t0 = performance.now();
              requestAnimationFrame(nextFrame);
            };
            requestAnimationFrame(start);
          });
        },
        webcam: () => {
          return new Promise((resolve, reject) => {
            if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
              resolve(false);
            }
            navigator.mediaDevices.enumerateDevices().then((devices) => {
              const webcams = devices.filter((d) => {
                return d.kind == "videoinput";
              });
              if (webcams.length > 0) {
                resolve(true);
              } else {
                resolve(false);
              }
            });
          });
        },
        microphone: () => {
          return new Promise((resolve, reject) => {
            if (!navigator.mediaDevices || !navigator.mediaDevices.enumerateDevices) {
              resolve(false);
            }
            navigator.mediaDevices.enumerateDevices().then((devices) => {
              const microphones = devices.filter((d) => {
                return d.kind == "audioinput";
              });
              if (microphones.length > 0) {
                resolve(true);
              } else {
                resolve(false);
              }
            });
          });
        },
      })
    );
  }
  async measure_features(fnMap, features_to_check) {
    const feature_data = /* @__PURE__ */ new Map();
    const feature_checks = [];
    for (const feature of features_to_check) {
      feature_checks.push(Promise.resolve(fnMap.get(feature)()));
    }
    const results = await Promise.allSettled(feature_checks);
    for (let i = 0; i < features_to_check.length; i++) {
      if (results[i].status === "fulfilled") {
        feature_data.set(features_to_check[i], results[i].value);
      } else {
        feature_data.set(features_to_check[i], null);
      }
    }
    return feature_data;
  }
  async inclusion_check(fn, data) {
    await this.check_allow_resize(data);
    if (this.end_flag) {
      return false;
    }
    return fn(Object.fromEntries(data));
  }
  async check_allow_resize(feature_data) {
    const display_element = this.jsPsych.getDisplayElement();
    const w = feature_data.get("width");
    const h = feature_data.get("height");
    if (
      this.t.allow_window_resize &&
      (w || h) &&
      (this.t.minimum_width > 0 || this.t.minimum_height > 0)
    ) {
      display_element.innerHTML =
        this.t.window_resize_message +
        `<p><button id="browser-check-max-size-btn" class="jspsych-btn">${this.t.resize_fail_button_text}</button></p>`;
      display_element.querySelector("#browser-check-max-size-btn").addEventListener("click", () => {
        display_element.innerHTML = "";
        this.end_flag = true;
      });
      const min_width_el = display_element.querySelector("#browser-check-min-width");
      const min_height_el = display_element.querySelector("#browser-check-min-height");
      const actual_height_el = display_element.querySelector("#browser-check-actual-height");
      const actual_width_el = display_element.querySelector("#browser-check-actual-width");
      while (
        !this.end_flag &&
        (window.innerWidth < this.t.minimum_width || window.innerHeight < this.t.minimum_height)
      ) {
        if (min_width_el) {
          min_width_el.innerHTML = this.t.minimum_width.toString();
        }
        if (min_height_el) {
          min_height_el.innerHTML = this.t.minimum_height.toString();
        }
        if (actual_height_el) {
          actual_height_el.innerHTML = window.innerHeight.toString();
        }
        if (actual_width_el) {
          actual_width_el.innerHTML = window.innerWidth.toString();
        }
        await this.delay(100);
        feature_data.set("width", window.innerWidth);
        feature_data.set("height", window.innerHeight);
      }
    }
  }
  end_trial(feature_data) {
    const trial_data = { ...Object.fromEntries(feature_data) };
    this.jsPsych.finishTrial(trial_data);
  }
  end_experiment(feature_data) {
    this.jsPsych.getDisplayElement().innerHTML = "";
    const trial_data = { ...Object.fromEntries(feature_data) };
    this.jsPsych.abortExperiment(this.t.exclusion_message(trial_data), trial_data);
  }
  simulate(trial, simulation_mode, simulation_options, load_callback) {
    if (simulation_mode == "data-only") {
      load_callback();
      this.simulate_data_only(trial, simulation_options);
    }
    if (simulation_mode == "visual") {
      this.simulate_visual(trial, simulation_options, load_callback);
    }
  }
  async create_simulation_data(trial, simulation_options) {
    const featureCheckFunctionsMap = this.create_feature_fn_map(trial);
    const features_to_check = trial.features.filter((x) => !trial.skip_features.includes(x));
    const feature_data = await this.measure_features(
      featureCheckFunctionsMap,
      features_to_check.filter((x) => x !== "vsync_rate")
    );
    if (features_to_check.includes("vsync_rate")) {
      feature_data.set("vsync_rate", 60);
    }
    const default_data = Object.fromEntries(feature_data);
    const data = this.jsPsych.pluginAPI.mergeSimulationData(default_data, simulation_options);
    return data;
  }
  simulate_data_only(trial, simulation_options) {
    this.create_simulation_data(trial, simulation_options).then((data) => {
      if (trial.allow_window_resize) {
        if (data.width < trial.minimum_width) {
          data.width = trial.minimum_width;
        }
        if (data.height < trial.minimum_height) {
          data.height = trial.minimum_height;
        }
      }
      if (trial.inclusion_function(data)) {
        this.jsPsych.finishTrial(data);
      } else {
        this.jsPsych.abortExperiment(trial.exclusion_message(data), data);
      }
    });
  }
  simulate_visual(trial, simulation_options, load_callback) {
    this.t = trial;
    load_callback();
    this.create_simulation_data(trial, simulation_options).then((data) => {
      const feature_data = new Map(Object.entries(data));
      setTimeout(() => {
        const btn = document.querySelector("#browser-check-max-size-btn");
        if (btn) {
          this.jsPsych.pluginAPI.clickTarget(btn);
        }
      }, 3e3);
      this.inclusion_check(this.t.inclusion_function, feature_data).then((include) => {
        if (include) {
          this.end_trial(feature_data);
        } else {
          this.end_experiment(feature_data);
        }
      });
    });
  }
}
BrowserCheckPlugin.info = info;

module.exports = BrowserCheckPlugin;
//# sourceMappingURL=index.cjs.map
