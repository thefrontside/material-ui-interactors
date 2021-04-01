import { createInteractor, HTML, including, not } from "bigtest";
import { isHTMLElement } from "../test/helpers";

function getHeaderElement(element: HTMLElement) {
  const header = element.parentElement?.querySelector(".MuiPickersCalendarHeader-switchHeader");
  return isHTMLElement(header) ? header : null;
}

function getTitleElement(element: HTMLElement) {
  const header = element.parentElement?.querySelector(".MuiPickersCalendarHeader-transitionContainer");
  return isHTMLElement(header) ? header : null;
}

function getWeekDaysElement(element: HTMLElement) {
  const daysHeader = element.parentElement?.querySelector(".MuiPickersCalendarHeader-daysHeader");
  return isHTMLElement(daysHeader) ? daysHeader : null;
}

function getSelectedElement(element: HTMLElement) {
  const dayButton = element.querySelector(".MuiPickersDay-daySelected");
  return isHTMLElement(dayButton) ? dayButton : null;
}

export const Calendar = createInteractor<HTMLElement>("MUI Calendar")
  .selector(".MuiPickersCalendar-transitionContainer")
  .locator((element) => {
    const header = getTitleElement(element)?.innerText;
    const selectedDay = getSelectedElement(element)?.innerText;
    return [selectedDay, header].filter(Boolean).join(" ");
  })
  .filters({
    title: (element) => getTitleElement(element)?.innerText,
    selectedDay: (element) => {
      const text = getSelectedElement(element)?.innerText;
      const day = text ? parseInt(text) : NaN;
      return Number.isNaN(day) ? undefined : day;
    },
    weekDay: (element) => {
      const rootDayElement = getSelectedElement(element)?.parentElement;
      const weekIndex = rootDayElement
        ? Array.from(rootDayElement?.parentElement?.children ?? []).indexOf(rootDayElement)
        : -1;
      const weekDayElement = weekIndex != -1 ? getWeekDaysElement(element)?.children.item(weekIndex) : null;
      return isHTMLElement(weekDayElement) ? weekDayElement.innerText : undefined;
    },
  })
  .actions({
    nextMonth: ({ perform }) =>
      perform((element) => {
        // NOTE: We can't go upwards by using `Interactor().find(...)`
        const nextMonthElement = getHeaderElement(element)?.lastElementChild;
        if (isHTMLElement(nextMonthElement)) nextMonthElement.click();
      }),
    prevMonth: ({ perform }) =>
      perform((element) => {
        // NOTE: We can't go upwards by using `Interactor().find(...)`
        const prevMonthElement = getHeaderElement(element)?.firstElementChild;
        if (isHTMLElement(prevMonthElement)) prevMonthElement.click();
      }),
    selectDay: async (interactor, day: number) => {
      const dayInteractor = await interactor.find(
        HTML.selector(".MuiPickersCalendar-week > [role='presentation']")(String(day))
      );
      // TODO We need better message for that
      // await dayInteractor.has({ className: not(including("MuiPickersDay-dayDisabled")) });
      // Instead of
      /*
        │ ╒═ Filter:   className
        │ ├─ Expected: not including "MuiPickersDay-dayDisabled"
        │ └─ Received: "MuiButtonBase-root MuiIconButton-root MuiPickersDay-day MuiPickersDay-dayDisabled"
      */
      await dayInteractor.click();
    },
  });
