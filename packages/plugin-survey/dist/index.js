import { ParameterType } from "jspsych";
import * as SurveyJS from "survey-knockout-ui";

var _package = {
  name: "@jspsych/plugin-survey",
  version: "2.0.0",
  description: "A jsPsych plugin for complex surveys",
  type: "module",
  main: "dist/index.cjs",
  exports: {
    ".": {
      import: "./dist/index.js",
      require: "./dist/index.cjs",
    },
    "./css/survey.css": "./css/survey.css",
    "./css/survey.scss": "./css/survey.scss",
  },
  typings: "dist/index.d.ts",
  unpkg: "dist/index.browser.min.js",
  files: ["src", "dist", "css"],
  source: "src/index.ts",
  scripts: {
    test: "jest",
    "test:watch": "npm test -- --watch",
    tsc: "tsc",
    "build:js": "rollup --config",
    "build:styles":
      "sass --load-path ./node_modules --load-path ../../node_modules css/survey.scss css/survey.css",
    build: "run-p build:js build:styles",
    "build:watch": 'run-p "build:js -- --watch" "build:styles -- --watch"',
  },
  repository: {
    type: "git",
    url: "git+https://github.com/jspsych/jsPsych.git",
    directory: "packages/plugin-survey",
  },
  author: "Becky Gilbert",
  license: "MIT",
  bugs: {
    url: "https://github.com/jspsych/jsPsych/issues",
  },
  homepage: "https://www.jspsych.org/latest/plugins/survey",
  peerDependencies: {
    jspsych: ">=7.0.0",
  },
  devDependencies: {
    "@jspsych/config": "^3.0.0",
    "@jspsych/test-utils": "^1.2.0",
    "npm-run-all": "^4.1.5",
    sass: "^1.43.5",
  },
  dependencies: {
    "survey-core": "^1.9.138",
    "survey-knockout-ui": "^1.9.139",
  },
};

const info = {
  name: "survey",
  version: _package.version,
  parameters: {
    survey_json: {
      type: ParameterType.OBJECT,
      default: {},
    },
    survey_function: {
      type: ParameterType.FUNCTION,
      default: null,
    },
    validation_function: {
      type: ParameterType.FUNCTION,
      default: null,
    },
  },
  data: {
    response: {
      type: ParameterType.COMPLEX,
      nested: {
        identifier: {
          type: ParameterType.STRING,
        },
        response: {
          type:
            ParameterType.STRING |
            ParameterType.INT |
            ParameterType.FLOAT |
            ParameterType.BOOL |
            ParameterType.OBJECT,
        },
      },
    },
    rt: {
      type: ParameterType.INT,
    },
  },
};
const jsPsychSurveyCssClassMap = {
  body: "jspsych-body",
  bodyContainer: "jspsych-body-container",
  question: {
    content: "jspsych-question-content",
    mainRoot: "jspsych-question-root",
  },
  page: {
    root: "jspsych-page",
  },
  footer: "jspsych-footer",
  navigation: {
    complete: "jspsych-nav-complete",
  },
  rowMultiple: "jspsych-row-multiple",
};
class SurveyPlugin {
  constructor(jsPsych) {
    this.jsPsych = jsPsych;
    this.jsPsych = jsPsych;
  }
  applyStyles(survey) {
    survey.applyTheme({
      cssVariables: {
        "--sjs-general-backcolor": "rgba(255, 255, 255, 1)",
        "--sjs-general-backcolor-dim": "rgba(255, 255, 255, 1)",
        "--sjs-general-backcolor-dim-light": "rgba(249, 249, 249, 1)",
        "--sjs-general-forecolor": "rgba(0, 0, 0, 0.91)",
        "--sjs-general-forecolor-light": "rgba(0, 0, 0, 0.45)",
        "--sjs-general-dim-forecolor": "rgba(0, 0, 0, 0.91)",
        "--sjs-general-dim-forecolor-light": "rgba(0, 0, 0, 0.45)",
        "--sjs-primary-backcolor": "#474747",
        "--sjs-primary-backcolor-light": "rgba(0, 0, 0, 0.1)",
        "--sjs-primary-backcolor-dark": "#000000",
        "--sjs-primary-forecolor": "rgba(255, 255, 255, 1)",
        "--sjs-primary-forecolor-light": "rgba(255, 255, 255, 0.25)",
        "--sjs-shadow-small": "0px 0px 0px 1px rgba(0, 0, 0, 0.15)",
        "--sjs-shadow-small-reset": "0px 0px 0px 0px rgba(0, 0, 0, 0.15)",
        "--sjs-shadow-medium": "0px 0px 0px 1px rgba(0, 0, 0, 0.1)",
        "--sjs-shadow-large": "0px 8px 16px 0px rgba(0, 0, 0, 0.05)",
        "--sjs-shadow-inner-reset": "0px 0px 0px 0px rgba(0, 0, 0, 0.15)",
        "--sjs-border-light": "rgba(0, 0, 0, 0.15)",
        "--sjs-border-default": "rgba(0, 0, 0, 0.15)",
        "--sjs-border-inside": " rgba(0, 0, 0, 0.16)",
      },
      themeName: "plain",
      colorPalette: "light",
      isPanelless: false,
    });
  }
  trial(display_element, trial) {
    if (JSON.stringify(trial.survey_json) === "{}" && trial.survey_function === null) {
      console.error(
        "Survey plugin warning: you must define the survey using a non-empty JSON object and/or a survey function."
      );
    }
    this.survey = new SurveyJS.Survey(trial.survey_json);
    if (trial.survey_function !== null) {
      trial.survey_function(this.survey);
    }
    this.applyStyles(this.survey);
    this.survey.css = jsPsychSurveyCssClassMap;
    if (trial.validation_function) {
      this.survey.onValidateQuestion.add(trial.validation_function);
    }
    this.survey.onComplete.add((sender, options) => {
      const all_questions = sender.getAllQuestions();
      const data_names = Object.keys(sender.data);
      for (const question of all_questions) {
        if (!data_names.includes(question.name)) {
          sender.mergeData({ [question.name]: question.defaultValue ?? null });
        }
      }
      document.querySelector(".jspsych-content-wrapper").style.display = "flex";
      this.jsPsych.finishTrial({
        rt: Math.round(performance.now() - this.start_time),
        response: sender.data,
      });
    });
    document.querySelector(".jspsych-content-wrapper").style.display = "block";
    this.survey.render(display_element);
    this.start_time = performance.now();
  }
}
SurveyPlugin.info = info;

export { SurveyPlugin as default };
//# sourceMappingURL=index.js.map
