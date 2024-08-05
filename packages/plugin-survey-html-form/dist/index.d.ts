import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";

declare const info: {
  readonly name: "survey-html-form";
  readonly version: string;
  readonly parameters: {
    /** HTML formatted string containing all the input elements to display. Every element has to have its own distinctive name attribute. The <form> tag must not be included and is generated by the plugin. */
    readonly html: {
      readonly type: ParameterType.HTML_STRING;
      readonly default: any;
    };
    /** HTML formatted string to display at the top of the page above all the questions. */
    readonly preamble: {
      readonly type: ParameterType.HTML_STRING;
      readonly default: any;
    };
    /** The text that appears on the button to finish the trial. */
    readonly button_label: {
      readonly type: ParameterType.STRING;
      readonly default: "Continue";
    };
    /** The HTML element ID of a form field to autofocus on. */
    readonly autofocus: {
      readonly type: ParameterType.STRING;
      readonly default: "";
    };
    /** Retrieve the data as an array e.g. [{name: "INPUT_NAME", value: "INPUT_VALUE"}, ...] instead of an object e.g. {INPUT_NAME: INPUT_VALUE, ...}. */
    readonly dataAsArray: {
      readonly type: ParameterType.BOOL;
      readonly default: false;
    };
    /** Setting this to true will enable browser auto-complete or auto-fill for the form. */
    readonly autocomplete: {
      readonly type: ParameterType.BOOL;
      readonly default: false;
    };
  };
  readonly data: {
    /**  An object containing the response for each input. The object will have a separate key (variable) for the response to each input, with each variable being named after its corresponding input element. Each response is a string containing whatever the participant answered for this particular input. This will be encoded as a JSON string when data is saved using the `.json()` or `.csv()` functions. */
    readonly response: {
      readonly type: ParameterType.COMPLEX;
      readonly nested: {
        readonly identifier: {
          readonly type: ParameterType.STRING;
        };
        readonly response: {
          readonly type: number;
        };
      };
    };
    /** The response time in milliseconds for the participant to make a response. */
    readonly rt: {
      readonly type: ParameterType.INT;
    };
  };
};
type Info = typeof info;
/**
 *
 * The survey-html-form plugin displays a set of `<inputs>` from a HTML string. The type of input can be freely
 * chosen, for a list of possible input types see the [MDN page on inputs](https://developer.mozilla.org/en-US/docs/Web/HTML/Element/input).
 * The participant provides answers to the input fields.
 * @author Jan Simson
 * @see {@link https://www.jspsych.org/latest/plugins/survey-html-form/ survey-html-form plugin documentation on jspsych.org}
 */
declare class SurveyHtmlFormPlugin implements JsPsychPlugin<Info> {
  private jsPsych;
  static info: {
    readonly name: "survey-html-form";
    readonly version: string;
    readonly parameters: {
      /** HTML formatted string containing all the input elements to display. Every element has to have its own distinctive name attribute. The <form> tag must not be included and is generated by the plugin. */
      readonly html: {
        readonly type: ParameterType.HTML_STRING;
        readonly default: any;
      };
      /** HTML formatted string to display at the top of the page above all the questions. */
      readonly preamble: {
        readonly type: ParameterType.HTML_STRING;
        readonly default: any;
      };
      /** The text that appears on the button to finish the trial. */
      readonly button_label: {
        readonly type: ParameterType.STRING;
        readonly default: "Continue";
      };
      /** The HTML element ID of a form field to autofocus on. */
      readonly autofocus: {
        readonly type: ParameterType.STRING;
        readonly default: "";
      };
      /** Retrieve the data as an array e.g. [{name: "INPUT_NAME", value: "INPUT_VALUE"}, ...] instead of an object e.g. {INPUT_NAME: INPUT_VALUE, ...}. */
      readonly dataAsArray: {
        readonly type: ParameterType.BOOL;
        readonly default: false;
      };
      /** Setting this to true will enable browser auto-complete or auto-fill for the form. */
      readonly autocomplete: {
        readonly type: ParameterType.BOOL;
        readonly default: false;
      };
    };
    readonly data: {
      /**  An object containing the response for each input. The object will have a separate key (variable) for the response to each input, with each variable being named after its corresponding input element. Each response is a string containing whatever the participant answered for this particular input. This will be encoded as a JSON string when data is saved using the `.json()` or `.csv()` functions. */
      readonly response: {
        readonly type: ParameterType.COMPLEX;
        readonly nested: {
          readonly identifier: {
            readonly type: ParameterType.STRING;
          };
          readonly response: {
            readonly type: number;
          };
        };
      };
      /** The response time in milliseconds for the participant to make a response. */
      readonly rt: {
        readonly type: ParameterType.INT;
      };
    };
  };
  constructor(jsPsych: JsPsych);
  trial(display_element: HTMLElement, trial: TrialType<Info>): void;
}

export { SurveyHtmlFormPlugin as default };
