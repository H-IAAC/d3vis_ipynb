import * as d3 from "d3";
import { BasePlot } from "./baseplot";

const colors = [
  { r: 17, g: 102, b: 255 },
  { r: 255, g: 51, b: 51 },
];

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
  const margin = 0.02;

  for (let i = 0; i < numLines; i++) {
    const lineMinMax = getMinMax(i);
    if (lineMinMax[0] < min) min = lineMinMax[0];
    if (lineMinMax[1] > max) max = lineMinMax[1];
  }

  if (max - baseValue > baseValue - min) {
    min = baseValue - max;
  } else {
    max = baseValue - min;
  }

  const total = max - min;
  min = min - total * margin;
  max = max + total * margin;

  return [min, max];
}

export class DecisionPlot extends BasePlot {
  plot(data, x_value, y_value, baseValue, width, height, margin, noAxes) {
    this.baseValue = baseValue;
    data.sort(absoluteSort(x_value, true));
    this.init(width, height, margin);

    const GG = this.gGrid;

    const xDomain = getDomain(data, x_value, baseValue);
    const X = this.getXLinearScale(xDomain, width, margin);
    const yDomain = data.map(function (d) {
      return d[y_value];
    });
    const Y = this.getYBandScale(yDomain, height, margin, [0.2]).paddingOuter(
      0
    );

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

    function addPath(data, i) {
      let pathPoint = baseValue;
      let datum = [{ x: X(pathPoint), y: Y.range()[0] }];
      data.forEach((d) => {
        pathPoint += d[x_value][i];
        datum.push({ x: X(pathPoint), y: Y(d[y_value]) });
      });

      const lineXScalePercentage = X(pathPoint) / X.range()[1];

      const lineColorRGB = [
        "rgb(",
        lineXScalePercentage * colors[1].r +
          (1 - lineXScalePercentage) * colors[0].r,
        ",",
        lineXScalePercentage * colors[1].g +
          (1 - lineXScalePercentage) * colors[0].g,
        ",",
        lineXScalePercentage * colors[1].b +
          (1 - lineXScalePercentage) * colors[0].b,
        ")",
      ].join("");

      GG.append("path")
        .datum(datum)
        .attr("fill", "none")
        .attr("stroke", lineColorRGB)
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
        );
    }

    for (let i = 0; i < numLines; i++) {
      addPath(data, i);
    }

    let grad = GG.append("defs")
      .append("linearGradient")
      .attr("id", "grad")
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
      .style("fill", "url(#grad)");
  }

  replot(data, x_value, y_value, baseValue, width, height, margin, noAxes) {
    this.clear();
    this.plot(data, x_value, y_value, baseValue, width, height, margin, noAxes);
  }
}
