import { HTML } from "bigtest";
import { isHTMLElement } from "../test/helpers";

function getHeaderElement(element: HTMLElement) {
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
export const Calendar = HTML.extend("MUI Calendar")
  .selector(".MuiPickersCalendar-transitionContainer")
  .locator((element) => {
    const header = getHeaderElement(element)?.innerText;
    const selectedDay = getSelectedElement(element)?.innerText;
    return [selectedDay, header].filter(Boolean).join(" ");
  })
  .filters({
    header: (element) => getHeaderElement(element)?.innerText,
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
    // TODO nextMonth
    // TODO prevMonth
    // TODO selectDay
  });
