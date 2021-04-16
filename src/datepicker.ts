import { bigtestGlobals } from "@bigtest/globals";
import { createInteractor, TextField } from "bigtest";
import { isHTMLElement } from "../test/helpers";
import { Calendar, getDay } from "./calendar";

const pickerSelector = [
  '.MuiPopover-root[role="presentation"] .MuiPickersBasePicker-container',
  '.MuiDialog-root[role="dialog"] .MuiPickersModal-dialogRoot',
].join(", ");

function getRootElement(element: HTMLElement) {
  const root = element.parentElement?.parentElement;
  return root?.classList.contains("MuiFormControl-root") ? root : null;
}

function openCalendar(element: HTMLElement) {
  const button = element.parentElement?.querySelector(".MuiButtonBase-root") ?? element.parentElement;
  if (isHTMLElement(button)) button.click();
}

function getCurrentDay() {
  return new Promise<number | undefined>(
    async (resolve) =>
      await Picker()
        .find(Calendar())
        .perform((element) => resolve(getDay(element)))
  );
}

function getDialogActionButtons(element: HTMLElement) {
  const buttons = element.querySelectorAll(".MuiDialogActions-root > button");
  return buttons
    ? (Array.from(buttons).filter((button) => isHTMLElement(button, "Button")) as HTMLButtonElement[])
    : [];
}

function getLastPicker() {
  return Array.from(bigtestGlobals.document.querySelectorAll(pickerSelector)).slice(-1)[0];
}

const Picker = createInteractor<HTMLElement>("MUI Picker")
  .selector(pickerSelector)
  .filters({
    last: { apply: (element) => element == getLastPicker(), default: true },
  })
  .actions({
    clear: ({ perform }, clearLabel = "Clear") =>
      perform((element) =>
        getDialogActionButtons(element)
          .find((button) => button.innerText.toLowerCase() == clearLabel.toLowerCase())
          ?.click()
      ),
    today: ({ perform }, todayLabel = "Today") =>
      perform((element) =>
        getDialogActionButtons(element)
          .find((button) => button.innerText.toLowerCase() == todayLabel.toLowerCase())
          ?.click()
      ),
    cancel: ({ perform }) => perform((element) => getDialogActionButtons(element).slice(-2)[0]?.click()),
    ok: ({ perform }) => perform((element) => getDialogActionButtons(element).slice(-1)[0]?.click()),
  });

const PickerToolbar = createInteractor<HTMLElement>("MUI PickerToolbar").selector(".MuiPickersToolbar-toolbar");

const YearView = createInteractor<HTMLElement>("MUI YearView")
  .selector(".MuiPickersYearSelection-container")
  .actions({
    select: ({ perform }, year: number) =>
      perform((element) =>
        (Array.from(element.children).find((child) => isHTMLElement(child) && child.innerText == String(year)) as
          | HTMLElement
          | undefined)?.click()
      ),
  });

// TODO Only work with utils
const MonthView = createInteractor<HTMLElement>("MUI MonthView").selector(".MuiPickersMonthSelection-container");

// TODO export const getDatePicker = (utils: ReturnType<typeof useUtils>) =>

// TODO createInteractor?
// TODO Keyabord extends from it
export const DatePicker = TextField.extend<HTMLInputElement>("MUI DatePicker")
  .selector(".MuiFormControl-root[format] input[readonly], .MuiFormControl-root:not([format]) input:not([readonly])")
  .filters({
    valid: (element) => !element.labels?.[0].classList.contains("Mui-error"),
    readOnly: (element) => getRootElement(element)?.hasAttribute("readonly") == true,
    format: (element) => getRootElement(element)?.getAttribute("format"),
  })
  .actions({
    setYear: async (interactor, year: number) => {
      await interactor.perform(openCalendar);
      try {
        await Picker()
          .find(PickerToolbar())
          .perform((element) => element.querySelector("button")?.click());
        await Picker().find(YearView()).select(year);
      } catch (_) {
        // NOTE Probably the toolbar is disabled
        const currentDay = await getCurrentDay();
        await Picker().find(Calendar()).setYear(year);
        if (currentDay) await Picker().find(Calendar()).setDay(currentDay);
      }
      await Picker().ok();
    },
    setMonth: async (interactor, month: string) => {
      // TODO Output error for monthview to use getDatePicker with utils
      await interactor.perform(openCalendar);
      const currentDay = await getCurrentDay();
      await Picker().find(Calendar()).setMonth(month);
      if (currentDay) await Picker().find(Calendar()).setDay(currentDay);
      await Picker().ok();
    },
    setDay: async (interactor, day: number) => {
      await interactor.perform(openCalendar);
      await Picker().find(Calendar()).setDay(day);
      await Picker().ok();
    },
    setDate: async (interactor, targetDate: { day?: number; month?: string; year?: number }) => {
      await interactor.perform(openCalendar);
      if (targetDate.year) await Picker().find(Calendar()).setYear(targetDate.year);
      if (targetDate.month) await Picker().find(Calendar()).setMonth(targetDate.month);
      if (targetDate.day) await Picker().find(Calendar()).setDay(targetDate.day);
      await Picker().ok();
    },
    setToday: async (interactor, todayLabel?: string) => {
      await interactor.perform(openCalendar);
      await Picker().today(todayLabel);
      await Picker().ok();
    },
    clear: async (interactor, clearLabel?: string) => {
      await interactor.perform(openCalendar);
      await Picker().clear(clearLabel);
    },
  });

// NOTE the TextField fillIn doesn't work and doesn't trigger date change event
// export const KeyboardDatePicker = TextField.extend<HTMLInputElement>("MUI KeyboardDatePicker")
//   .selector(".MuiFormControl-root:not([format]) input:not([readonly])")
//   .filters({
//     error: (element) => {
//       return element.labels?.[0].classList.contains("Mui-error");
//     },
//   });

// export const StaticDatePicker = createInteractor<HTMLElement>("MUI StaticDatePicker").selector(
//   ".MuiPickersStaticWrapper-staticWrapperRoot"
// );
