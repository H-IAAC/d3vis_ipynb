import { BaseModel, BaseView } from "./base";
import { BarPlot } from "./graphs/barplot";
import { DecisionPlot } from "./graphs/decision";
import { HistogramPlot } from "./graphs/histogramplot";
import { LinearPlot } from "./graphs/linearplot";
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
  render() {
    this.plotAfterInterval();

    this.model.on("change:dataRecords", () => this.plotAfterInterval(), this);
    this.model.on("change:x", () => this.plotAfterInterval(), this);
    this.model.on("change:y", () => this.plotAfterInterval(), this);
    this.model.on("change:hue", () => this.plotAfterInterval(), this);
    this.model.on("change:direction", () => this.plotAfterInterval(), this);
    window.addEventListener("resize", () => this.plotAfterInterval());
  }

  plot() {
    if (!this.barplot) this.barplot = new BarPlot(this.getElement());
    this.setSizes();

    const data = this.model.get("dataRecords");
    const x = this.model.get("x");
    const y = this.model.get("y");
    const hue = this.model.get("hue");
    const direction = this.model.get("direction");

    this.barplot.replot(
      data,
      x,
      y,
      hue,
      direction,
      this.width,
      this.height,
      this.margin,
      false
    );
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
      elementId: String,
    };
  }

  static model_name = "DecisionPlotModel";
  static view_name = "DecisionPlotView";
}

export class DecisionPlotView extends BaseView {
  render() {
    this.plotAfterInterval();

    this.model.on("change:dataRecords", () => this.plotAfterInterval(), this);
    this.model.on("change:baseValue", () => this.plotAfterInterval(), this);
    window.addEventListener("resize", () => this.plotAfterInterval());
  }

  plot() {
    if (!this.decisionPlot)
      this.decisionPlot = new DecisionPlot(this.getElement());
    this.setSizes();

    let data = this.model.get("dataRecords");
    let baseValue = this.model.get("baseValue");

    this.decisionPlot.replot(
      data,
      "values",
      "feature_names",
      baseValue,
      this.width,
      this.height,
      { top: 20, right: 20, bottom: 30, left: 80 },
      false
    );
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
  render() {
    this.plotAfterInterval();

    this.model.on("change:dataRecords", () => this.plotAfterInterval(), this);
    this.model.on("change:x", () => this.plotAfterInterval(), this);
    window.addEventListener("resize", () => this.plotAfterInterval());
  }

  plot() {
    if (!this.histogramplot)
      this.histogramplot = new HistogramPlot(this.getElement());
    this.setSizes();

    let data = this.model.get("dataRecords");
    let x = this.model.get("x");

    this.histogramplot.replot(
      data,
      x,
      this.width,
      this.height,
      this.margin,
      false
    );
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
  render() {
    this.plotAfterInterval();

    this.model.on("change:dataRecords", () => this.plotAfterInterval(), this);
    this.model.on("change:x", () => this.plotAfterInterval(), this);
    this.model.on("change:y", () => this.plotAfterInterval(), this);
    this.model.on("change:hue", () => this.plotAfterInterval(), this);
    window.addEventListener("resize", () => this.plotAfterInterval());
  }

  plot() {
    if (!this.linearplot) this.linearplot = new LinearPlot(this.getElement());
    this.setSizes();

    let data = this.model.get("dataRecords");
    let x = this.model.get("x");
    let y = this.model.get("y");
    let hue = this.model.get("hue");

    this.linearplot.replot(
      data,
      x,
      y,
      hue,
      this.setSelectedValues.bind(this),
      this.width,
      this.height,
      this.margin,
      false,
      false
    );
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
  render() {
    this.plotAfterInterval();

    this.model.on("change:dataRecords", () => this.plotAfterInterval(), this);
    this.model.on("change:x", () => this.plotAfterInterval(), this);
    window.addEventListener("resize", () => this.plotAfterInterval());
  }

  plot() {
    if (!this.ridgelineplot)
      this.ridgelineplot = new RidgelinePlot(this.getElement());
    this.setSizes();

    let data = this.model.get("dataRecords");
    let xAxes = this.model.get("xAxes");

    this.ridgelineplot.plot(
      data,
      xAxes,
      this.width,
      this.height,
      this.margin,
      false
    );
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
  render() {
    this.plotAfterInterval();

    this.model.on("change:dataRecords", () => this.plotAfterInterval(), this);
    this.model.on("change:x", () => this.plotAfterInterval(), this);
    this.model.on("change:y", () => this.plotAfterInterval(), this);
    this.model.on("change:hue", () => this.plotAfterInterval(), this);
    this.model.on("change:lines", () => this.setLines(), this);
    window.addEventListener("resize", () => this.plotAfterInterval());
  }

  plot() {
    if (!this.scatterplot)
      this.scatterplot = new ScatterPlot(this.getElement());
    this.setSizes();

    let data = this.model.get("dataRecords");
    let x = this.model.get("x");
    let y = this.model.get("y");
    let hue = this.model.get("hue");

    this.scatterplot.replot(
      data,
      x,
      y,
      hue,
      this.setSelectedValues.bind(this),
      this.width,
      this.height,
      this.margin,
      false,
      false
    );

    this.setLines();
  }

  setSelectedValues(values) {
    this.model.set({ selectedValuesRecords: values });
    this.model.save_changes();
  }

  setLines() {
    let lines = this.model.get("lines");
    this.scatterplot.plotLines(lines);
  }
}

export class WaterfallPlotModel extends BaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: WaterfallPlotModel.model_name,
      _view_name: WaterfallPlotModel.view_name,

      dataRecords: [],
      x: String,
      y: String,
      baseValue: Number,
      elementId: String,
    };
  }

  static model_name = "WaterfallPlotModel";
  static view_name = "WaterfallPlotView";
}

export class WaterfallPlotView extends BaseView {
  render() {
    this.plotAfterInterval();

    this.model.on("change:dataRecords", () => this.plotAfterInterval(), this);
    this.model.on("change:x", () => this.plotAfterInterval(), this);
    this.model.on("change:y", () => this.plotAfterInterval(), this);
    this.model.on("change:baseValue", () => this.plotAfterInterval(), this);
    window.addEventListener("resize", () => this.plotAfterInterval());
  }

  plot() {
    if (!this.waterfall) this.waterfall = new WaterfallPlot(this.getElement());
    this.setSizes();

    let data = this.model.get("dataRecords");
    let x = this.model.get("x");
    let y = this.model.get("y");
    let baseValue = this.model.get("baseValue");

    this.waterfall.replot(
      data,
      x,
      y,
      baseValue,
      this.width,
      this.height,
      { top: 20, right: 20, bottom: 30, left: 80 },
      false
    );
  }
}
