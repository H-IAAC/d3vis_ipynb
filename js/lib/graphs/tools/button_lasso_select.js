import { createElement, Lasso } from "lucide";

export class LassoSelectButton {
  createButton() {
    const button = document.createElement("button");
    const icon = createElement(Lasso);
    button.appendChild(icon);
    return button;
  }
}
