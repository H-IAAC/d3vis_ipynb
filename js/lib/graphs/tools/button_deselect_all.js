import { X } from "lucide";
import { BaseButton } from "./button_base";

export class DeselectAllButton extends BaseButton {
  createButton() {
    return super.createButton(X);
  }
}
