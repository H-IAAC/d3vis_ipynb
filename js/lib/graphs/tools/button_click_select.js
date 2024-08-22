import { createElement, MousePointer } from "lucide";

export class ClickSelectButton {
  createButton() {
    const button = document.createElement("button");
    const icon = createElement(MousePointer);
    button.appendChild(icon);
    return button;
  }
}
