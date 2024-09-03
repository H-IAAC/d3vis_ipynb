import { createElement } from "lucide";

export class BaseButton {
  addWhenSelectedCallback(whenSelectedCallback) {
    this.whenSelectedCallback = whenSelectedCallback;
  }

  addWhenUnselectedCallback(whenUnselectedCallback) {
    this.whenUnselectedCallback = whenUnselectedCallback;
  }

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
    if (this.whenSelectedCallback) this.whenSelectedCallback();
  }

  unselect() {
    this.isSelected = false;
    this.button.classList.remove("is_selected");
    if (this.whenUnselectedCallback) this.whenUnselectedCallback();
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

    this.clickNotify(this);
    this.select();
  }
}
