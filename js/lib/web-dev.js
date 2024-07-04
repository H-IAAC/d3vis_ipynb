import { HistogramPlot } from "./graphs/histogramplot";
import { WatterfallPlot } from "./graphs/waterfall";

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

function addWatterfall() {
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

  const watterfall = new WatterfallPlot(element);
  watterfall.plot(
    data,
    "values",
    "feature_names",
    -2.5312646028291264,
    800,
    600,
    { top: 20, right: 20, bottom: 30, left: 80 },
    -false
  );
}

addWatterfall();
