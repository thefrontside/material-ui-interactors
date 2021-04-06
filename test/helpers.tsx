import "date-fns";
import { bigtestGlobals } from "@bigtest/globals";
import { render as rtlRender } from "@testing-library/react";
import { ComponentProps, ComponentType, createElement, ReactElement, useState } from "react";
import { StylesProvider, jssPreset } from "@material-ui/core/styles";
import { create } from "jss";
import { MuiPickersUtilsProvider } from "@material-ui/pickers";
import DateFnsUtils from "@date-io/date-fns";

export function render(element: ReactElement) {
  let insertion = bigtestGlobals.document.createComment("mui-jss-insertion");
  let insertionPoint = bigtestGlobals.document.head.insertBefore(insertion, bigtestGlobals.document.head.firstChild);
  const jss = create({
    ...jssPreset(),
    // Define a custom insertion point that JSS will look for when injecting the styles into the DOM.
    insertionPoint,
  });

  return rtlRender(
    <StylesProvider jss={jss} injectFirst>
      {element}
    </StylesProvider>,
    {
      container: bigtestGlobals.document.body,
    }
  );
}

type HTMLTypes<T> = T extends `HTML${infer C}Element` ? C : never;

type HTMLElementTypes = HTMLTypes<keyof typeof window>;

export function isHTMLElement<T extends HTMLElementTypes = "">(
  element: unknown | null | undefined,
  type: T = "" as T
): element is InstanceType<typeof window[`HTML${T}Element`]> {
  const { defaultView } = bigtestGlobals.document;
  const Constructor = (defaultView as any)?.[`HTML${type}Element`];
  return typeof Constructor == "function" && element instanceof Constructor;
}

export function getPickerRenderer<T extends ComponentType<any>>(PickerComponent: T) {
  return (
    getProps?:
      | Partial<ComponentProps<typeof PickerComponent>>
      | ((onChange?: (date: Date) => void) => Partial<ComponentProps<typeof PickerComponent>>)
  ) => () =>
    render(
      createElement(() => {
        const props = typeof getProps == "function" ? getProps() : getProps;
        const initialDate = (props?.date ?? new Date("2014-08-18")) as Date;
        const [dateValue, _timeValue] = initialDate
          .toISOString()
          .replace(/\.\d{3}Z$/, "")
          .split("T");
        const [selectedDate, setSelectedDate] = useState<Date | null>(initialDate);
        return (
          <MuiPickersUtilsProvider utils={DateFnsUtils}>
            {/* @ts-expect-error just ignore type props issues */}
            <PickerComponent
              onChange={setSelectedDate}
              date={selectedDate}
              value={selectedDate}
              id={dateValue}
              label={dateValue}
              {...(typeof getProps == "function" ? getProps(setSelectedDate) : getProps)}
            />
          </MuiPickersUtilsProvider>
        );
      })
    );
}
