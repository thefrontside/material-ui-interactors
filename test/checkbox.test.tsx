import { test, Page } from "bigtest";
import { Body, Checkbox } from "../src/index";
import { Checkbox as Component, FormControlLabel } from "@material-ui/core";
import { render } from "./helpers";

export default test("Checkbox")
  .step(Page.visit("/"))
  .child("test `filter` by locator", (test) =>
    test
      .step("render", () => render(<FormControlLabel label="locator" control={<Component />} />))
      .assertion(Checkbox("locator").exists())
  )
  .child("test `filter` by checked", (test) =>
    test
      .step("render", () => render(<FormControlLabel label="checked" checked control={<Component />} />))
      .assertion(Checkbox({ checked: true }).exists())
  )
  .child("test `filter` by indeterminate", (test) =>
    test
      .step("render", () => render(<FormControlLabel label="indeterminate" control={<Component indeterminate />} />))
      .assertion(Checkbox({ indeterminate: true }).exists())
  )
  .child("test `filter` by disabled", (test) =>
    test
      .step("render", () => render(<FormControlLabel label="disabled" disabled control={<Component />} />))
      .assertion(Checkbox({ disabled: true }).exists())
  )
  .child("test `filter` by visible", (test) =>
    test.step("render", () => render(<Component />)).assertion(Checkbox({ visible: false }).exists())
  )
  .child("test `click` action", (test) =>
    test
      .step("render", () => render(<FormControlLabel label="checkbox" control={<Component />} />))
      .assertion(Checkbox().is({ checked: false, focused: false }))
      .child("click and assert", (test) =>
        test.step(Checkbox().click()).assertion(Checkbox().is({ checked: true, focused: true }))
      )
  )
  .child("test `focus` action", (test) =>
    test
      .step("render", () => render(<FormControlLabel label="checkbox" control={<Component />} />))
      .assertion(Checkbox().is({ focused: false }))
      .child("focus and assert", (test) => test.step(Checkbox().focus()).assertion(Checkbox().is({ focused: true })))
  )
  .child("test `blur` action", (test) =>
    test
      .step("render", () => render(<FormControlLabel label="checkbox" control={<Component autoFocus />} />))
      .assertion(Checkbox().is({ focused: true }))
      .child("blur and assert", (test) => test.step(Checkbox().blur()).assertion(Checkbox().is({ focused: false })))
  )
  .child("test `check` action", (test) =>
    test
      .step("render", () => render(<FormControlLabel label="checkbox" control={<Component />} />))
      .assertion(Checkbox().is({ checked: false }))
      .child("check and assert", (test) => test.step(Checkbox().check()).assertion(Checkbox().is({ checked: true })))
  )
  .child("test `uncheck` action", (test) =>
    test
      .step("render", () => render(<FormControlLabel label="checkbox" control={<Component defaultChecked />} />))
      .assertion(Checkbox().is({ checked: true }))
      .child("uncheck and assert", (test) =>
        test.step(Checkbox().uncheck()).assertion(Checkbox().is({ checked: false }))
      )
  )
  .child("test `toggle` action", (test) =>
    test
      .step("render", () => render(<FormControlLabel label="checkbox" control={<Component />} />))
      .assertion(Checkbox().is({ checked: false }))
      .child("toggle twice", (test) =>
        test
          .step(Checkbox().toggle())
          .assertion(Checkbox().is({ checked: true }))
          .child("second toggle", (test) => test.step(Checkbox().toggle()).assertion(Checkbox().is({ checked: false })))
      )
  )
  .child("test click outside", (test) =>
    test
      .step("render", () => render(<FormControlLabel label="checkbox" control={<Component autoFocus />} />))
      .step("click to the body", () => Body().click())
      .assertion(Checkbox().is({ focused: false }))
  );
