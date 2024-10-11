export class TextBase {
  constructor(element) {
    this.element = element;
  }

  onPlacehoderChanged(placeholder) {
    this.text.setAttribute("placeholder", placeholder);
  }

  onDescriptionChanged(description) {
    this.element.innerHTML = "";
    if (description) {
      const label = document.createElement("label");
      label.setAttribute("title", description);
      label.innerHTML = description + ": ";
      label.style.verticalAlign = "top";
      this.element.appendChild(label);
    }
    this.element.appendChild(this.text);
  }

  onDisabledChanged(disabled) {
    if (disabled) this.text.setAttribute("disabled", "");
    else this.text.removeAttribute("disabled");
  }

  plot(value, placeholder, description, disabled) {
    this.onTextChanged(value);
    this.onPlacehoderChanged(placeholder);
    this.onDescriptionChanged(description);
    this.onDisabledChanged(disabled);
  }

  replot(params) {
    if (this.timeout) {
      clearTimeout(this.timeout);
    }
    this.timeout = setTimeout(() => {
      this.element.innerHTML = "";
      this.plot(...params);
    }, 100);
  }
}
