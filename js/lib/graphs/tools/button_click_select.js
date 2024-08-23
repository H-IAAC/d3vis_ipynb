import { MousePointer } from "lucide";
import { BaseButton } from "./button_base";

export class ClickSelectButton extends BaseButton {
  createButton() {
    return super.createButton(MousePointer);
  }
}
