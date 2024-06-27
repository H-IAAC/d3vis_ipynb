import { DOMWidgetModel, DOMWidgetView } from "@jupyter-widgets/base";
import "../css/widget.css";
import { BarPlot } from "./graphs/barplot";
import { HistogramPlot } from "./graphs/histogramplot";
import { LinearPlot } from "./graphs/linearplot";
import { rangeslider } from "./graphs/rangeslider";
import { ScatterPlot } from "./graphs/scatterplot";
import { RidgelinePlot } from "./graphs/ridgelineplot";
const packageData = require("../package.json");

const WIDGET_HEIGHT = 400;
const WIDGET_MARGIN = { top: 20, right: 20, bottom: 30, left: 40 };
const RENDER_INTERVAL = 100;

function plotAfterInterval(that) {
  if (that.timeout) {
    clearTimeout(that.timeout);
  }
  that.timeout = setTimeout(() => {
    that.plot();
  }, RENDER_INTERVAL);
}

function getElement(that) {
  that.elementId = that.model.get("elementId");

  let element = that.el;
  if (that.elementId) {
    element = document.getElementById(that.elementId);
  }

  return element;
}

function setSizes(that) {
  const elementId = that.model.get("elementId");

  that.height = WIDGET_HEIGHT;
  let element = that.el;
  if (elementId) {
    element = document.getElementById(elementId);
    that.height = element.clientHeight;
  }
  that.width = element.clientWidth;
  that.margin = WIDGET_MARGIN;
}

export class ScatterPlotModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: ScatterPlotModel.model_name,
      _view_name: ScatterPlotModel.view_name,
      _model_module: ScatterPlotModel.model_module,
      _view_module: ScatterPlotModel.view_module,
      _model_module_version: ScatterPlotModel.model_module_version,
      _view_module_version: ScatterPlotModel.view_module_version,

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
  static model_module = packageData.name;
  static model_module_version = packageData.version;
  static view_name = "ScatterPlotView"; // Set to null if no view
  static view_module = packageData.name; // Set to null if no view
  static view_module_version = packageData.version;
}

export class ScatterPlotView extends DOMWidgetView {
  render() {
    plotAfterInterval(this);

    this.model.on("change:dataRecords", () => plotAfterInterval(this), this);
    this.model.on("change:x", () => plotAfterInterval(this), this);
    this.model.on("change:y", () => plotAfterInterval(this), this);
    this.model.on("change:hue", () => plotAfterInterval(this), this);
    window.addEventListener("resize", () => plotAfterInterval(this));
  }

  plot() {
    if (!this.scatterplot) this.scatterplot = new ScatterPlot(getElement(this));
    setSizes(this);

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

export class LinearPlotModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: LinearPlotModel.model_name,
      _view_name: LinearPlotModel.view_name,
      _model_module: LinearPlotModel.model_module,
      _view_module: LinearPlotModel.view_module,
      _model_module_version: LinearPlotModel.model_module_version,
      _view_module_version: LinearPlotModel.view_module_version,

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
  static model_module = packageData.name;
  static model_module_version = packageData.version;
  static view_name = "LinearPlotView"; // Set to null if no view
  static view_module = packageData.name; // Set to null if no view
  static view_module_version = packageData.version;
}

export class LinearPlotView extends DOMWidgetView {
  render() {
    plotAfterInterval(this);

    this.model.on("change:dataRecords", () => plotAfterInterval(this), this);
    this.model.on("change:x", () => plotAfterInterval(this), this);
    this.model.on("change:y", () => plotAfterInterval(this), this);
    this.model.on("change:hue", () => plotAfterInterval(this), this);
    window.addEventListener("resize", () => plotAfterInterval(this));
  }

  plot() {
    if (!this.linearplot) this.linearplot = new LinearPlot(getElement(this));
    setSizes(this);

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

export class BarPlotModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: BarPlotModel.model_name,
      _view_name: BarPlotModel.view_name,
      _model_module: BarPlotModel.model_module,
      _view_module: BarPlotModel.view_module,
      _model_module_version: BarPlotModel.model_module_version,
      _view_module_version: BarPlotModel.view_module_version,

      dataRecords: [],
      x: String,
      y: String,
      hue: String,
      elementId: String,
    };
  }

  static model_name = "BarPlotModel";
  static model_module = packageData.name;
  static model_module_version = packageData.version;
  static view_name = "BarPlotView"; // Set to null if no view
  static view_module = packageData.name; // Set to null if no view
  static view_module_version = packageData.version;
}

export class BarPlotView extends DOMWidgetView {
  render() {
    plotAfterInterval(this);

    this.model.on("change:dataRecords", () => plotAfterInterval(this), this);
    this.model.on("change:x", () => plotAfterInterval(this), this);
    this.model.on("change:y", () => plotAfterInterval(this), this);
    this.model.on("change:hue", () => plotAfterInterval(this), this);
    window.addEventListener("resize", () => plotAfterInterval(this));
  }

  plot() {
    if (!this.barplot) this.barplot = new BarPlot(getElement(this));
    setSizes(this);

    const data = this.model.get("dataRecords");
    const x = this.model.get("x");
    const y = this.model.get("y");
    const hue = this.model.get("hue");

    this.barplot.plot(data, x, y, hue, this.width, this.height, this.margin);
  }
}

export class HistogramPlotModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: HistogramPlotModel.model_name,
      _view_name: HistogramPlotModel.view_name,
      _model_module: HistogramPlotModel.model_module,
      _view_module: HistogramPlotModel.view_module,
      _model_module_version: HistogramPlotModel.model_module_version,
      _view_module_version: HistogramPlotModel.view_module_version,

      dataRecords: [],
      x: String,
      elementId: String,
    };
  }

  static model_name = "HistogramPlotModel";
  static model_module = packageData.name;
  static model_module_version = packageData.version;
  static view_name = "HistogramPlotView"; // Set to null if no view
  static view_module = packageData.name; // Set to null if no view
  static view_module_version = packageData.version;
}

export class HistogramPlotView extends DOMWidgetView {
  render() {
    plotAfterInterval(this);

    this.model.on("change:dataRecords", () => plotAfterInterval(this), this);
    this.model.on("change:x", () => plotAfterInterval(this), this);
    window.addEventListener("resize", () => plotAfterInterval(this));
  }

  plot() {
    if (!this.histogramplot)
      this.histogramplot = new HistogramPlot(getElement(this));
    setSizes(this);

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

export class RidgelinePlotModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: RidgelinePlotModel.model_name,
      _view_name: RidgelinePlotModel.view_name,
      _model_module: RidgelinePlotModel.model_module,
      _view_module: RidgelinePlotModel.view_module,
      _model_module_version: RidgelinePlotModel.model_module_version,
      _view_module_version: RidgelinePlotModel.view_module_version,

      dataRecords: [],
      xAxes: String,
      elementId: String,
    };
  }

  static model_name = "RidgelinePlotModel";
  static model_module = packageData.name;
  static model_module_version = packageData.version;
  static view_name = "RidgelinePlotView"; // Set to null if no view
  static view_module = packageData.name; // Set to null if no view
  static view_module_version = packageData.version;
}

export class RidgelinePlotView extends DOMWidgetView {
  render() {
    plotAfterInterval(this);

    this.model.on("change:dataRecords", () => plotAfterInterval(this), this);
    this.model.on("change:x", () => plotAfterInterval(this), this);
    window.addEventListener("resize", () => plotAfterInterval(this));
  }

  plot() {
    if (!this.ridgelineplot)
      this.ridgelineplot = new RidgelinePlot(getElement(this));
    setSizes(this);

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

export class EmbeddingModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: EmbeddingModel.model_name,
      _view_name: EmbeddingModel.view_name,
      _model_module: EmbeddingModel.model_module,
      _view_module: EmbeddingModel.view_module,
      _model_module_version: EmbeddingModel.model_module_version,
      _view_module_version: EmbeddingModel.view_module_version,

      matrix: [],
      grid_areas: [],
      grid_template_areas: String,
      style: String,
    };
  }

  static model_name = "EmbeddingModel";
  static model_module = packageData.name;
  static model_module_version = packageData.version;
  static view_name = "EmbeddingView"; // Set to null if no view
  static view_module = packageData.name; // Set to null if no view
  static view_module_version = packageData.version;
}

export class EmbeddingView extends DOMWidgetView {
  render() {
    this.value_changed();
  }

  value_changed() {
    const matrix = this.model.get("matrix");
    const grid_areas = this.model.get("grid_areas");
    const grid_template_areas = this.model.get("grid_template_areas");
    let style = this.model.get("style");

    if (!style) {
      style = "basic";
    }

    const node = document.createElement("div");

    node.classList.add(style);
    node.style.display = "grid";
    node.style.gridTemplateAreas = grid_template_areas;
    node.style.gridTemplateRows = "repeat(" + matrix.length + ", 180px)";
    node.style.gridTemplateColumns = "repeat(" + matrix[0].length + ", 1fr)";
    node.style.width = "100%";

    grid_areas.forEach((area) => {
      const grid_area = document.createElement("div");
      grid_area.setAttribute("id", area);
      grid_area.style.gridArea = area;
      grid_area.classList.add("dashboard-div");
      node.appendChild(grid_area);
    });

    this.el.appendChild(node);
  }
}

export class RangeSliderModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: RangeSliderModel.model_name,
      _view_name: RangeSliderModel.view_name,
      _model_module: RangeSliderModel.model_module,
      _view_module: RangeSliderModel.view_module,
      _model_module_version: RangeSliderModel.model_module_version,
      _view_module_version: RangeSliderModel.view_module_version,

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
  static model_module = packageData.name;
  static model_module_version = packageData.version;
  static view_name = "RangeSliderView"; // Set to null if no view
  static view_module = packageData.name; // Set to null if no view
  static view_module_version = packageData.version;
}

export class RangeSliderView extends DOMWidgetView {
  render() {
    plotAfterInterval(this);

    this.model.on("change:dataRecords", () => plotAfterInterval(this), this);
    this.model.on("change:variable", () => plotAfterInterval(this), this);
    this.model.on("change:step", () => plotAfterInterval(this), this);
    this.model.on("change:description", () => plotAfterInterval(this), this);
    window.addEventListener("resize", () => plotAfterInterval(this));
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

export class VideoModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: VideoModel.model_name,
      _view_name: VideoModel.view_name,
      _model_module: VideoModel.model_module,
      _view_module: VideoModel.view_module,
      _model_module_version: VideoModel.model_module_version,
      _view_module_version: VideoModel.view_module_version,

      value: new DataView(new ArrayBuffer()),
      format: "mp4",
      width: Number,
      height: Number,
      controls: true,
    };
  }

  static serializers = {
    ...DOMWidgetModel.serializers,
    value: {
      serialize: (value) => {
        return new DataView(value.buffer.slice(0));
      },
    },
  };

  static model_name = "VideoModel";
  static model_module = packageData.name;
  static model_module_version = packageData.version;
  static view_name = "VideoView"; // Set to null if no view
  static view_module = packageData.name; // Set to null if no view
  static view_module_version = packageData.version;
}

export class VideoView extends DOMWidgetView {
  remove() {
    if (this.src) {
      URL.revokeObjectURL(this.src);
    }
    super.remove();
  }

  play(that) {
    if (!that.video) return;
    that.video.play();
  }

  pause(that) {
    if (!that.video) return;
    that.video.pause();
  }

  setControls(that) {
    if (!that.video) return;
    let controls = that.model.get("controls");
    if (controls) that.video.setAttribute("controls", "");
    else that.video.removeAttribute("controls");
  }

  render() {
    plotAfterInterval(this);

    this.model.on("change:value", () => plotAfterInterval(this), this);
    this.model.on("change:width", () => plotAfterInterval(this), this);
    this.model.on("change:height", () => plotAfterInterval(this), this);
    this.model.on("change:controls", () => this.setControls(this), this);
    this.model.on("change:_play", () => this.play(this), this);
    this.model.on("change:_pause", () => this.pause(this), this);
    window.addEventListener("resize", () => plotAfterInterval(this));
  }

  plot() {
    this.el.innerHTML = "";
    let value = this.model.get("value");
    let format = this.model.get("format");
    let modelWidth = this.model.get("width");
    let modelHeight = this.model.get("height");
    let controls = this.model.get("controls");

    setSizes(this);

    if (modelWidth) this.width = modelWidth;
    if (modelHeight) this.height = modelHeight;

    this.video = document.createElement("video");
    const source = document.createElement("source");

    const type = `video/${format}`;
    const blob = new Blob([value], {
      type: type,
    });
    const url = URL.createObjectURL(blob);

    const oldurl = this.src;
    this.src = url;
    if (oldurl) {
      URL.revokeObjectURL(oldurl);
    }

    source.setAttribute("src", this.src);
    source.setAttribute("type", type);

    this.video.appendChild(source);
    if (controls) this.video.setAttribute("controls", "");
    this.video.style.margin = "auto";
    this.video.style.display = "block";

    this.video.style.width = this.width + "px";
    this.video.style.height = this.height + "px";

    getElement(this).appendChild(this.video);
  }
}

export class ImageModel extends DOMWidgetModel {
  defaults() {
    return {
      ...super.defaults(),
      _model_name: ImageModel.model_name,
      _view_name: ImageModel.view_name,
      _model_module: ImageModel.model_module,
      _view_module: ImageModel.view_module,
      _model_module_version: ImageModel.model_module_version,
      _view_module_version: ImageModel.view_module_version,

      value: String,
      format: "jpg",
      width: Number,
      height: Number,
    };
  }

  static model_name = "ImageModel";
  static model_module = packageData.name;
  static model_module_version = packageData.version;
  static view_name = "ImageView"; // Set to null if no view
  static view_module = packageData.name; // Set to null if no view
  static view_module_version = packageData.version;
}

export class ImageView extends DOMWidgetView {
  remove() {
    if (this.src) {
      URL.revokeObjectURL(this.src);
    }
    super.remove();
  }

  render() {
    plotAfterInterval(this);

    this.model.on("change:value", () => plotAfterInterval(this), this);
    this.model.on("change:width", () => plotAfterInterval(this), this);
    this.model.on("change:height", () => plotAfterInterval(this), this);
    window.addEventListener("resize", () => plotAfterInterval(this));
  }

  plot() {
    this.el.innerHTML = "";
    let value = this.model.get("value");
    let format = this.model.get("format");
    let modelWidth = this.model.get("width");
    let modelHeight = this.model.get("height");

    setSizes(this);
    if (modelWidth) this.width = modelWidth;
    if (modelHeight) this.height = modelHeight;

    const node = document.createElement("div");
    const image = document.createElement("img");

    const type = `image/${format}`;
    const blob = new Blob([value], {
      type: type,
    });
    const url = URL.createObjectURL(blob);

    const oldurl = this.src;
    this.src = url;
    if (oldurl) {
      URL.revokeObjectURL(oldurl);
    }

    image.setAttribute("src", this.src);
    image.setAttribute("type", type);
    image.style.maxWidth = "100%";
    image.style.maxHeight = "100%";
    image.style.margin = "auto";
    image.style.display = "block";

    node.style.width = this.width + "px";
    node.style.height = this.height + "px";
    node.appendChild(image);

    getElement(this).appendChild(node);
  }
}
