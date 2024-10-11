import { TextBase } from "./basetext";

export class Text extends TextBase{
  onTextChanged(value) {
    this.text.innerHTML = value;
  }

  plot(value, placeholder, description, disabled) {
    this.text = document.createElement("div");
    this.text.style.marginLeft = "4px";
    this.element.style.display = "flex";
    super.plot(value, placeholder, description, disabled);
  }
}
