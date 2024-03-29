import { createInteractor, HTML } from "@interactors/html";
import { Button } from "./button";
import { applyGetter, isDisabled } from "./helpers";

export const MenuItem = HTML.extend<HTMLElement>("MUI MenuItem")
  .selector('[class*="MuiMenuItem-root"][role="menuitem"]')
  .filters({
    disabled: {
      apply: isDisabled,
      default: false,
    },
  })
  .actions({ click: ({ perform }) => perform((element) => element.click()) });

export const MenuList = createInteractor<HTMLElement>("MUI MenuList")
  .selector(
    '[class*="MuiPopover-root"][role="presentation"] > [class*="MuiMenu-paper"] > [class*="MuiMenu-list"][role="menu"]'
  )
  .locator((element) => element.parentElement?.parentElement?.id ?? "");

export const Menu = Button.extend("MUI Menu")
  .selector(`${Button().options.specification.selector as string}[aria-haspopup="true"]`)
  .actions({
    open: async ({ perform }) => perform((element) => element.click()),
    click: async (interactor, value: string) => {
      await interactor.perform((element) => element.click());

      let menuId = await applyGetter(interactor, (element) => element.getAttribute("aria-controls") ?? "");

      await MenuList(menuId).find(MenuItem(value)).click();
    },
  });
