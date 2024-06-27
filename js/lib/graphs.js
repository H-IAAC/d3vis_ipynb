import { BaseModel, BaseView } from "./base";
import { BarPlot } from "./graphs/barplot";
import { HistogramPlot } from "./graphs/histogramplot";
import { LinearPlot } from "./graphs/linearplot";
import { RidgelinePlot } from "./graphs/ridgelineplot";
import { ScatterPlot } from "./graphs/scatterplot";

export class BarPlotModel extends BaseModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: BarPlotModel.model_name,
      _view_name: BarPlotModel.view_name,

      dataRecords: [],
      x: String,
      y: String,
      hue: String,
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
    window.addEventListener("resize", () => this.plotAfterInterval());
  }

  plot() {
    if (!this.barplot) this.barplot = new BarPlot(this.getElement());
    this.setSizes();

    const data = this.model.get("dataRecords");
    const x = this.model.get("x");
    const y = this.model.get("y");
    const hue = this.model.get("hue");

    this.barplot.plot(data, x, y, hue, this.width, this.height, this.margin);
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
      clickedValue: String,
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
      this.setValue.bind(this),
      this.setSelectedValues.bind(this),
      this.width,
      this.height,
      this.margin,
      false
    );
  }

  setValue(text) {
    this.model.set({ clickedValue: text });
    this.model.save_changes();
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
      clickedValue: String,
      selectedValuesRecords: [],
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
      this.setValue.bind(this),
      this.setSelectedValues.bind(this),
      this.width,
      this.height,
      this.margin,
      false
    );
  }

  setValue(text) {
    this.model.set({ clickedValue: text });
    this.model.save_changes();
  }

  setSelectedValues(values) {
    this.model.set({ selectedValuesRecords: values });
    this.model.save_changes();
  }
}
