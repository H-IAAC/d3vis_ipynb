import { DOMWidgetModel, DOMWidgetView } from "@jupyter-widgets/base";
import "../css/widget.css";
import { barplot } from "./graphs/barplot";
import { histogramplot } from "./graphs/histogramplot";
import { linearplot } from "./graphs/linearplot";
import { rangeslider } from "./graphs/rangeslider";
import { scatterplot } from "./graphs/scatterplot";
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

function getElementAndSizes(elementId, thatEl) {
  let height = WIDGET_HEIGHT;
  let element = thatEl;
  if (elementId) {
    element = document.getElementById(elementId);
    height = element.clientHeight;
  }
  const width = element.clientWidth;
  const margin = WIDGET_MARGIN;

  return [element, width, height, margin]
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
    let data = this.model.get("dataRecords");
    let x = this.model.get("x");
    let y = this.model.get("y");
    let hue = this.model.get("hue");
    let elementId = this.model.get("elementId");

    if (typeof data === "function") data = data();
    if (typeof x === "function") x = x();
    if (typeof y === "function") y = y();
    if (typeof hue === "function") hue = hue();
    if (typeof elementId === "function") elementId = elementId();

    const [element, width, height, margin] = getElementAndSizes(elementId, this.el);

    scatterplot(
      data,
      x,
      y,
      hue,
      element,
      this.setValue.bind(this),
      this.setSelectedValues.bind(this),
      width,
      height,
      margin
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
    let data = this.model.get("dataRecords");
    let x = this.model.get("x");
    let y = this.model.get("y");
    let hue = this.model.get("hue");
    let elementId = this.model.get("elementId");

    if (typeof data === "function") data = data();
    if (typeof x === "function") x = x();
    if (typeof y === "function") y = y();
    if (typeof hue === "function") hue = hue();
    if (typeof elementId === "function") elementId = elementId();

    const [element, width, height, margin] = getElementAndSizes(elementId, this.el);

    linearplot(
      data,
      x,
      y,
      hue,
      element,
      this.setValue.bind(this),
      this.setSelectedValues.bind(this),
      width,
      height,
      margin
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
    let data = this.model.get("dataRecords");
    let x = this.model.get("x");
    let y = this.model.get("y");
    let hue = this.model.get("hue");
    let elementId = this.model.get("elementId");

    if (typeof data === "function") data = data();
    if (typeof x === "function") x = x();
    if (typeof y === "function") y = y();
    if (typeof hue === "function") hue = hue();
    if (typeof elementId === "function") elementId = elementId();

    const [element, width, height, margin] = getElementAndSizes(elementId, this.el);

    barplot(data, x, y, hue, element, width, height, margin);
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
      start: Number,
      end: Number,
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
    this.model.on("change:start", () => plotAfterInterval(this), this);
    this.model.on("change:end", () => plotAfterInterval(this), this);
    window.addEventListener("resize", () => plotAfterInterval(this));
  }

  plot() {
    let data = this.model.get("dataRecords");
    let x = this.model.get("x");
    let start = this.model.get("start");
    let end = this.model.get("end");
    let elementId = this.model.get("elementId");

    if (typeof data === "function") data = data();
    if (typeof x === "function") x = x();
    if (typeof start === "function") start = start();
    if (typeof end === "function") end = end();
    if (typeof elementId === "function") elementId = elementId();

    const [element, width, height, margin] = getElementAndSizes(elementId, this.el);

    histogramplot(data, x, start, end, element, width, height, margin);
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

      value: String,
      format: "mp4",
      width: Number,
      height: Number,
    };
  }

  static model_name = "VideoModel";
  static model_module = packageData.name;
  static model_module_version = packageData.version;
  static view_name = "VideoView"; // Set to null if no view
  static view_module = packageData.name; // Set to null if no view
  static view_module_version = packageData.version;
}

export class VideoView extends DOMWidgetView {
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
    let elementId = this.model.get("elementId");

    if (typeof value === "function") value = value();
    if (typeof format === "function") format = format();
    if (typeof modelWidth === "function") modelWidth = modelWidth();
    if (typeof modelHeight === "function") modelHeight = modelHeight();

    let [element, width, height, margin] = getElementAndSizes(elementId, this.el);
    if (modelWidth) width = modelWidth
    if (modelHeight) height = modelHeight

    const node = document.createElement("div");
    const video = document.createElement("video");
    const source = document.createElement("source");

    source.setAttribute("src", value);
    source.setAttribute("type", "video/" + format);

    video.appendChild(source);
    video.setAttribute("controls", "");
    video.style.maxWidth = "100%";
    video.style.maxHeight = "100%";
    video.style.margin = "auto";
    video.style.display = "block";

    node.style.width = width + "px";
    node.style.height = height + "px";
    node.appendChild(video);

    element.appendChild(node);
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
    let modelWidth = this.model.get("width");
    let modelHeight = this.model.get("height");
    let elementId = this.model.get("elementId");

    if (typeof value === "function") value = value();
    if (typeof modelWidth === "function") modelWidth = modelWidth();
    if (typeof modelHeight === "function") modelHeight = modelHeight();
    if (typeof elementId === "function") elementId = elementId();

    let [element, width, height, margin] = getElementAndSizes(elementId, this.el);
    if (modelWidth) width = modelWidth
    if (modelHeight) height = modelHeight

    const node = document.createElement("div");
    const image = document.createElement("img");

    image.setAttribute("src", value);
    image.style.maxWidth = "100%";
    image.style.maxHeight = "100%";
    image.style.margin = "auto";
    image.style.display = "block";

    node.style.width = width + "px";
    node.style.height = height + "px";
    node.appendChild(image);

    element.appendChild(node);
  }
}
