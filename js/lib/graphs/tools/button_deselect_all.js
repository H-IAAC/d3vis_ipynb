import { createElement, X } from "lucide";

export class DeselectAllButton {
  createButton() {
    const button = document.createElement("button");
    const icon = createElement(X);
    button.appendChild(icon);
    return button;
  }
}
