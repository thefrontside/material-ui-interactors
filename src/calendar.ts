import { createInteractor, HTML, Interactor } from "bigtest";
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

export const getMonth = (element: HTMLElement) => getTitleElement(element)?.innerText.replace(/\s[0-9]{4}$/, "");
export const getYear = (element: HTMLElement) => getTitleElement(element)?.innerText.replace(/.*\s([0-9]{4})$/, "$1");

function getCurrentMonth(interactor: Interactor<HTMLElement, any>) {
  return new Promise((resolve) => interactor.perform((element) => resolve(getMonth(element))));
}
function getCurrentYear(interactor: Interactor<HTMLElement, any>) {
  return new Promise((resolve) =>
    interactor.perform((element) => {
      const yearString = getYear(element);
      const year = yearString ? parseInt(yearString) : NaN;
      resolve(Number.isNaN(year) ? undefined : year);
    })
  );
}

// TODO How do you think, do we need some actions/filters from the HTML interactor?
export const Calendar = createInteractor<HTMLElement>("MUI Calendar")
  .selector(".MuiPickersCalendar-transitionContainer")
  .locator((element) => {
    const header = getTitleElement(element)?.innerText;
    const selectedDay = getSelectedElement(element)?.innerText;
    return [selectedDay, header].filter(Boolean).join(" ");
  })
  .filters({
    month: getMonth,
    year: getYear,
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
    setMonth: async (interactor, targetMonth: string) => {
      //@ts-expect-error
      let directions = [() => interactor.prevMonth(), () => interactor.nextMonth()];
      directions = Math.round(Math.random()) ? directions : directions.reverse();
      let currentMonth = await getCurrentMonth(interactor);
      let currentYear = await getCurrentYear(interactor);

      if (!currentMonth || !currentYear) return; // NOTE: Do we need throw error from here?
      if (currentMonth == targetMonth) return;

      const targetYear = currentYear;
      let direction = directions.shift();
      while (currentYear != targetYear || currentMonth != targetMonth) {
        if (!direction)
          throw new Error(
            `Can't set '${targetMonth}' month. It might happened because of 'minDate/maxDate' or 'disableFuture/disablePast' props`
          );
        await direction();
        const prevMonth = currentMonth;
        currentMonth = await getCurrentMonth(interactor);
        currentYear = await getCurrentYear(interactor);
        if ((currentMonth == targetMonth && currentYear != targetYear) || currentMonth == prevMonth)
          direction = directions.shift();
      }
    },
    setYear: async (interactor, targetYear: number) => {
      let currentMonth = await getCurrentMonth(interactor);
      let currentYear = await getCurrentYear(interactor);

      if (!currentMonth || !currentYear) return; // NOTE: Do we need throw error from here?
      if (currentYear == targetYear) return;
      //@ts-expect-error
      const step = currentYear < targetYear ? () => interactor.nextMonth() : () => interactor.prevMonth();
      const targetMonth = currentMonth;
      while (currentYear != targetYear || currentMonth != targetMonth) {
        await step();
        const prevMonth = currentMonth;
        currentMonth = await getCurrentMonth(interactor);
        currentYear = await getCurrentYear(interactor);
        if (prevMonth == currentMonth)
          throw new Error(
            `Can't set '${targetYear}' year. It might happened because of 'minDate/maxDate' or 'disableFuture/disablePast' props`
          );
      }
    },
    selectDay: (interactor, day: number) => {
      const dayInteractor = interactor.find(
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
      return dayInteractor.click();
    },
  });
