import "date-fns";
import { createElement, useState } from "react";
import { test, Page } from "bigtest";
import { Calendar as Component, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { Calendar } from "../src";
import { render } from "./helpers";

const renderComponent = () =>
  render(
    createElement(() => {
      const [selectedDate, setSelectedDate] = useState<Date | null>(new Date("2014-08-18T21:11:54"));
      return (
        <MuiPickersUtilsProvider utils={DateFnsUtils}>
          <Component onChange={setSelectedDate} date={selectedDate} />
        </MuiPickersUtilsProvider>
      );
    })
  );

export default test("Calendar")
  .step(Page.visit("/"))
  .child("filter by locator", (test) =>
    test.step("render", renderComponent).assertion(Calendar("18 August 2014").exists())
  )
  .child("filter by title", (test) =>
    test.step("render", renderComponent).assertion(Calendar({ title: "August 2014" }).exists())
  )
  .child("filter by selectedDay", (test) =>
    test.step("render", renderComponent).assertion(Calendar({ selectedDay: 18 }).exists())
  )
  .child("filter by weekDay", (test) =>
    test.step("render", renderComponent).assertion(Calendar({ weekDay: "Mo" }).exists())
  )
  .child("nextMonth action", (test) =>
    test
      .step("render", renderComponent)
      .step("nextMonth", () => Calendar().nextMonth())
      .assertion(Calendar().has({ title: "September 2014" }))
  )
  .child("`prevMonth` action", (test) =>
    test
      .step("render", renderComponent)
      .step("prevMonth", () => Calendar().prevMonth())
      .assertion(Calendar().has({ title: "July 2014" }))
  )
  .child("`selectDay` action", (test) =>
    test
      .step("render", renderComponent)
      .step("selectDay", () => Calendar().selectDay(15))
      .assertion(Calendar("15 August 2014").exists())
  );
