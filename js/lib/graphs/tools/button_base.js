import { createElement } from "lucide";

export class BaseButton {
  constructor(selected = false) {
    this.isSelected = selected;
  }

  addClickNotification(notification) {
    this.clickNotify = notification;
  }

  notified() {
    this.unselect();
  }

  select() {
    this.isSelected = true;
    this.button.classList.add("is_selected");
  }

  unselect() {
    this.isSelected = false;
    this.button.classList.remove("is_selected");
  }

  createButton(icon) {
    this.button = document.createElement("button");
    if (this.isSelected) this.button.classList.add("is_selected");
    this.button.addEventListener("click", this.on_click.bind(this));
    const iconElement = createElement(icon);
    this.button.appendChild(iconElement);
    return this.button;
  }

  on_click() {
    if (this.isSelected) return;

    this.select();
    this.clickNotify(this);
  }
}
