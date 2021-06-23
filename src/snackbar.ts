import { HTML } from "@bigtest/interactor";
import { isHTMLElement } from "./helpers";

export const Snackbar = HTML.extend("MUI Snackbar")
  .selector(".MuiSnackbar-root")
  .locator((element) => {
    let messageElement = element.querySelector(".MuiSnackbarContent-message");
    return isHTMLElement(messageElement) ? messageElement.innerText : "";
  });
