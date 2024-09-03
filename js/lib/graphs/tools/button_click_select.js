import { MousePointer } from "lucide";
import { BaseButton } from "./button_base";

export class ClickSelectButton extends BaseButton {
  createButton() {
    return super.createButton(MousePointer);
  }

  selectionClickEffect(selection) {
    if (this.isSelected) {
      selection.classed("selected", !selection.classed("selected"));
    }
  }
}
