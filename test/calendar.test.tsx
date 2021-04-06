import { cloneElement } from "react";
import { test, Page } from "bigtest";
import { Calendar as Component } from "@material-ui/pickers";
import { Calendar } from "../src";
import { getPickerRenderer } from "./helpers";

const renderComponent = getPickerRenderer(Component);

export default test("Calendar")
  .step(Page.visit("/"))
  .child("filter by locator", (test) =>
    test.step("render", renderComponent()).assertion(Calendar("18 August 2014").exists())
  )
  .child("filter by title", (test) =>
    test.step("render", renderComponent()).assertion(Calendar({ title: "August 2014" }).exists())
  )
  .child("filter by month", (test) =>
    test.step("render", renderComponent()).assertion(Calendar({ month: "August" }).exists())
  )
  .child("filter by year", (test) =>
    test.step("render", renderComponent()).assertion(Calendar({ year: "2014" }).exists())
  )
  .child("filter by selectedDay", (test) =>
    test.step("render", renderComponent()).assertion(Calendar({ selectedDay: 18 }).exists())
  )
  .child("filter by weekDay", (test) =>
    test.step("render", renderComponent()).assertion(Calendar({ weekDay: "Mo" }).exists())
  )
  .child("nextMonth action", (test) =>
    test
      .step("render", renderComponent())
      .step("go to next month", () => Calendar().nextMonth())
      .assertion(Calendar().has({ title: "September 2014" }))
  )
  .child("prevMonth action", (test) =>
    test
      .step("render", renderComponent())
      .step("go to prev month", () => Calendar().prevMonth())
      .assertion(Calendar().has({ title: "July 2014" }))
  )
  // TODO Add tests with min/max date
  // TODO Don't work
  // │ Unknown error occurred: This is likely a bug in BigTest and should be reported at https://github.com/thefrontside/bigtest/issues.
  // .child("setMonth action", (test) =>
  //   test
  //     .child("in future", (test) =>
  //       test
  //         .step("render", renderComponent())
  //         .step("go to September", () => Calendar().setMonth("September"))
  //         .assertion(Calendar().has({ title: "September 2015" }))
  //     )
  //     .child("in past", (test) =>
  //       test
  //         .step("render", renderComponent())
  //         .step("go to July", () => Calendar().setMonth("July"))
  //         .assertion(Calendar().has({ title: "July 2013" }))
  //     )
  // )
  // TODO Don't work
  // │ Unknown error occurred: This is likely a bug in BigTest and should be reported at https://github.com/thefrontside/bigtest/issues.
  // .child("setYear action", (test) =>
  //   test
  //     .child("in future", (test) =>
  //       test
  //         .step("render", renderComponent())
  //         .step("go to 2015", () => Calendar().setYear(2015))
  //         .assertion(Calendar().has({ title: "August 2015" }))
  //     )
  //     .child("in past", (test) =>
  //       test
  //         .step("render", renderComponent())
  //         .step("go to 2013", () => Calendar().setYear(2013))
  //         .assertion(Calendar().has({ title: "August 2013" }))
  //     )
  // )
  .child("selectDay action", (test) =>
    test
      .step("render", renderComponent())
      .step("select the 15th day", () => Calendar().selectDay(15))
      .assertion(Calendar("15 August 2014").exists())
  )
  // TODO What should do if user want to click on the disabled `nextMonth` button? Raise exception? Do nothing?
  // TODO How to test an exception with BigTest?
  // TODO The same for `prevMonth` and `selectDay` and `shouldDisableDate`
  // TODO Props to test `disableFuture`, `disablePast`, `maxDate`, `minDate`
  // .child("nextMonth action with disableFuture", (test) =>
  //   test
  //     .step("render", renderComponent({ date: new Date(), disableFuture: true }))
  //     .step("try go to next month", () => Calendar().nextMonth())
  //     .assertion(Calendar().has({ title: "???" }))
  // )
  .child("selectDay action on disabled day", (test) =>
    test
      .step("render", renderComponent({ maxDate: new Date("2014-08-18") }))
      .step("select the 20th day", () => Calendar().selectDay(20))
      // TODO Test exception message?
      .assertion(Calendar("18 August 2014").exists())
  )
  .child("selectDay action with fully custom day render", (test) =>
    test
      .step(
        "render",
        renderComponent({
          renderDay: (day, _selectedDate, dayInCurrentMonth, _dayComponent) => (
            <button hidden={!dayInCurrentMonth}>{day?.getDate()}</button>
          ),
        })
      )
      .step("select the 20th day", () => Calendar().selectDay(20))
      // NOTE There is no way to filter by selected day with a fully custom day render
      // But we still be able do day clicks, just can't test it ¯\_(ツ)_/¯
      .assertion(Calendar("August 2014").exists())
  )
  .child(
    "selectDay action with 'semi-transparent' days",
    (test) =>
      test.step(
        "render",
        // NOTE: Another `cool` thing we can render days from prev/next months and they are clickable
        renderComponent((onChange) => ({
          renderDay: (day, _selectedDate, dayInCurrentMonth, dayComponent) =>
            cloneElement(dayComponent, {
              hidden: false,
              ...(dayInCurrentMonth
                ? undefined
                : { style: { opacity: "0.5" }, onClick: () => onChange?.(day as Date) }),
            }),
        }))
      )
    // TODO But 4th day appears twice :(
    // .step("select the 4th day", () => Calendar().selectDay(4))
    // .assertion(Calendar("4 September 2014").exists())
  )
  .child("nextMonth action with custom icon", (test) =>
    test
      .step("render", renderComponent({ rightArrowIcon: <span /> }))
      .step("go to next month", () => Calendar().nextMonth())
      .assertion(Calendar().has({ title: "September 2014" }))
  )
  .child("prevMonth action with custom icon", (test) =>
    test
      .step("render", renderComponent({ leftArrowIcon: <span /> }))
      .step("go to prev month", () => Calendar().prevMonth())
      .assertion(Calendar().has({ title: "July 2014" }))
  );

// TODO SetMonth, try to go next/prev month until wanted month, check year. If we went in wrong direction, go back
// TODO SetYear because we know current year
