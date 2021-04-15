import { Page, test, TestBuilder } from "bigtest";
import { DatePicker as Component } from "@material-ui/pickers";
import { getPickerRenderer } from "./helpers";
import { DatePicker } from "../src";
import { ComponentProps } from "react";

const renderComponent = getPickerRenderer(Component);

const actionTests = (props?: Partial<ComponentProps<typeof Component>>) => (
  test: TestBuilder<Record<string, unknown>>
) => {
  test = test
    .child("setDay action", (test) =>
      test
        .step(renderComponent(props))
        .step("set 21st day", () => DatePicker().setDay(21))
        .assertion(DatePicker().has({ value: "August 21st" }))
    )
    .child("setMonth action", (test) =>
      test
        .step(renderComponent(props))
        .step("set September", () => DatePicker().setMonth("September"))
        .assertion(DatePicker().has({ value: "September 18th" }))
    )
    .child("setYear action", (test) =>
      test
        .step(renderComponent({ ...props, format: "MM/dd/yyyy" }))
        .step("set 2015", () => DatePicker().setYear(2015))
        .assertion(DatePicker().has({ value: "08/18/2015" }))
    )
    .child("setDate action", (test) =>
      test
        .step(renderComponent({ ...props, format: "MM/dd/yyyy" }))
        .step("set September 21th 2015", () => DatePicker().setDate({ day: 21, month: "September", year: 2015 }))
        .assertion(DatePicker().has({ value: "09/21/2015" }))
    );

  if (props?.variant != "inline") {
    test = test
      .child("setToday action", (test) =>
        test
          .step(renderComponent({ ...props, format: "yyyy-MM-dd", showTodayButton: true, todayLabel: "Now" }))
          .step("set today", () => DatePicker().setToday("Now"))
          .assertion(DatePicker().has({ value: new Date().toISOString().replace(/T.*$/, "") }))
      )
      .child("clear action", (test) =>
        test
          .step(renderComponent({ ...props, clearable: true, clearLabel: "Empty" }))
          .step("clear", () => DatePicker().clear("Empty"))
          .assertion(DatePicker().has({ value: "" }))
      );
  }

  return test;
};

export default test("DatePicker")
  .step(Page.visit("/"))
  .child("filter by locator and value", (test) =>
    test
      .step(renderComponent())
      .assertion(DatePicker("2014-08-18").exists())
      .assertion(DatePicker({ value: "August 18th" }).exists())
  )
  .child("filter by value with format", (test) =>
    test.step(renderComponent({ format: "MM/dd/yyyy" })).assertion(DatePicker({ value: "08/18/2014" }).exists())
  )
  .child("filter by valid", (test) =>
    test.step(renderComponent({ value: "1234-56-78" })).assertion(DatePicker({ valid: false }).exists())
  )
  .child("filter by disabled", (test) =>
    test.step(renderComponent({ disabled: true })).assertion(DatePicker({ disabled: true }).exists())
  )
  .child("filter by visible", (test) =>
    test.step(renderComponent({ style: { visibility: "hidden" } })).assertion(DatePicker({ visible: false }).exists())
  )
  .child("filter by readOnly", (test) =>
    test.step(renderComponent({ readOnly: true })).assertion(DatePicker({ readOnly: true }).exists())
  )
  .child("filter by format", (test) =>
    test.step(renderComponent({ format: "MM/dd/yyyy" })).assertion(DatePicker({ format: "MM/dd/yyyy" }).exists())
  )
  .child("default", actionTests())
  .child("orientation='landscape'", actionTests({ orientation: "landscape" }))
  .child("variant='inline'", actionTests({ variant: "inline" }))
  .child("autoOk", actionTests({ autoOk: true }))
  .child("disableToolbar", actionTests({ disableToolbar: true }));

// TODO views={['month', 'date']}

// openTo - "date" | "year" | "month"
// variant - "dialog" | "inline" | "static"
// views - Array<"year" | "date" | "month">

//inputVariant - string
//invalidDateMessage - react node
//emptyLabel - string
//maxDateMessage, minDateMessage - react node
//TextFieldComponent ??
//ToolbarComponent ??

// mask for keyboard :(
// TODO DateTimePicker
