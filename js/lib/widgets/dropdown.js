export class Dropdown {
  constructor(element) {
    this.element = element;
  }

  onDescriptionChanged(description) {
    this.label.innerHTML = description + ": ";
  }

  onDisabledChanged(disabled) {
    if (disabled) this.select.setAttribute("disabled", "");
    else this.select.removeAttribute("disabled");
  }

  onOptionsChanged(data, variable, options) {
    if (options.length === 0 && data.length > 0) {
      options = [...new Set(data.map((d) => d[variable]))].sort();
    }

    this.select.innerHTML = "";
    for (const option of options) {
      const optionElement = document.createElement("option");
      optionElement.setAttribute("value", option);
      optionElement.innerHTML = option;
      this.select.appendChild(optionElement);
    }
  }

  onValueChanged() {
    const value = this.select.value;
    this.setValue(value);
  }

  plot(data, variable, description, options, value, disabled, setValue) {
    const randomString = Math.floor(
      Math.random() * Date.now() * 10000
    ).toString(36);

    this.dropdown = document.createElement("div");
    this.label = document.createElement("label");
    this.label.setAttribute("for", randomString);
    this.onDescriptionChanged(description);

    this.select = document.createElement("select");
    this.select.setAttribute("id", randomString);
    this.setValue = setValue;
    this.select.addEventListener("change", this.onValueChanged.bind(this));
    this.onDisabledChanged(disabled);

    this.dropdown.appendChild(this.label);
    this.dropdown.appendChild(this.select);

    this.onOptionsChanged(data, variable, options);

    if (value) this.select.value = value;

    this.element.appendChild(this.dropdown);
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
