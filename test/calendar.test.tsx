import "date-fns";
import { test, Page } from "bigtest";
import { Calendar as Component, MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";
import { Calendar } from "../src";
import { render } from "./helpers";

export default test("Calendar")
  .step(Page.visit("/"))
  .child("test `filter` by locator", (test) =>
    test
      .step("render", () =>
        render(
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Component onChange={() => {}} date={new Date("2014-08-18T21:11:54")} />
          </MuiPickersUtilsProvider>
        )
      )
      .assertion(Calendar("18 August 2014").exists())
  )
  .child("test `filter` by header", (test) =>
    test
      .step("render", () =>
        render(
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Component onChange={() => {}} date={new Date("2014-08-18T21:11:54")} />
          </MuiPickersUtilsProvider>
        )
      )
      .assertion(Calendar({ header: "August 2014" }).exists())
  )
  .child("test `filter` by selectedDay", (test) =>
    test
      .step("render", () =>
        render(
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Component onChange={() => {}} date={new Date("2014-08-18T21:11:54")} />
          </MuiPickersUtilsProvider>
        )
      )
      .assertion(Calendar({ selectedDay: 18 }).exists())
  )
  .child("test `filter` by weekDay", (test) =>
    test
      .step("render", () =>
        render(
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            <Component onChange={() => {}} date={new Date("2014-08-18T21:11:54")} />
          </MuiPickersUtilsProvider>
        )
      )
      .assertion(Calendar({ weekDay: "Mo" }).exists())
  );
