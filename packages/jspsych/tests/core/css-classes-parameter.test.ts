import htmlKeyboardResponse from "@jspsych/plugin-html-keyboard-response";

import { JsPsych, initJsPsych } from "../../src";
import { pressKey } from "../utils";

let jsPsych: JsPsych;

describe("The css_classes parameter for trials", function () {
  test("Adds a single CSS class to the root jsPsych element", function () {
    var trial = {
      type: htmlKeyboardResponse,
      stimulus: "<p>foo</p>",
      css_classes: ["foo"],
    };

    jsPsych = initJsPsych({ timeline: [trial] });

    expect(jsPsych.getDisplayElement().classList).toContain("foo");
    pressKey("a");
  });

  test("Gracefully handles single class when not in array", function () {
    var trial = {
      type: htmlKeyboardResponse,
      stimulus: "<p>foo</p>",
      css_classes: "foo",
    };

    jsPsych = initJsPsych({ timeline: [trial] });

    expect(jsPsych.getDisplayElement().classList).toContain("foo");
    pressKey("a");
  });

  test("Removes the added classes at the end of the trial", function () {
    var trial = {
      type: htmlKeyboardResponse,
      stimulus: "<p>foo</p>",
      css_classes: ["foo"],
    };

    jsPsych = initJsPsych({ timeline: [trial] });

    expect(jsPsych.getDisplayElement().classList).toContain("foo");
    pressKey("a");
    expect(jsPsych.getDisplayElement().classList).not.toContain("foo");
  });

  test("Class inherits in nested timelines", function () {
    var tm = {
      timeline: [
        {
          type: htmlKeyboardResponse,
          stimulus: "<p>foo</p>",
        },
      ],
      css_classes: ["foo"],
    };

    jsPsych = initJsPsych({ timeline: [tm] });

    expect(jsPsych.getDisplayElement().classList).toContain("foo");
    pressKey("a");
    expect(jsPsych.getDisplayElement().classList).not.toContain("foo");
  });

  test("Parameter works when defined as a function", function () {
    var trial = {
      type: htmlKeyboardResponse,
      stimulus: "<p>foo</p>",
      css_classes: function () {
        return ["foo"];
      },
    };

    jsPsych = initJsPsych({ timeline: [trial] });

    expect(jsPsych.getDisplayElement().classList).toContain("foo");
    pressKey("a");
    expect(jsPsych.getDisplayElement().classList).not.toContain("foo");
  });

  test("Parameter works when defined as a timeline variable", function () {
    var trial = {
      type: htmlKeyboardResponse,
      stimulus: "<p>foo</p>",
      css_classes: jsPsych.timelineVariable("css"),
    };

    var t = {
      timeline: [trial],
      timeline_variables: [{ css: ["foo"] }],
    };

    jsPsych = initJsPsych({ timeline: [t] });

    expect(jsPsych.getDisplayElement().classList).toContain("foo");
    pressKey("a");
    expect(jsPsych.getDisplayElement().classList).not.toContain("foo");
  });
});
