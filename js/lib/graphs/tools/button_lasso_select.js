import { Lasso } from "lucide";
import { BaseButton } from "./button_base";

export class LassoSelectButton extends BaseButton {
  createButton() {
    return super.createButton(Lasso);
  }
}
