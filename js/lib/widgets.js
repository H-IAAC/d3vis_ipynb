import { BaseModel, BaseView, WIDGET_MARGIN } from "./base";
import { Button } from "./widgets/button";
import { Checkbox } from "./widgets/checkbox";
import { Dropdown } from "./widgets/dropdown";
import { Input } from "./widgets/input";
import { RangeSlider } from "./widgets/rangeslider";
import { Text } from "./widgets/text";
import { TextArea } from "./widgets/textarea";

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
    this.widget.onPlacehoderChanged(placeholder);
  }

  setDescription() {
    const description = this.model.get("description");
    this.widget.onDescriptionChanged(description);
  }

  setDisabled() {
    const disabled = this.model.get("disabled");
    this.widget.onDisabledChanged(disabled);
  }

  params() {
    const value = this.model.get("value");
    const placeholder = this.model.get("placeholder");
    const description = this.model.get("description");
    const disabled = this.model.get("disabled");

    return [value, placeholder, description, disabled];
  }

  plot() {
    this.model.on("change:value", () => this.setText(), this);
    this.model.on("change:placeholder", () => this.setPlaceholder(), this);
    this.model.on("change:description", () => this.setDescription(), this);
    this.model.on("change:disabled", () => this.setDisabled(), this);
    window.addEventListener("resize", () => this.replot());
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
    this.widget.onDescriptionChanged(description);
  }

  setDisabled() {
    const disabled = this.model.get("disabled");
    this.widget.onDisabledChanged(disabled);
  }

  setClicked() {
    const clicked = this.model.get("_clicked");
    this.model.set({ _clicked: !clicked });
    this.model.save_changes();
  }

  params() {
    const description = this.model.get("description");
    const disabled = this.model.get("disabled");

    return [description, disabled, this.setClicked.bind(this)];
  }

  plot(element) {
    this.widget = new Button(element);

    this.model.on("change:description", () => this.setDescription(), this);
    this.model.on("change:disabled", () => this.setDisabled(), this);

    this.widget.plot(...this.params());
  }
}

export class CheckboxModel extends BaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: CheckboxModel.model_name,
      _view_name: CheckboxModel.view_name,

      description: String,
      checked: false,
      elementId: String,
    };
  }

  static model_name = "CheckboxModel";
  static view_name = "CheckboxView";
}

export class CheckboxView extends BaseView {
  setDescription() {
    const description = this.model.get("description");
    this.widget.onDescriptionChanged(description);
  }

  setChecked(change) {
    const checked = change.checked;
    this.model.set({ checked: checked });
    this.model.save_changes();
  }

  params() {
    const description = this.model.get("description");
    return [description, this.setChecked.bind(this)];
  }

  plot(element) {
    this.widget = new Checkbox(element);

    this.model.on("change:description", () => this.setDescription(), this);

    this.widget.plot(...this.params());
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
    this.widget.onDescriptionChanged(description);
  }

  setDisabled() {
    const disabled = this.model.get("disabled");
    this.widget.onDisabledChanged(disabled);
  }

  setOptions() {
    const data = this.model.get("dataRecords");
    const variable = this.model.get("variable");
    const options = this.model.get("options");

    this.widget.onOptionsChanged(data, variable, options);
  }

  setValue(value) {
    this.model.set({ value: value });
    this.model.save_changes();
  }

  params() {
    const data = this.model.get("dataRecords");
    const variable = this.model.get("variable");
    const description = this.model.get("description");
    const options = this.model.get("options");
    const value = this.model.get("value");
    const disabled = this.model.get("disabled");

    return [
      data,
      variable,
      description,
      options,
      value,
      disabled,
      this.setValue.bind(this),
    ];
  }

  plot(element) {
    this.widget = new Dropdown(element);

    this.model.on("change:dataRecords", () => this.setOptions(), this);
    this.model.on("change:variable", () => this.setOptions(), this);
    this.model.on("change:description", () => this.setDescription(), this);
    this.model.on("change:options", () => this.setOptions(), this);
    this.model.on("change:disabled", () => this.setDisabled(), this);

    this.widget.plot(...this.params());
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
  params() {
    return [...super.params(), this.setValue.bind(this)];
  }

  setText() {
    const value = this.model.get("value");
    this.widget.onTextChanged(value);
  }

  setValue(value) {
    this.model.set({ value: value });
    this.model.save_changes();
  }

  plot(element) {
    this.widget = new Input(element);
    super.plot();
    this.widget.plot(...this.params());
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
  params() {
    const data = this.model.get("dataRecords");
    const variable = this.model.get("variable");
    const step = this.model.get("step");
    const description = this.model.get("description");
    const fromValue = this.model.get("fromValue");
    const toValue = this.model.get("toValue");
    const minValue = this.model.get("minValue");
    const maxValue = this.model.get("maxValue");
    const margin = WIDGET_MARGIN;

    return [
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
      margin,
    ];
  }

  plot(element) {
    this.widget = new RangeSlider(element);

    this.model.on("change:dataRecords", () => this.replot(), this);
    this.model.on("change:variable", () => this.replot(), this);
    this.model.on("change:step", () => this.replot(), this);
    this.model.on("change:description", () => this.replot(), this);
    this.model.on("change:minValue", () => this.replot(), this);
    this.model.on("change:maxValue", () => this.replot(), this);
    window.addEventListener("resize", () => this.replot());

    this.widget.plot(...this.params());
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
  params() {
    return [...super.params(), this.setValue.bind(this)];
  }

  setText() {
    const value = this.model.get("value");
    this.widget.onTextChanged(value);
  }

  setValue(value) {
    this.model.set({ value: value });
    this.model.save_changes();
  }

  plot(element) {
    this.widget = new TextArea(element);
    super.plot();
    this.widget.plot(...this.params());
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
    this.widget.onTextChanged(value);
  }

  plot(element) {
    this.widget = new Text(element);
    super.plot();
    this.widget.plot(...this.params());
  }
}
