import { BaseModel, BaseView } from "./base";
import { BarPlot } from "./graphs/barplot";
import { BeeswarmPlot } from "./graphs/beeswarm";
import { DecisionPlot } from "./graphs/decision";
import { ForcePlot } from "./graphs/force";
import { HeatmapPlot } from "./graphs/heatmap";
import { HistogramPlot } from "./graphs/histogramplot";
import { LinearPlot } from "./graphs/linearplot";
import { MapPlot } from "./graphs/mapplot";
import { RidgelinePlot } from "./graphs/ridgelineplot";
import { ScatterPlot } from "./graphs/scatterplot";
import { WaterfallPlot } from "./graphs/waterfall";

export class BarPlotModel extends BaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: BarPlotModel.model_name,
      _view_name: BarPlotModel.view_name,

      dataRecords: [],
      direction: String,
      x: String,
      y: String,
      hue: String,
      direction: Boolean,
      elementId: String,
    };
  }

  static model_name = "BarPlotModel";
  static view_name = "BarPlotView";
}

export class BarPlotView extends BaseView {
  params() {
    const data = this.model.get("dataRecords");
    const x = this.model.get("x");
    const y = this.model.get("y");
    const hue = this.model.get("hue");
    const direction = this.model.get("direction");

    return [data, x, y, hue, direction, this.width, this.height, false];
  }

  plot(element) {
    this.widget = new BarPlot(element);

    this.model.on("change:dataRecords", () => this.replot(), this);
    this.model.on("change:x", () => this.replot(), this);
    this.model.on("change:y", () => this.replot(), this);
    this.model.on("change:hue", () => this.replot(), this);
    this.model.on("change:direction", () => this.replot(), this);
    window.addEventListener("resize", () => this.replot());

    this.widget.plot(...this.params());
  }
}

export class BeeswarmPlotModel extends BaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: BeeswarmPlotModel.model_name,
      _view_name: BeeswarmPlotModel.view_name,

      dataRecords: [],
      baseValue: Number,
      selectedValuesRecords: [],
      elementId: String,
    };
  }

  static model_name = "BeeswarmPlotModel";
  static view_name = "BeeswarmPlotView";
}

export class BeeswarmPlotView extends BaseView {
  params() {
    const data = this.model.get("dataRecords");
    const baseValue = this.model.get("baseValue");

    return [
      data,
      "values",
      "feature_names",
      "data",
      baseValue,
      this.setSelectedValues.bind(this),
      this.width,
      this.height,
      false,
    ];
  }

  plot(element) {
    this.widget = new BeeswarmPlot(element);

    this.model.on("change:dataRecords", () => this.replot(), this);
    this.model.on("change:baseValue", () => this.replot(), this);
    window.addEventListener("resize", () => this.replot());

    this.widget.plot(...this.params());
  }

  setSelectedValues(values) {
    this.model.set({ selectedValuesRecords: values });
    this.model.save_changes();
  }
}

export class DecisionPlotModel extends BaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: DecisionPlotModel.model_name,
      _view_name: DecisionPlotModel.view_name,

      dataRecords: [],
      baseValue: Number,
      selectedValuesRecords: [],
      elementId: String,
    };
  }

  static model_name = "DecisionPlotModel";
  static view_name = "DecisionPlotView";
}

export class DecisionPlotView extends BaseView {
  params() {
    const data = this.model.get("dataRecords");
    const baseValue = this.model.get("baseValue");

    return [
      data,
      "values",
      "feature_names",
      "data",
      baseValue,
      this.setSelectedValues.bind(this),
      this.width,
      this.height,
      false,
    ];
  }

  plot(element) {
    this.widget = new DecisionPlot(element);

    this.model.on("change:dataRecords", () => this.replot(), this);
    this.model.on("change:baseValue", () => this.replot(), this);
    window.addEventListener("resize", () => this.replot());

    this.widget.plot(...this.params());
  }

  setSelectedValues(values) {
    this.model.set({ selectedValuesRecords: values });
    this.model.save_changes();
  }
}

export class ForcePlotModel extends BaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: ForcePlotModel.model_name,
      _view_name: ForcePlotModel.view_name,

      dataRecords: [],
      baseValue: Number,
      selectedValuesRecords: [],
      elementId: String,
    };
  }

  static model_name = "ForcePlotModel";
  static view_name = "ForcePlotView";
}

export class ForcePlotView extends BaseView {
  params() {
    const data = this.model.get("dataRecords");
    const baseValue = this.model.get("baseValue");

    return [
      data,
      "values",
      "feature_names",
      "data",
      baseValue,
      this.setSelectedValues.bind(this),
      this.width,
      200,
      false,
    ];
  }

  plot(element) {
    this.widget = new ForcePlot(element);

    this.model.on("change:dataRecords", () => this.replot(), this);
    this.model.on("change:x", () => this.replot(), this);
    this.model.on("change:y", () => this.replot(), this);
    this.model.on("change:baseValue", () => this.replot(), this);
    window.addEventListener("resize", () => this.replot());

    this.widget.plot(...this.params());
  }

  setSelectedValues(values) {
    this.model.set({ selectedValuesRecords: values });
    this.model.save_changes();
  }
}

export class HeatmapPlotModel extends BaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: HeatmapPlotModel.model_name,
      _view_name: HeatmapPlotModel.view_name,

      dataRecords: [],
      x_value: String,
      y_value: String,
      xValues: [],
      yValues: [],
      elementId: String,
    };
  }

  static model_name = "HeatmapPlotModel";
  static view_name = "HeatmapPlotView";
}

export class HeatmapPlotView extends BaseView {
  params() {
    const data = this.model.get("dataRecords");
    const x_value = this.model.get("x_value");
    const y_value = this.model.get("y_value");
    const xValues = this.model.get("xValues");
    const yValues = this.model.get("yValues");

    return [
      data,
      x_value,
      y_value,
      "hueValue",
      xValues,
      yValues,
      null,
      0,
      this.width,
      this.height,
    ];
  }

  plot(element) {
    this.widget = new HeatmapPlot(element);

    this.model.on("change:dataRecords", () => this.replot(), this);
    window.addEventListener("resize", () => this.replot());

    this.widget.plot(...this.params());
  }
}

export class HistogramPlotModel extends BaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: HistogramPlotModel.model_name,
      _view_name: HistogramPlotModel.view_name,

      dataRecords: [],
      x: String,
      elementId: String,
    };
  }

  static model_name = "HistogramPlotModel";
  static view_name = "HistogramPlotView";
}

export class HistogramPlotView extends BaseView {
  params() {
    let data = this.model.get("dataRecords");
    let x = this.model.get("x");

    return [data, x, this.width, this.height, false];
  }

  plot(element) {
    this.widget = new HistogramPlot(element);

    this.model.on("change:dataRecords", () => this.replot(), this);
    this.model.on("change:x", () => this.replot(), this);
    window.addEventListener("resize", () => this.replot());

    this.widget.plot(...this.params());
  }
}

export class LinearPlotModel extends BaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: LinearPlotModel.model_name,
      _view_name: LinearPlotModel.view_name,

      dataRecords: [],
      x: String,
      y: String,
      hue: String,
      elementId: String,
      selectedValuesRecords: [],
    };
  }

  static model_name = "LinearPlotModel";
  static view_name = "LinearPlotView";
}

export class LinearPlotView extends BaseView {
  params() {
    const data = this.model.get("dataRecords");
    const x = this.model.get("x");
    const y = this.model.get("y");
    const hue = this.model.get("hue");

    return [
      data,
      x,
      y,
      hue,
      this.setSelectedValues.bind(this),
      this.width,
      this.height,
      false,
      false,
    ];
  }

  plot(element) {
    this.widget = new LinearPlot(element);

    this.model.on("change:dataRecords", () => this.replot(), this);
    this.model.on("change:x", () => this.replot(), this);
    this.model.on("change:y", () => this.replot(), this);
    this.model.on("change:hue", () => this.replot(), this);
    window.addEventListener("resize", () => this.replot());

    this.widget.plot(...this.params());
  }

  setSelectedValues(values) {
    this.model.set({ selectedValuesRecords: values });
    this.model.save_changes();
  }
}

export class MapPlotModel extends BaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: MapPlotModel.model_name,
      _view_name: MapPlotModel.view_name,

      dataRecords: [],
      elementId: String,
      selectedValuesRecords: [],
    };
  }

  static model_name = "MapPlotModel";
  static view_name = "MapPlotView";
}

export class MapPlotView extends BaseView {
  params() {
    const data = this.model.get("dataRecords");

    return [
      data,
      this.setSelectedValues.bind(this),
      this.width,
      this.height,
      false,
      false,
    ];
  }

  plot(element) {
    this.widget = new MapPlot(element);

    this.model.on("change:dataRecords", () => this.replot(), this);
    window.addEventListener("resize", () => this.replot());

    this.widget.plot(...this.params());
  }

  setSelectedValues(values) {
    this.model.set({ selectedValuesRecords: values });
    this.model.save_changes();
  }
}

export class RidgelinePlotModel extends BaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: RidgelinePlotModel.model_name,
      _view_name: RidgelinePlotModel.view_name,

      dataRecords: [],
      xAxes: String,
      elementId: String,
    };
  }

  static model_name = "RidgelinePlotModel";
  static view_name = "RidgelinePlotView";
}

export class RidgelinePlotView extends BaseView {
  params() {
    const data = this.model.get("dataRecords");
    const xAxes = this.model.get("xAxes");

    return [data, xAxes, this.width, this.height, false];
  }

  plot(element) {
    this.widget = new RidgelinePlot(element);

    this.model.on("change:dataRecords", () => this.replot(), this);
    this.model.on("change:x", () => this.replot(), this);
    window.addEventListener("resize", () => this.replot());

    this.widget.plot(...this.params());
  }
}

export class ScatterPlotModel extends BaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: ScatterPlotModel.model_name,
      _view_name: ScatterPlotModel.view_name,

      dataRecords: [],
      x: String,
      y: String,
      hue: String,
      elementId: String,
      selectedValuesRecords: [],
      lines: {},
    };
  }

  static model_name = "ScatterPlotModel";
  static view_name = "ScatterPlotView";
}

export class ScatterPlotView extends BaseView {
  params() {
    const data = this.model.get("dataRecords");
    const x = this.model.get("x");
    const y = this.model.get("y");
    const hue = this.model.get("hue");

    return [
      data,
      x,
      y,
      hue,
      this.setSelectedValues.bind(this),
      this.width,
      this.height,
      false,
      false,
    ];
  }

  plot(element) {
    this.widget = new ScatterPlot(element);

    this.model.on("change:dataRecords", () => this.replot(), this);
    this.model.on("change:x", () => this.replot(), this);
    this.model.on("change:y", () => this.replot(), this);
    this.model.on("change:hue", () => this.replot(), this);
    this.model.on("change:lines", () => this.setLines(), this);
    window.addEventListener("resize", () => this.replot());

    this.widget.plot(...this.params());

    this.setLines();
  }

  setSelectedValues(values) {
    this.model.set({ selectedValuesRecords: values });
    this.model.save_changes();
  }

  setLines() {
    let lines = this.model.get("lines");
    this.widget.plotLines(lines);
  }
}

export class WaterfallPlotModel extends BaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: WaterfallPlotModel.model_name,
      _view_name: WaterfallPlotModel.view_name,

      dataRecords: [],
      baseValue: Number,
      selectedValuesRecords: [],
      elementId: String,
    };
  }

  static model_name = "WaterfallPlotModel";
  static view_name = "WaterfallPlotView";
}

export class WaterfallPlotView extends BaseView {
  params() {
    const data = this.model.get("dataRecords");
    const baseValue = this.model.get("baseValue");

    return [
      data,
      "values",
      "feature_names",
      "data",
      baseValue,
      this.setSelectedValues.bind(this),
      this.width,
      this.height,
      false,
    ];
  }

  plot(element) {
    this.widget = new WaterfallPlot(element);

    this.model.on("change:dataRecords", () => this.replot(), this);
    this.model.on("change:baseValue", () => this.replot(), this);
    window.addEventListener("resize", () => this.replot());

    this.widget.plot(...this.params());
  }

  setSelectedValues(values) {
    this.model.set({ selectedValuesRecords: values });
    this.model.save_changes();
  }
}
