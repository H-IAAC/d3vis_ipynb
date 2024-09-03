import { BarPlot } from "./graphs/barplot";
import { DecisionPlot } from "./graphs/decision";
import { HistogramPlot } from "./graphs/histogramplot";
import { ScatterPlot } from "./graphs/scatterplot";
import { WaterfallPlot } from "./graphs/waterfall";
import "../css/widget.css";
import { LinearPlot } from "./graphs/linearplot";

function addBarplot() {
  const data = [
    { x_axis: 5.2, y_axis: 4, hue: "one" },
    { x_axis: 6, y_axis: 4, hue: "one" },
    { x_axis: 5.2, y_axis: 3, hue: "one" },
    { x_axis: 5.2, y_axis: 2, hue: "one" },
    { x_axis: 4, y_axis: 6, hue: "one" },
    { x_axis: 4, y_axis: 8, hue: "one" },
    { x_axis: 4, y_axis: 5, hue: "one" },
    { x_axis: 2, y_axis: 3.1, hue: "two" },
    { x_axis: 2, y_axis: 3.8, hue: "two" },
    { x_axis: 4, y_axis: 4, hue: "two" },
    { x_axis: 2, y_axis: 4, hue: "two" },
    { x_axis: 3, y_axis: 4, hue: "two" },
    { x_axis: 6, y_axis: 7, hue: "two" },
    { x_axis: 5, y_axis: 7, hue: "two" },
    { x_axis: 5, y_axis: 7, hue: "two" },
    { x_axis: 5, y_axis: 7, hue: "two" },
    { x_axis: 4.5, y_axis: 2.5, hue: "three" },
    { x_axis: 4.5, y_axis: 4, hue: "three" },
    { x_axis: 4.5, y_axis: 5, hue: "three" },
    { x_axis: 4, y_axis: 5, hue: "three" },
    { x_axis: 4, y_axis: 6, hue: "three" },
    { x_axis: 4, y_axis: 7, hue: "three" },
    { x_axis: 2, y_axis: 3, hue: "three" },
    { x_axis: 2, y_axis: 3.5, hue: "three" },
    { x_axis: 6, y_axis: 4, hue: "three" },
  ];
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
  barplot.plot(
    data,
    x,
    y,
    hue,
    direction,
    800,
    600,
    {
      top: 40,
      right: 20,
      bottom: 30,
      left: 80,
    },
    false
  );
}

function addHistogram() {
  const data = [
    { x_axis: 2, y_axis: 3 },
    { x_axis: 2.32, y_axis: 3.5 },
    { x_axis: 2.34, y_axis: 3.1 },
    { x_axis: 2.555, y_axis: 3.8 },
    { x_axis: 2.56, y_axis: 4 },
    { x_axis: 2.57, y_axis: 4 },
    { x_axis: 3, y_axis: 4 },
    { x_axis: 4, y_axis: 5 },
    { x_axis: 4, y_axis: 5 },
    { x_axis: 4, y_axis: 5 },
    { x_axis: 4, y_axis: 5 },
    { x_axis: 4, y_axis: 5 },
    { x_axis: 4, y_axis: 5 },
    { x_axis: 5, y_axis: 7 },
    { x_axis: 5, y_axis: 7 },
    { x_axis: 5, y_axis: 7 },
    { x_axis: 5, y_axis: 7 },
    { x_axis: 6, y_axis: 4 },
  ];
  const element = document.createElement("div");
  element.id = "component";
  element.style.width = "600px";
  element.style.height = "300px";
  document.body.appendChild(element);

  const that = this;
  const x = "x_axis";
  const start = false;
  const end = false;

  const histogramplot = HistogramPlot(element);
  histogramplot.plot(data, x, start, end, "component", that);
}

function addLinearplot() {
  const data = [
    { x_axis: 5.2, y_axis: 4, hue: "one" },
    { x_axis: 6, y_axis: 4, hue: "one" },
    { x_axis: 5.2, y_axis: 3, hue: "one" },
    { x_axis: 5.2, y_axis: 2, hue: "one" },
    { x_axis: 4.1, y_axis: 6, hue: "one" },
    { x_axis: 4.13, y_axis: 6.02, hue: "one" },
    { x_axis: 4.14, y_axis: 6, hue: "two" },
    { x_axis: 4.17, y_axis: 5.98, hue: "three" },
    { x_axis: 4.2, y_axis: 6, hue: "one" },
    { x_axis: 4.3, y_axis: 8, hue: "one" },
    { x_axis: 4.4, y_axis: 5, hue: "one" },
    { x_axis: 2.2, y_axis: 3.1, hue: "two" },
    { x_axis: 2.5, y_axis: 3.8, hue: "two" },
    { x_axis: 4, y_axis: 4.1, hue: "two" },
    { x_axis: 2, y_axis: 4.4, hue: "two" },
    { x_axis: 3, y_axis: 4, hue: "two" },
    { x_axis: 6, y_axis: 7, hue: "two" },
    { x_axis: 5.2, y_axis: 7, hue: "two" },
    { x_axis: 5, y_axis: 7.05, hue: "two" },
    { x_axis: 5, y_axis: 7, hue: "two" },
    { x_axis: 4.4, y_axis: 2.5, hue: "three" },
    { x_axis: 4.5, y_axis: 4, hue: "three" },
    { x_axis: 4.5, y_axis: 5, hue: "three" },
    { x_axis: 4, y_axis: 5, hue: "three" },
    { x_axis: 4, y_axis: 6, hue: "three" },
    { x_axis: 4, y_axis: 7, hue: "three" },
    { x_axis: 2.8, y_axis: 3, hue: "three" },
    { x_axis: 2, y_axis: 3.5, hue: "three" },
    { x_axis: 6, y_axis: 4, hue: "three" },
  ];
  const element = document.createElement("div");
  element.id = "component";
  element.style.width = "800px";
  element.style.height = "600px";
  document.body.appendChild(element);

  let x = "x_axis";
  let y = "y_axis";
  const hue = "hue";

  const linearplot = new LinearPlot(element);
  linearplot.plot(
    data,
    x,
    y,
    hue,
    () => {},
    800,
    600,
    {
      top: 40,
      right: 20,
      bottom: 30,
      left: 80,
    },
    false,
    false
  );
}

function addScatterplot() {
  const data = [
    { x_axis: 5.2, y_axis: 4, hue: "one" },
    { x_axis: 6, y_axis: 4, hue: "one" },
    { x_axis: 5.2, y_axis: 3, hue: "one" },
    { x_axis: 5.2, y_axis: 2, hue: "one" },
    { x_axis: 4.1, y_axis: 6, hue: "one" },
    { x_axis: 4.13, y_axis: 6.02, hue: "one" },
    { x_axis: 4.14, y_axis: 6, hue: "two" },
    { x_axis: 4.17, y_axis: 5.98, hue: "three" },
    { x_axis: 4.2, y_axis: 6, hue: "one" },
    { x_axis: 4.3, y_axis: 8, hue: "one" },
    { x_axis: 4.4, y_axis: 5, hue: "one" },
    { x_axis: 2.2, y_axis: 3.1, hue: "two" },
    { x_axis: 2.5, y_axis: 3.8, hue: "two" },
    { x_axis: 4, y_axis: 4.1, hue: "two" },
    { x_axis: 2, y_axis: 4.4, hue: "two" },
    { x_axis: 3, y_axis: 4, hue: "two" },
    { x_axis: 6, y_axis: 7, hue: "two" },
    { x_axis: 5.2, y_axis: 7, hue: "two" },
    { x_axis: 5, y_axis: 7.05, hue: "two" },
    { x_axis: 5, y_axis: 7, hue: "two" },
    { x_axis: 4.4, y_axis: 2.5, hue: "three" },
    { x_axis: 4.5, y_axis: 4, hue: "three" },
    { x_axis: 4.5, y_axis: 5, hue: "three" },
    { x_axis: 4, y_axis: 5, hue: "three" },
    { x_axis: 4, y_axis: 6, hue: "three" },
    { x_axis: 4, y_axis: 7, hue: "three" },
    { x_axis: 2.8, y_axis: 3, hue: "three" },
    { x_axis: 2, y_axis: 3.5, hue: "three" },
    { x_axis: 6, y_axis: 4, hue: "three" },
  ];
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
    data,
    x,
    y,
    hue,
    () => {},
    800,
    600,
    {
      top: 40,
      right: 20,
      bottom: 30,
      left: 80,
    },
    false,
    false
  );
}

function addWaterfall() {
  const data = [
    { feature_names: "Age", values: 0.56290748 },
    { feature_names: "Workclass", values: -0.37707573 },
    { feature_names: "Education-Num", values: 0.36556202 },
    { feature_names: "Marital Status", values: -0.46884385 },
    { feature_names: "Occupation", values: -0.35107816 },
    { feature_names: "Relationship", values: -0.64769396 },
    { feature_names: "Race", values: 0.01916319 },
    { feature_names: "Sex", values: 0.32815658 },
    { feature_names: "Capital Gain", values: -3.65317098 },
    { feature_names: "Capital Loss", values: -0.08319319 },
    { feature_names: "Hours per week", values: -0.27460556 },
    { feature_names: "Country", values: 0.03407126 },
  ];

  const element = document.createElement("div");
  element.id = "component";
  element.style.width = "1000px";
  element.style.height = "1000px";
  document.body.appendChild(element);

  const waterfall = new WaterfallPlot(element);
  waterfall.plot(
    data,
    "values",
    "feature_names",
    -2.5312646028291264,
    800,
    600,
    { top: 20, right: 20, bottom: 30, left: 80 },
    false
  );
}

function addDecision() {
  const data = [
    { feature_names: "one", values: [1, -9, 3] },
    { feature_names: "two", values: [2, 4, -5] },
    { feature_names: "three", values: [3, 7, 2] },
    { feature_names: "four", values: [4, 5, -7] },
    { feature_names: "five", values: [5, -4, -3] },
  ];
  const base_value = 6;

  const element = document.createElement("div");
  element.id = "component";
  element.style.width = "1000px";
  element.style.height = "1000px";
  document.body.appendChild(element);

  const decision = new DecisionPlot(element);
  decision.plot(
    data,
    "values",
    "feature_names",
    base_value,
    800,
    600,
    { top: 40, right: 20, bottom: 30, left: 80 },
    false
  );
}

addLinearplot();
