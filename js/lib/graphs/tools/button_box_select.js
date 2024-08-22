import { createElement, BoxSelect } from "lucide";

export class BoxSelectButton {
  createButton() {
    const button = document.createElement("button");
    const icon = createElement(BoxSelect);
    button.appendChild(icon);
    return button;
  }
}
