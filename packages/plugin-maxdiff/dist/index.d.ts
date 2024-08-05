import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";

declare const info: {
  readonly name: "maxdiff";
  readonly version: string;
  readonly parameters: {
    /** An array of one or more alternatives of string type to fill the rows of the maxdiff table. If `required` is true,
     * then the array must contain two or more alternatives, so that at least one can be selected for both the left
     * and right columns.  */
    readonly alternatives: {
      readonly type: ParameterType.STRING;
      readonly array: true;
      readonly default: any;
    };
    /** An array with exactly two labels of string type to display as column headings (to the left and right of the
     * alternatives) for responses on the criteria of interest. */
    readonly labels: {
      readonly type: ParameterType.STRING;
      readonly array: true;
      readonly default: any;
    };
    /** If true, the display order of `alternatives` is randomly determined at the start of the trial. */
    readonly randomize_alternative_order: {
      readonly type: ParameterType.BOOL;
      readonly default: false;
    };
    /** HTML formatted string to display at the top of the page above the maxdiff table. */
    readonly preamble: {
      readonly type: ParameterType.HTML_STRING;
      readonly default: "";
    };
    /** Label of the button to submit response. */
    readonly button_label: {
      readonly type: ParameterType.STRING;
      readonly default: "Continue";
    };
    /** If true, prevents the user from submitting the response and proceeding until a radio button in both the left and right response columns has been selected. */
    readonly required: {
      readonly type: ParameterType.BOOL;
      readonly default: false;
    };
  };
  readonly data: {
    /** The response time in milliseconds for the participant to make a response. The time is measured from when the maxdiff table first
     * appears on the screen until the participant's response. */
    readonly rt: {
      readonly type: ParameterType.INT;
    };
    /** An object with two keys, `left` and `right`, containing the labels (strings) corresponding to the left and right response
     * columns. This will be encoded as a JSON string when data is saved using the `.json()` or `.csv()` functions.  */
    readonly labels: {
      readonly type: ParameterType.COMPLEX;
      readonly parameters: {
        readonly left: {
          readonly type: ParameterType.STRING;
        };
        readonly right: {
          readonly type: ParameterType.STRING;
        };
      };
    };
    /** An object with two keys, `left` and `right`, containing the alternatives selected on the left and right columns.
     * This will be encoded as a JSON string when data is saved using the `.json()` or `.csv()` functions. */
    readonly response: {
      readonly type: ParameterType.COMPLEX;
      readonly parameters: {
        readonly left: {
          readonly type: ParameterType.STRING;
        };
        readonly right: {
          readonly type: ParameterType.STRING;
        };
      };
    };
  };
};
type Info = typeof info;
/**
 * The maxdiff plugin displays a table with rows of alternatives to be selected for two mutually-exclusive categories,
 * typically as 'most' or 'least' on a particular criteria (e.g. importance, preference, similarity). The participant
 * responds by selecting one radio button corresponding to an alternative in both the left and right response columns.
 * The same alternative cannot be endorsed on both the left and right response columns (e.g. 'most' and 'least') simultaneously.
 *
 * @author Angus Hughes
 * @see {@link https://www.jspsych.org/latest/plugins/maxdiff/ maxdiff plugin documentation on jspsych.org}
 */
declare class MaxdiffPlugin implements JsPsychPlugin<Info> {
  private jsPsych;
  static info: {
    readonly name: "maxdiff";
    readonly version: string;
    readonly parameters: {
      /** An array of one or more alternatives of string type to fill the rows of the maxdiff table. If `required` is true,
       * then the array must contain two or more alternatives, so that at least one can be selected for both the left
       * and right columns.  */
      readonly alternatives: {
        readonly type: ParameterType.STRING;
        readonly array: true;
        readonly default: any;
      };
      /** An array with exactly two labels of string type to display as column headings (to the left and right of the
       * alternatives) for responses on the criteria of interest. */
      readonly labels: {
        readonly type: ParameterType.STRING;
        readonly array: true;
        readonly default: any;
      };
      /** If true, the display order of `alternatives` is randomly determined at the start of the trial. */
      readonly randomize_alternative_order: {
        readonly type: ParameterType.BOOL;
        readonly default: false;
      };
      /** HTML formatted string to display at the top of the page above the maxdiff table. */
      readonly preamble: {
        readonly type: ParameterType.HTML_STRING;
        readonly default: "";
      };
      /** Label of the button to submit response. */
      readonly button_label: {
        readonly type: ParameterType.STRING;
        readonly default: "Continue";
      };
      /** If true, prevents the user from submitting the response and proceeding until a radio button in both the left and right response columns has been selected. */
      readonly required: {
        readonly type: ParameterType.BOOL;
        readonly default: false;
      };
    };
    readonly data: {
      /** The response time in milliseconds for the participant to make a response. The time is measured from when the maxdiff table first
       * appears on the screen until the participant's response. */
      readonly rt: {
        readonly type: ParameterType.INT;
      };
      /** An object with two keys, `left` and `right`, containing the labels (strings) corresponding to the left and right response
       * columns. This will be encoded as a JSON string when data is saved using the `.json()` or `.csv()` functions.  */
      readonly labels: {
        readonly type: ParameterType.COMPLEX;
        readonly parameters: {
          readonly left: {
            readonly type: ParameterType.STRING;
          };
          readonly right: {
            readonly type: ParameterType.STRING;
          };
        };
      };
      /** An object with two keys, `left` and `right`, containing the alternatives selected on the left and right columns.
       * This will be encoded as a JSON string when data is saved using the `.json()` or `.csv()` functions. */
      readonly response: {
        readonly type: ParameterType.COMPLEX;
        readonly parameters: {
          readonly left: {
            readonly type: ParameterType.STRING;
          };
          readonly right: {
            readonly type: ParameterType.STRING;
          };
        };
      };
    };
  };
  constructor(jsPsych: JsPsych);
  trial(display_element: HTMLElement, trial: TrialType<Info>): void;
  simulate(
    trial: TrialType<Info>,
    simulation_mode: any,
    simulation_options: any,
    load_callback: () => void
  ): void;
  private create_simulation_data;
  private simulate_data_only;
  private simulate_visual;
}

export { MaxdiffPlugin as default };
