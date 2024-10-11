export class Button {
  constructor(element) {
    this.element = element;
  }

  onDescriptionChanged(description) {
    this.button.setAttribute("title", description);
    this.button.innerHTML = description;
  }

  onDisabledChanged(disabled) {
    if (disabled) this.button.setAttribute("disabled", "");
    else this.button.removeAttribute("disabled");
  }

  plot(description, disabled, setClicked) {
    this.button = document.createElement("button");
    this.button.addEventListener("click", setClicked);
    this.onDescriptionChanged(description);
    this.onDisabledChanged(disabled);
    this.element.appendChild(this.button);
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
