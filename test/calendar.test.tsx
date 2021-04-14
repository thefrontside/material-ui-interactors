import { test, Page } from "bigtest";
import { Calendar as Component } from "@material-ui/pickers";
import { Calendar, getCalendar } from "../src";
import { getPickerRenderer } from "./helpers";
import DateFnsUtils from "@date-io/date-fns";

const renderComponent = getPickerRenderer(Component);
const CalendarWithUtils = getCalendar(new DateFnsUtils());

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
  .child("filter by day", (test) => test.step("render", renderComponent()).assertion(Calendar({ day: 18 }).exists()))
  .child("filter by weekDay", (test) =>
    test.step("render", renderComponent()).assertion(Calendar({ weekDay: "Mo" }).exists())
  )
  // TODO Don't work well on different environments
  // .child("filter by date", (test) =>
  //   test.step("render", renderComponent()).assertion(CalendarWithUtils({ date: new Date("2014-08-18") }).exists())
  // )
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
  .child("setYear action", (test) =>
    test
      .child("in future", (test) =>
        test
          .step("render", renderComponent())
          .step("go to 2015", () => Calendar().setYear(2015))
          .assertion(Calendar().has({ title: "August 2015" }))
      )
      .child("in past", (test) =>
        test
          .step("render", renderComponent())
          .step("go to 2013", () => Calendar().setYear(2013))
          .assertion(Calendar().has({ title: "August 2013" }))
      )
  )
  .child("setMonth action", (test) =>
    test
      .child("in future", (test) =>
        test
          .step("render", renderComponent())
          .step("go to September", () => Calendar().setMonth("September"))
          .assertion(Calendar().has({ title: "September 2014" }))
      )
      .child("in past", (test) =>
        test
          .step("render", renderComponent())
          .step("go to July", () => Calendar().setMonth("July"))
          .assertion(Calendar().has({ title: "July 2014" }))
      )
  )
  .child("setMonth action with utils", (test) =>
    test
      .child("in future", (test) =>
        test
          .step("render", renderComponent())
          .step("go to September", () => CalendarWithUtils().setMonth("September"))
          .assertion(Calendar().has({ title: "September 2014" }))
      )
      .child("in past", (test) =>
        test
          .step("render", renderComponent())
          .step("go to July", () => CalendarWithUtils().setMonth("July"))
          .assertion(Calendar().has({ title: "July 2014" }))
      )
  )
  .child("setDay action", (test) =>
    test
      .step("render", renderComponent())
      .step("select the 15th day", () => Calendar().setDay(15))
      .assertion(Calendar("15 August 2014").exists())
  )
  // TODO What should do if user want to click on the disabled `nextMonth` button? Raise exception? Do nothing?
  // TODO How to test an exception with BigTest?
  // TODO The same for `prevMonth` and `setDay` and `shouldDisableDate`
  // TODO Props to test `disableFuture`, `disablePast`, `maxDate`, `minDate`
  // .child("nextMonth action with disableFuture", (test) =>
  //   test
  //     .step("render", renderComponent({ date: new Date(), disableFuture: true }))
  //     .step("try go to next month", () => Calendar().nextMonth())
  //     .assertion(Calendar().has({ title: "???" }))
  // )
  // TODO Test exception message?
  // .child("setDay action on disabled day", (test) =>
  //   test
  //     .step("render", renderComponent({ maxDate: new Date("2014-08-18") }))
  //     .step("select the 20th day", () => Calendar().setDay(20))
  //     .assertion(Calendar("18 August 2014").exists())
  // )
  .child("setDay action with fully custom day render", (test) =>
    test
      .step(
        "render",
        renderComponent({
          renderDay: (day, _selectedDate, dayInCurrentMonth, _dayComponent) => (
            <button hidden={!dayInCurrentMonth}>{day?.getDate()}</button>
          ),
        })
      )
      .step("select the 20th day", () => Calendar().setDay(20))
      // NOTE There is no way to filter by selected day with a fully custom day render
      // But we still be able do day clicks, just can't test it ¯\_(ツ)_/¯
      .assertion(Calendar("August 2014").exists())
  )
  // TODO But 4th day appears twice :(
  // .child(
  //   "setDay action with 'semi-transparent' days",
  //   (test) =>
  //     test.step(
  //       "render",
  //       // NOTE: Another `cool` thing we can render days from prev/next months and they are clickable
  //       renderComponent((onChange) => ({
  //         renderDay: (day, _selectedDate, dayInCurrentMonth, dayComponent) =>
  //           cloneElement(dayComponent, {
  //             hidden: false,
  //             ...(dayInCurrentMonth
  //               ? undefined
  //               : { style: { opacity: "0.5" }, onClick: () => onChange?.(day as Date) }),
  //           }),
  //       }))
  //     )
  //   // .step("select the 4th day", () => Calendar().setDay(4))
  //   // .assertion(Calendar("4 September 2014").exists())
  // )
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
