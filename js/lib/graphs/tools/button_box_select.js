import { BoxSelect } from "lucide";
import { BaseButton } from "./button_base";

export class BoxSelectButton extends BaseButton {
  createButton() {
    return super.createButton(BoxSelect);
  }
}
