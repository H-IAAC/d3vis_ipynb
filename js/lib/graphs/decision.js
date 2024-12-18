import * as d3 from "d3";
import { BasePlot } from "./baseplot";
import { SideBar } from "./tools/side_bar";
import { ClickSelectButton } from "./tools/button_click_select";
import { LineDragButton } from "./tools/button_line_drag";

const colors = [
  { r: 17, g: 102, b: 255 },
  { r: 255, g: 51, b: 51 },
];

function getColor(percentage) {
  return [
    "rgb(",
    percentage * colors[1].r + (1 - percentage) * colors[0].r,
    ",",
    percentage * colors[1].g + (1 - percentage) * colors[0].g,
    ",",
    percentage * colors[1].b + (1 - percentage) * colors[0].b,
    ")",
  ].join("");
}

function absoluteSort(property, ascending) {
  function arrayAbsSum(array) {
    let sum = 0;
    array.forEach((i) => (sum += Math.abs(i)));
    return sum;
  }

  let order = 1;
  if (ascending) order = -1;
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    var result =
      arrayAbsSum(a[property]) < arrayAbsSum(b[property])
        ? order
        : arrayAbsSum(a[property]) > arrayAbsSum(b[property])
        ? order * -1
        : 0;
    return result * sortOrder;
  };
}

function getDomain(data, x_value, baseValue) {
  function getMinMax(i) {
    let min = baseValue;
    let max = baseValue;
    let currentValue = baseValue;

    data.forEach((d) => {
      currentValue = currentValue + d[x_value][i];
      if (min > currentValue) min = currentValue;
      if (max < currentValue) max = currentValue;
    });

    return [min, max];
  }
  let min = baseValue;
  let max = baseValue;

  const numLines = data[0][x_value].length;
  const error_margin = 0.02;

  for (let i = 0; i < numLines; i++) {
    const lineMinMax = getMinMax(i);
    if (lineMinMax[0] < min) min = lineMinMax[0];
    if (lineMinMax[1] > max) max = lineMinMax[1];
  }

  if (max - baseValue > baseValue - min) {
    min = 2 * baseValue - max;
  } else {
    max = 2 * baseValue - min;
  }

  const total = max - min;
  min = min - total * error_margin;
  max = max + total * error_margin;

  return [min, max];
}

export class DecisionPlot extends BasePlot {
  plot(
    data,
    x_value,
    y_value,
    z_value,
    baseValue,
    setSelectedValues,
    width,
    height,
    noAxes,
    noSideBar
  ) {
    const randomString = Math.floor(
      Math.random() * Date.now() * 10000
    ).toString(36);

    if (!noSideBar) width = width - SideBar.SIDE_BAR_WIDTH - 1;

    this.baseValue = baseValue;
    data.sort(absoluteSort(x_value, true));
    this.init(width, height);

    const GG = this.gGrid;

    const xDomain = getDomain(data, x_value, baseValue);
    const X = this.getXLinearScale(xDomain, width);
    const yDomain = data.map(function (d) {
      return d[y_value];
    });
    const Y = this.getYBandScale(yDomain, height, [0.2]).paddingOuter(0);

    if (!noAxes) this.plotAxes(GG, X, Y, x_value, y_value);

    const numLines = data[0][x_value].length;

    GG.selectAll()
      .data(data)
      .enter()
      .append("path")
      .attr("stroke", "grey")
      .attr("stroke-dasharray", "2,2")
      .attr("d", function (d) {
        return d3.line()([
          [X.range()[0], Y(d[y_value])],
          [X.range()[1], Y(d[y_value])],
        ]);
      });

    let grad = GG.append("defs")
      .append("linearGradient")
      .attr("id", "grad" + randomString)
      .attr("x1", "0%")
      .attr("x2", "100%")
      .attr("y1", "0%")
      .attr("y2", "0%");

    grad
      .selectAll("stop")
      .data(colors)
      .enter()
      .append("stop")
      .style("stop-color", function (d) {
        return ["rgb(", d.r, ",", d.g, ",", d.b, ")"].join("");
      })
      .attr("offset", function (d, i) {
        return 100 * (i / (colors.length - 1)) + "%";
      });

    GG.append("rect")
      .attr("x", X.range()[0])
      .attr("y", -20)
      .attr("width", X.range()[1])
      .attr("height", 20)
      .style("fill", "url(#grad" + randomString + ")");

    GG.append("path")
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-width", 2)
      .attr("d", function (d) {
        return d3.line()([
          [X(baseValue), Y.range()[0]],
          [X(baseValue), Y(data.at(-1)[y_value])],
        ]);
      });

    function callUpdateSelected(indexes) {
      allPaths.forEach((path) => {
        if (indexes.includes(path.data()[0][0].index)) {
          path.classed("selected", true);
        } else {
          path.classed("selected", false);
        }
      });
      if (setSelectedValues) {
        const filteredData = data.map((d) => {
          return {
            [y_value]: d[y_value],
            [x_value]: indexes.map((i) => d[x_value][i]),
            [z_value]: indexes.map((i) => d[z_value][i]),
            base_values: baseValue,
          };
        });
        setSelectedValues(filteredData);
      }
    }

    const allPaths = [];
    const selectedPaths = [];

    function clearSelectedPaths() {
      selectedPaths.length = 0;
      callUpdateSelected(selectedPaths);
    }

    function selectAllPaths() {
      selectedPaths.length = 0;
      for (let i = 0; i < numLines; i++) selectedPaths.push(i);
      callUpdateSelected(selectedPaths);
    }

    function pathClick(event, d) {
      setTimeout(() => {
        selectedPaths.push(d[0].index);
        callUpdateSelected(selectedPaths);
      }, 10);
    }

    function addPath(data, i) {
      let pathPoint = baseValue;
      let datum = [{ x: X(pathPoint), y: Y.range()[0], index: i }];
      data.forEach((d) => {
        pathPoint += d[x_value][i];
        datum.push({
          x: X(pathPoint),
          y: Y(d[y_value]),
          [y_value]: d[y_value],
        });
      });

      const lineXScalePercentage = X(pathPoint) / X.range()[1];

      const newPath = GG.append("path").datum(datum);

      newPath
        .attr("fill", "none")
        .attr("stroke", getColor(lineXScalePercentage))
        .attr("stroke-width", 2)
        .attr(
          "d",
          d3
            .line()
            .x((d) => {
              return d.x;
            })
            .y((d) => {
              return d.y;
            })
        )
        .classed("decision-path", true)
        .attr("opacity", 0.4);

      allPaths.push(newPath);
    }

    for (let i = 0; i < numLines; i++) {
      addPath(data, i);
    }

    const referenceLines = GG.selectAll().data(data).enter().append("path");

    referenceLines
      .attr("visibility", "hidden")
      .attr("stroke", "white")
      .attr("stroke-width", "5")
      .attr("stroke-opacity", "0")
      .attr("d", function (d) {
        return d3.line()([
          [X.range()[0], Y(d[y_value])],
          [X.range()[1], Y(d[y_value])],
        ]);
      });

    function selectButtonStart() {
      clearSelectedPaths();
      this.svg.on("click", clearSelectedPaths);
      allPaths.forEach((path) =>
        path.on("click", pathClick).attr("cursor", "pointer")
      );
    }

    function selectButtonEnd() {
      this.svg.on("click", null);
      allPaths.forEach((path) => path.on("click", null).attr("cursor", ""));
    }

    function lineDragButtonStart() {
      selectAllPaths();
      referenceLines.attr("cursor", "crosshair");
    }

    function lineDragButtonEnd() {
      referenceLines.attr("cursor", "");
    }

    if (!noSideBar) {
      const clickSelectButton = new ClickSelectButton(true);
      clickSelectButton.addWhenSelectedCallback(selectButtonStart.bind(this));
      clickSelectButton.addWhenUnselectedCallback(selectButtonEnd.bind(this));
      const lineDragButton = new LineDragButton(
        this.margin.left,
        this.margin.top,
        referenceLines,
        GG.selectAll(".decision-path"),
        callUpdateSelected,
        GG
      );
      lineDragButton.addWhenSelectedCallback(lineDragButtonStart.bind(this));
      lineDragButton.addWhenUnselectedCallback(lineDragButtonEnd.bind(this));

      const sideBar = new SideBar(
        this.element,
        clickSelectButton,
        lineDragButton
      );
    }
  }
}
