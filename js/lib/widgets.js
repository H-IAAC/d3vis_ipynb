import { BaseModel, BaseView, WIDGET_MARGIN } from "./base";
import { rangeslider } from "./widgets/rangeslider";

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
    window.addEventListener("resize", () => this.plotAfterInterval());
  }

  plot() {
    let data = this.model.get("dataRecords");
    let variable = this.model.get("variable");
    let step = this.model.get("step");
    let description = this.model.get("description");
    let elementId = this.model.get("elementId");
    let minValue = this.model.get("minValue");
    let maxValue = this.model.get("maxValue");

    if (typeof data === "function") data = data();
    if (typeof variable === "function") variable = variable();
    if (typeof step === "function") step = step();
    if (typeof description === "function") description = description();
    if (typeof elementId === "function") elementId = elementId();
    if (typeof minValue === "function") minValue = minValue();
    if (typeof maxValue === "function") maxValue = maxValue();

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
      minValue,
      maxValue,
      this.setValues.bind(this),
      element,
      margin
    );
  }

  setValues(min, max) {
    this.model.set({ minValue: min });
    this.model.set({ maxValue: max });
    this.model.save_changes();
  }
}
