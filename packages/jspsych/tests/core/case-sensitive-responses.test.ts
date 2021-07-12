import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { JsPsych, initJsPsych } from "../../src";
import { pressKey } from "../utils";

let jsPsych: JsPsych;

describe("case_sensitive_responses parameter", function () {
  test("has a default value of false", function () {
    var t = {
      type: htmlKeyboardResponse,
      stimulus: "foo",
      choices: ["a"],
    };

    jsPsych = initJsPsych({ timeline: [t] });

    expect(jsPsych.getDisplayElement().innerHTML).toMatch("foo");
    pressKey("A");
    expect(jsPsych.getDisplayElement().innerHTML).toMatch("");
  });

  test("responses are not case sensitive when set to false", function () {
    var t = {
      type: htmlKeyboardResponse,
      stimulus: "foo",
      choices: ["a"],
    };

    jsPsych = initJsPsych({ timeline: [t], case_sensitive_responses: false });

    expect(jsPsych.getDisplayElement().innerHTML).toMatch("foo");
    pressKey("A");
    expect(jsPsych.getDisplayElement().innerHTML).toMatch("");
  });

  test("responses are case sensitive when set to true", function () {
    var t = {
      type: htmlKeyboardResponse,
      stimulus: "foo",
      choices: ["a"],
    };

    jsPsych = initJsPsych({ timeline: [t], case_sensitive_responses: true });

    expect(jsPsych.getDisplayElement().innerHTML).toMatch("foo");
    pressKey("A");
    expect(jsPsych.getDisplayElement().innerHTML).toMatch("foo");
    pressKey("a");
    expect(jsPsych.getDisplayElement().innerHTML).toMatch("");
  });
});
