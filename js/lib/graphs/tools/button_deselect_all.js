import { X } from "lucide";
import { BaseButton } from "./button_base";

export class DeselectAllButton extends BaseButton {
  constructor(selectables, callUpdateSelected) {
    super();
    this.selectables = selectables;
    this.callUpdateSelected = callUpdateSelected;
  }

  on_click() {
    this.selectables.classed("selected", false);
    this.callUpdateSelected();
  }

  createButton() {
    return super.createButton(X);
  }

  select() {}

  unselect() {}
}
