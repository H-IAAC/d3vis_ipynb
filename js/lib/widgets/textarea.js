import { TextBase } from "./basetext";

export class TextArea extends TextBase{
  onTextChanged(value) {
    this.text.value = value;
  }

  onValueChanged() {
    const value = this.text.value
    this.setValue(value)
  }

  plot(value, placeholder, description, disabled, setValue) {
    this.text = document.createElement("textarea");
    this.setValue = setValue
    this.text.addEventListener("change", this.onValueChanged.bind(this));
    super.plot(value, placeholder, description, disabled);
  }
}
