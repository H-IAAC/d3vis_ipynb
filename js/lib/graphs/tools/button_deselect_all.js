import { X } from "lucide";
import { BaseButton } from "./button_base";

export class DeselectAllButton extends BaseButton {
  constructor(selectables) {
    super();
    this.selectables = selectables;
  }

  on_click() {
    this.selectables.classed("selected", false);
  }

  createButton() {
    return super.createButton(X);
  }

  select() {}

  unselect() {}
}
