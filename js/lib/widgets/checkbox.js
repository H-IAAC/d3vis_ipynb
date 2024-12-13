export class Checkbox {
  constructor(element) {
    this.element = element;
  }

  onDescriptionChanged(description) {
    if (!this.label) {
      this.label = document.createElement("label");
      this.label.htmlFor = this.checkbox.id;
    }
    this.label.textContent = description;
  }

  plot(description, setChecked) {
    this.checkbox = document.createElement("input");
    this.checkbox.type = "checkbox";
    this.checkbox.id = `checkbox-${Math.random().toString(36).substr(2, 9)}`; // Unique ID for the checkbox

    this.checkbox.addEventListener("change", (e) => {
      setChecked({ checked: e.target.checked });
    });

    this.onDescriptionChanged(description);

    // Limpa o container e adiciona o checkbox e o label
    this.element.innerHTML = "";
    this.element.appendChild(this.checkbox);
    this.element.appendChild(this.label);
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
