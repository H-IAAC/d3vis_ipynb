import "../css/widget.css";
import { BarPlot } from "./graphs/barplot";
import { BeeswarmPlot } from "./graphs/beeswarm";
import { DecisionPlot } from "./graphs/decision";
import { ForcePlot } from "./graphs/force";
import { HeatmapPlot } from "./graphs/heatmap";
import { HistogramPlot } from "./graphs/histogramplot";
import { LinearPlot } from "./graphs/linearplot";
import { RidgelinePlot } from "./graphs/ridgelineplot";
import { ScatterPlot } from "./graphs/scatterplot";
import { WaterfallPlot } from "./graphs/waterfall";
import {
  heatmapData,
  scatterplotData,
  shapData,
  singleShapData,
} from "./web-dev-data";

function addBarplot() {
  const element = document.createElement("div");
  element.id = "component";
  element.style.width = "1000px";
  element.style.height = "1000px";
  document.body.appendChild(element);

  const that = this;
  let direction = "horizontal";
  let x = "x_axis";
  let y = "y_axis";
  if (direction === "horizontal") {
    x = "y_axis";
    y = "x_axis";
  }

  const hue = "hue";

  const start = false;
  const end = false;

  const barplot = new BarPlot(element);
  barplot.plot(scatterplotData, x, y, hue, direction, 800, 600, false);
}

function addForce() {
  const element = document.createElement("div");
  element.id = "component";
  element.style.width = "1000px";
  element.style.height = "1000px";
  document.body.appendChild(element);

  const force = new ForcePlot(element);
  force.plot(
    singleShapData,
    "values",
    "feature_names",
    "data",
    -2.5312646028291264,
    () => {},
    800,
    200
  );
}

function addHeatmapPlot() {
  const data = heatmapData;
  const element = document.createElement("div");
  element.id = "component";
  element.style.width = "800px";
  element.style.height = "600px";
  document.body.appendChild(element);

  let x = "group";
  let y = "variable";
  const hue = "value";

  const heatmapPlot = new HeatmapPlot(element);
  heatmapPlot.plot(data, x, y, hue, null, null, null, 0, 1000, 600, false);
}

function addHistogram() {
  const element = document.createElement("div");
  element.id = "component";
  element.style.width = "600px";
  element.style.height = "300px";
  document.body.appendChild(element);

  const x = "x_axis";

  const histogramplot = new HistogramPlot(element);
  histogramplot.plot(scatterplotData, x, 800, 600, false);
}

function addRidgeline() {
  const element = document.createElement("div");
  element.id = "component";
  element.style.width = "600px";
  element.style.height = "300px";
  document.body.appendChild(element);

  const xAxes = ["x_axis", "y_axis"];

  const ridgelinePlot = new RidgelinePlot(element);
  ridgelinePlot.plot(scatterplotData, xAxes, 800, 600, false);
}

function addLinearplot() {
  const element = document.createElement("div");
  element.id = "component";
  element.style.width = "800px";
  element.style.height = "600px";
  document.body.appendChild(element);

  let x = "x_axis";
  let y = "y_axis";
  const hue = "hue";

  const linearplot = new LinearPlot(element);
  linearplot.plot(scatterplotData, x, y, hue, () => {}, 800, 600, false, false);
}

function addScatterplot() {
  const element = document.createElement("div");
  element.id = "component";
  element.style.width = "800px";
  element.style.height = "600px";
  document.body.appendChild(element);

  let x = "x_axis";
  let y = "y_axis";
  const hue = "hue";

  const scatterplot = new ScatterPlot(element);
  scatterplot.plot(
    scatterplotData,
    x,
    y,
    hue,
    () => {},
    800,
    600,

    false,
    false
  );
}

function addWaterfall() {
  const element = document.createElement("div");
  element.id = "component";
  element.style.width = "1000px";
  element.style.height = "1000px";
  document.body.appendChild(element);

  const waterfall = new WaterfallPlot(element);
  waterfall.plot(
    singleShapData,
    "values",
    "feature_names",
    "data",
    -2.5312646028291264,
    () => {},
    800,
    600,

    false
  );
}

function addDecision() {
  const base_value = 0;

  const element = document.createElement("div");
  element.id = "component";
  element.style.width = "800px";
  element.style.height = "600px";
  document.body.appendChild(element);

  const decision = new DecisionPlot(element);
  decision.plot(
    shapData,
    "values",
    "feature_names",
    "data",
    base_value,
    () => {},
    800,
    600,

    false
  );
}

function addBeeswarm() {
  const base_value = 1;

  const element = document.createElement("div");
  element.id = "component";
  element.style.width = "800px";
  element.style.height = "600px";
  document.body.appendChild(element);

  const decision = new BeeswarmPlot(element);
  decision.plot(
    shapData,
    "values",
    "feature_names",
    "data",
    base_value,
    () => {},
    800,
    600,
    false,
    false
  );
}

addRidgeline();
