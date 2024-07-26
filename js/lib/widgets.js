import { BaseModel, BaseView, WIDGET_MARGIN } from "./base";
import { rangeslider } from "./widgets/rangeslider";

class TextBaseModel extends BaseModel {
  defaults() {
    return {
      ...super.defaults(),

      value: String,
      placeholder: String,
      description: String,
      disabled: false,
      elementId: String,
    };
  }
}

class TextBaseView extends BaseView {
  setText() {}

  setPlaceholder() {
    const placeholder = this.model.get("placeholder");
    this.text.setAttribute("placeholder", placeholder);
  }

  setDescription() {
    const description = this.model.get("description");
    this.getElement().innerHTML = "";
    if (description) {
      const label = document.createElement("label");
      label.setAttribute("title", description);
      label.innerHTML = description + ": ";
      label.style.verticalAlign = "top";
      this.getElement().appendChild(label);
    }
    this.getElement().appendChild(this.text);
  }

  setDisabled() {
    const disabled = this.model.get("disabled");
    if (disabled) this.text.setAttribute("disabled", "");
    else this.text.removeAttribute("disabled");
  }

  render() {
    this.plotAfterInterval();

    this.model.on("change:value", () => this.setText(), this);
    this.model.on("change:placeholder", () => this.setPlaceholder(), this);
    this.model.on("change:description", () => this.setDescription(), this);
    this.model.on("change:disabled", () => this.setDisabled(), this);
    window.addEventListener("resize", () => this.plotAfterInterval());
  }

  plot() {
    this.setText();
    this.setPlaceholder();
    this.setDescription();
    this.setDisabled();
  }
}

export class ButtonModel extends BaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: ButtonModel.model_name,
      _view_name: ButtonModel.view_name,

      description: String,
      disabled: false,
      _clicked: Boolean,
      elementId: String,
    };
  }

  static model_name = "ButtonModel";
  static view_name = "ButtonView";
}

export class ButtonView extends BaseView {
  setDescription() {
    const description = this.model.get("description");
    this.button.setAttribute("title", description);
    this.button.innerHTML = description;
  }

  setDisabled() {
    const disabled = this.model.get("disabled");
    if (disabled) this.button.setAttribute("disabled", "");
    else this.button.removeAttribute("disabled");
  }

  setClicked() {
    const clicked = this.model.get("_clicked");
    this.model.set({ _clicked: !clicked });
    this.model.save_changes();
  }

  render() {
    this.plotAfterInterval();

    this.model.on("change:description", () => this.setDescription(), this);
    this.model.on("change:disabled", () => this.setDisabled(), this);
    window.addEventListener("resize", () => this.plotAfterInterval());
  }

  plot() {
    this.button = document.createElement("button");
    this.button.addEventListener("click", this.setClicked.bind(this));
    this.setDescription();
    this.setDisabled();
    this.getElement().appendChild(this.button);
  }
}

export class DropdownModel extends BaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: DropdownModel.model_name,
      _view_name: DropdownModel.view_name,

      dataRecords: [],
      variable: String,
      description: String,
      options: [],
      value: String,
      disabled: false,
      elementId: String,
    };
  }

  static model_name = "DropdownModel";
  static view_name = "DropdownView";
}

export class DropdownView extends BaseView {
  setDescription() {
    const description = this.model.get("description");
    this.label.innerHTML = description + ": ";
  }

  setDisabled() {
    const disabled = this.model.get("disabled");
    if (disabled) this.select.setAttribute("disabled", "");
    else this.select.removeAttribute("disabled");
  }

  setOptions() {
    const data = this.model.get("dataRecords");
    const variable = this.model.get("variable");
    let options = this.model.get("options");

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

  setValue() {
    this.model.set({ value: this.select.value });
    this.model.save_changes();
  }

  render() {
    this.plotAfterInterval();

    this.model.on("change:dataRecords", () => this.plotAfterInterval(), this);
    this.model.on("change:variable", () => this.plotAfterInterval(), this);
    this.model.on("change:description", () => this.setDescription(), this);
    this.model.on("change:options", () => this.setOptions(), this);
    this.model.on("change:disabled", () => this.setDisabled(), this);
    window.addEventListener("resize", () => this.plotAfterInterval());
  }

  plot() {
    this.getElement().innerHTML = "";

    const randomString = Math.floor(
      Math.random() * Date.now() * 10000
    ).toString(36);

    this.dropdown = document.createElement("div");
    this.label = document.createElement("label");
    this.label.setAttribute("for", randomString);
    this.setDescription();

    this.select = document.createElement("select");
    this.select.setAttribute("id", randomString);
    this.select.addEventListener("change", this.setValue.bind(this));
    this.setDisabled();

    this.dropdown.appendChild(this.label);
    this.dropdown.appendChild(this.select);

    this.setOptions();

    const value = this.model.get("value");
    if (value) this.select.value = value;

    this.getElement().appendChild(this.dropdown);
  }
}

export class InputModel extends TextBaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: InputModel.model_name,
      _view_name: InputModel.view_name,
    };
  }

  static model_name = "InputModel";
  static view_name = "InputView";
}

export class InputView extends TextBaseView {
  setText() {
    const value = this.model.get("value");
    this.text.value = value;
  }

  setValue() {
    const value = this.text.value;
    this.model.set({ value: value });
    this.model.save_changes();
  }

  plot() {
    this.text = document.createElement("input");
    this.text.addEventListener("change", this.setValue.bind(this));
    super.plot();
  }
}

export class RangeSliderModel extends BaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: RangeSliderModel.model_name,
      _view_name: RangeSliderModel.view_name,

      dataRecords: [],
      variable: String,
      step: Number,
      description: String,
      minValue: Number,
      maxValue: Number,
      elementId: String,
    };
  }

  static model_name = "RangeSliderModel";
  static view_name = "RangeSliderView";
}

export class RangeSliderView extends BaseView {
  render() {
    this.plotAfterInterval();

    this.model.on("change:dataRecords", () => this.plotAfterInterval(), this);
    this.model.on("change:variable", () => this.plotAfterInterval(), this);
    this.model.on("change:step", () => this.plotAfterInterval(), this);
    this.model.on("change:description", () => this.plotAfterInterval(), this);
    this.model.on("change:minValue", () => this.plotAfterInterval(), this);
    this.model.on("change:maxValue", () => this.plotAfterInterval(), this);
    window.addEventListener("resize", () => this.plotAfterInterval());
  }

  plot() {
    const data = this.model.get("dataRecords");
    let variable = this.model.get("variable");
    let step = this.model.get("step");
    let description = this.model.get("description");
    let elementId = this.model.get("elementId");
    let fromValue = this.model.get("fromValue");
    let toValue = this.model.get("toValue");
    let minValue = this.model.get("minValue");
    let maxValue = this.model.get("maxValue");

    let element = this.el;
    if (elementId) {
      element = document.getElementById(elementId);
    }
    const margin = WIDGET_MARGIN;

    rangeslider(
      data,
      variable,
      step,
      description,
      fromValue,
      toValue,
      minValue,
      maxValue,
      this.setFromTo.bind(this),
      this.setMinMax.bind(this),
      element,
      margin
    );
  }

  setFromTo(from, to) {
    this.model.set({ fromValue: from });
    this.model.set({ toValue: to });
    this.model.save_changes();
  }

  setMinMax(min, max) {
    this.model.set({ minValue: min });
    this.model.set({ maxValue: max });
    this.model.save_changes();
  }
}

export class TextAreaModel extends TextBaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: TextAreaModel.model_name,
      _view_name: TextAreaModel.view_name,
    };
  }

  static model_name = "TextAreaModel";
  static view_name = "TextAreaView";
}

export class TextAreaView extends TextBaseView {
  setText() {
    const value = this.model.get("value");
    this.text.value = value;
  }

  setValue() {
    const value = this.text.value;
    this.model.set({ value: value });
    this.model.save_changes();
  }

  plot() {
    this.text = document.createElement("textarea");
    this.text.addEventListener("change", this.setValue.bind(this));
    super.plot();
  }
}

export class TextModel extends TextBaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: TextModel.model_name,
      _view_name: TextModel.view_name,
    };
  }

  static model_name = "TextModel";
  static view_name = "TextView";
}

export class TextView extends TextBaseView {
  setText() {
    const value = this.model.get("value");
    this.text.innerHTML = value;
  }

  plot() {
    this.text = document.createElement("div");
    this.text.style.marginLeft = "4px";
    this.getElement().style.display = "flex";
    super.plot();
  }
}
