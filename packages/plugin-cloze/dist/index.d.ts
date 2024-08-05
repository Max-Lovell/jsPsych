import { JsPsych, JsPsychPlugin, ParameterType, TrialType } from "jspsych";

declare const info: {
  readonly name: "cloze";
  readonly version: string;
  readonly parameters: {
    /** The cloze text to be displayed. Blanks are indicated by %% signs and automatically replaced by input fields. If there is a correct answer you want the system to check against, it must be typed between the two percentage signs (i.e. % correct solution %). */
    readonly text: {
      readonly type: ParameterType.HTML_STRING;
      readonly default: any;
    };
    /** Text of the button participants have to press for finishing the cloze test. */
    readonly button_text: {
      readonly type: ParameterType.STRING;
      readonly default: "OK";
    };
    /** Boolean value indicating if the answers given by participants should be compared against a correct solution given in the text (between % signs) after the button was clicked. If ```true```, answers are checked and in case of differences, the ```mistake_fn``` is called. In this case, the trial does not automatically finish. If ```false```, no checks are performed and the trial automatically ends when clicking the button. */
    readonly check_answers: {
      readonly type: ParameterType.BOOL;
      readonly default: false;
    };
    /** Boolean value indicating if the answers given by participants should be checked for completion after the button was clicked. If ```true```, answers are not checked for completion and blank answers are allowed. The trial will then automatically finish upon the clicking the button. If ```false```, answers are checked for completion, and in case there are some fields with missing answers, the ```mistake_fn``` is called. In this case, the trial does not automatically finish. */
    readonly allow_blanks: {
      readonly type: ParameterType.BOOL;
      readonly default: true;
    };
    /** Function called if ```check_answers``` is set to ```true``` and there is a difference between the participant's answers and the correct solution provided in the text, or if ```allow_blanks``` is set to ```false``` and there is at least one field with a blank answer. */
    readonly mistake_fn: {
      readonly type: ParameterType.FUNCTION;
      readonly default: () => void;
    };
  };
  readonly data: {
    /** Answers the partcipant gave. */
    readonly response: {
      readonly type: ParameterType.STRING;
      readonly array: true;
    };
  };
};
type Info = typeof info;
/**
 * This plugin displays a text with certain words omitted. Participants are asked to replace the missing items. Responses are recorded when clicking a button. Responses can be evaluated and a function is called in case of either differences or incomplete answers, making it possible to inform participants about mistakes before proceeding.
 *
 * @author Philipp Sprengholz
 * @see {@link https://www.jspsych.org/latest/plugins/cloze/ cloze plugin documentation on jspsych.org}
 */
declare class ClozePlugin implements JsPsychPlugin<Info> {
  private jsPsych;
  static info: {
    readonly name: "cloze";
    readonly version: string;
    readonly parameters: {
      /** The cloze text to be displayed. Blanks are indicated by %% signs and automatically replaced by input fields. If there is a correct answer you want the system to check against, it must be typed between the two percentage signs (i.e. % correct solution %). */
      readonly text: {
        readonly type: ParameterType.HTML_STRING;
        readonly default: any;
      };
      /** Text of the button participants have to press for finishing the cloze test. */
      readonly button_text: {
        readonly type: ParameterType.STRING;
        readonly default: "OK";
      };
      /** Boolean value indicating if the answers given by participants should be compared against a correct solution given in the text (between % signs) after the button was clicked. If ```true```, answers are checked and in case of differences, the ```mistake_fn``` is called. In this case, the trial does not automatically finish. If ```false```, no checks are performed and the trial automatically ends when clicking the button. */
      readonly check_answers: {
        readonly type: ParameterType.BOOL;
        readonly default: false;
      };
      /** Boolean value indicating if the answers given by participants should be checked for completion after the button was clicked. If ```true```, answers are not checked for completion and blank answers are allowed. The trial will then automatically finish upon the clicking the button. If ```false```, answers are checked for completion, and in case there are some fields with missing answers, the ```mistake_fn``` is called. In this case, the trial does not automatically finish. */
      readonly allow_blanks: {
        readonly type: ParameterType.BOOL;
        readonly default: true;
      };
      /** Function called if ```check_answers``` is set to ```true``` and there is a difference between the participant's answers and the correct solution provided in the text, or if ```allow_blanks``` is set to ```false``` and there is at least one field with a blank answer. */
      readonly mistake_fn: {
        readonly type: ParameterType.FUNCTION;
        readonly default: () => void;
      };
    };
    readonly data: {
      /** Answers the partcipant gave. */
      readonly response: {
        readonly type: ParameterType.STRING;
        readonly array: true;
      };
    };
  };
  constructor(jsPsych: JsPsych);
  trial(display_element: HTMLElement, trial: TrialType<Info>): void;
  private getSolutions;
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

export { ClozePlugin as default };
