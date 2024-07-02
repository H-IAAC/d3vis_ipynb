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
