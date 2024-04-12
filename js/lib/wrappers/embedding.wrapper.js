import { linearhistplot } from "../graphs/linearhistplot";
import { scatterplot } from "../graphs/scatterplot";
import { barplot } from "../graphs/barplot";
import { histogramplot } from "../graphs/histogramplot";
import "../../css/widget.css";
const data = require("./data.json");

function plot_linearhistplot(
  linearData_x,
  linearData_y,
  histogramData,
  elementId,
  setValue
) {
  setTimeout(() => {
    linearhistplot(
      linearData_x,
      linearData_y,
      histogramData,
      elementId,
      setValue
    );
  }, 50);
}

function plot_scatterplot(
  data,
  x,
  y,
  hue,
  elementId,
  setValue,
  setSelectedValues
) {
  setTimeout(() => {
    scatterplot(data, x, y, hue, elementId, setValue, setSelectedValues);
  }, 50);
}

function plot_barplot(data, x, y, hue, elementId) {
  setTimeout(() => {
    barplot(data, x, y, hue, elementId);
  }, 50);
}

function plot_histogramplot(data, x, start, end, elementId) {
  setTimeout(() => {
    histogramplot(data, x, start, end, elementId);
  }, 50);
}

function main() {
  const node = document.createElement("div");

  const matrix = data.matrix;
  const grid_areas = data.grid_areas;
  const grid_template_areas = data.grid_template_areas;
  const style = data.style;

  if (!style) {
    style = "basic";
  }

  node.classList.add(style);
  node.style.display = "grid";
  node.style.gridTemplateAreas = grid_template_areas;
  node.style.gridTemplateRows = "repeat(" + matrix.length + ", 30vh)";
  node.style.gridTemplateColumns = "repeat(" + matrix[0].length + ", 1fr)";
  node.style.width = "100%";

  grid_areas.forEach((area) => {
    const grid_area = document.createElement("div");
    grid_area.setAttribute("id", area);
    grid_area.style.gridArea = area;
    grid_area.classList.add("dashboard-div");
    node.appendChild(grid_area);
  });

  document.body.appendChild(node);

  let linearhistplot_data = {};
  let scatterplot_data = {};
  let barplot_data = {};
  let histogramplot_data = {};

  function check_for_observers(observingData) {
    for (const obs of observingData["observing"]) {
      const observingDataName = Object.keys(obs)[0];
      const observedWidgetName = Object.keys(obs[observingDataName])[0];
      const observedData = obs[observingDataName][observedWidgetName];

      switch (observedWidgetName) {
        case "linearhistplot":
          break;
        case "scatterplot":
          switch (observedData) {
            case "clickedValue":
              scatterplot_data.setValue = (value) => {
                observingData[observingDataName] = value;
                observingData.plot();
              };
              break;
            case "selectedValues":
              scatterplot_data.setSelectedValues = (value) => {
                observingData[observingDataName] = value;
                observingData.plot();
              };
              break;
            default:
          }
          break;
        case "barplot":
          break;
        case "histogramplot":
          break;
        default:
      }
    }
  }

  let plot_linearhistplot_data = () =>
    plot_linearhistplot(
      linearhistplot_data.linearData_x,
      linearhistplot_data.linearData_y,
      linearhistplot_data.histogramData,
      linearhistplot_data.elementId,
      linearhistplot_data.setValue
    );
  let plot_scatterplot_data = () =>
    plot_scatterplot(
      scatterplot_data.data,
      scatterplot_data.x,
      scatterplot_data.y,
      scatterplot_data.hue,
      scatterplot_data.elementId,
      scatterplot_data.setValue,
      scatterplot_data.setSelectedValues
    );
  let plot_barplot_data = () =>
    plot_barplot(
      barplot_data.data,
      barplot_data.x,
      barplot_data.y,
      barplot_data.hue,
      barplot_data.elementId
    );
  let plot_histogramplot_data = () =>
    plot_histogramplot(
      histogramplot_data.data,
      histogramplot_data.x,
      histogramplot_data.start,
      histogramplot_data.end,
      histogramplot_data.elementId
    );

  const widgets = data.widgets;

  if (widgets["linearhistplot"]) {
    const widget_data = widgets["linearhistplot"];
    linearhistplot_data.linearData_x = widget_data.linearData_x;
    linearhistplot_data.linearData_y = widget_data.linearData_y;
    linearhistplot_data.histogramData = widget_data.histogramData;
    linearhistplot_data.elementId = widget_data.elementId;
    linearhistplot_data.observing = widget_data.observing;
    linearhistplot_data.plot = plot_linearhistplot_data;
  }
  if (widgets["scatterplot"]) {
    const widget_data = widgets["scatterplot"];
    scatterplot_data.data = widget_data.data;
    scatterplot_data.x = widget_data.x;
    scatterplot_data.y = widget_data.y;
    scatterplot_data.hue = widget_data.hue;
    scatterplot_data.elementId = widget_data.elementId;
    scatterplot_data.observing = widget_data.observing;
    scatterplot_data.plot = plot_scatterplot_data;
  }
  if (widgets["barplot"]) {
    const widget_data = widgets["barplot"];
    barplot_data.data = widget_data.data;
    barplot_data.x = widget_data.x;
    barplot_data.y = widget_data.y;
    barplot_data.hue = widget_data.hue;
    barplot_data.elementId = widget_data.elementId;
    barplot_data.observing = widget_data.observing;
    barplot_data.plot = plot_barplot_data;
    check_for_observers(barplot_data);
  }
  if (widgets["histogramplot"]) {
    const widget_data = widgets["histogramplot"];
    histogramplot_data.data = widget_data.data;
    histogramplot_data.x = widget_data.x;
    histogramplot_data.y = widget_data.start;
    histogramplot_data.hue = widget_data.end;
    histogramplot_data.elementId = widget_data.elementId;
    histogramplot_data.observing = widget_data.observing;
    histogramplot_data.plot = plot_histogramplot_data;
  }
  linearhistplot_data.plot();
  scatterplot_data.plot();
  barplot_data.plot();
  histogramplot_data.plot();
}

main();
