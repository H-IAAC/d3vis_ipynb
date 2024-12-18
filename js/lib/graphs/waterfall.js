import * as d3 from "d3";
import { BasePlot } from "./baseplot";

const NEGATIVE_COLOR = "#33AFFF";
const POSITIVE_COLOR = "#FF335B";
const TOP_PADDING = 30;

function absoluteSort(property, ascending) {
  let order = 1;
  if (ascending) order = -1;
  var sortOrder = 1;
  if (property[0] === "-") {
    sortOrder = -1;
    property = property.substr(1);
  }
  return function (a, b) {
    var result =
      Math.abs(a[property]) < Math.abs(b[property])
        ? order
        : Math.abs(a[property]) > Math.abs(b[property])
        ? order * -1
        : 0;
    return result * sortOrder;
  };
}

function getDomain(data, x_value, baseValue) {
  let min = baseValue;
  let max = baseValue;
  let currentValue = baseValue;
  const error_margin = 0.05;

  data.forEach((d) => {
    currentValue = currentValue + d[x_value];
    if (min > currentValue) min = currentValue;
    if (max < currentValue) max = currentValue;
  });

  const total = max - min;
  min = min - total * error_margin;
  max = max + total * error_margin;

  return [min, max];
}

function getPolygon(xStart, xEnd, yStart, xScale, yScale) {
  const x = xScale(xStart);
  const y = yScale(yStart) + yScale.bandwidth() / 2;
  const lenght = xScale(xEnd) - xScale(0);
  let TRI_HEIGHT = 10;
  const HALF_HEIGHT = yScale.bandwidth() / 2;
  let polygon;
  if (lenght < 0) TRI_HEIGHT = -TRI_HEIGHT;

  if (Math.abs(lenght) < Math.abs(TRI_HEIGHT)) {
    polygon = [
      { x: x, y: y + HALF_HEIGHT },
      { x: x + lenght, y: y },
      { x: x, y: y - HALF_HEIGHT },
    ];
  } else {
    polygon = [
      { x: x, y: y + HALF_HEIGHT },
      { x: x + lenght - TRI_HEIGHT, y: y + HALF_HEIGHT },
      { x: x + lenght, y: y },
      { x: x + lenght - TRI_HEIGHT, y: y - HALF_HEIGHT },
      { x: x, y: y - HALF_HEIGHT },
    ];
  }

  return polygon;
}

function getColor(xStart, xEnd) {
  const lenght = xEnd - xStart;
  if (lenght >= 0) return POSITIVE_COLOR;
  return NEGATIVE_COLOR;
}

export class WaterfallPlot extends BasePlot {
  plot(
    data,
    x_value,
    y_value,
    z_value,
    baseValue,
    setSelectedValues,
    width,
    height,
    noAxes
  ) {
    this.baseValue = baseValue;
    data.sort(absoluteSort(x_value, true));
    this.init(width, height);

    const GG = this.gGrid;

    const xDomain = getDomain(data, x_value, baseValue);
    const X = this.getXLinearScale(xDomain, width);
    const yDomain = data.map(function (d) {
      return d[y_value];
    });
    const Y = this.getYBandScale(yDomain, height, [0.2], TOP_PADDING);

    function formatYAxis(yAxisGenerator) {
      yAxisGenerator.tickFormat(
        (x, i) => Math.round(data[i][z_value] * 1000) / 1000 + " - " + x
      );
    }

    if (!noAxes) this.plotAxes(GG, X, Y, x_value, y_value, null, formatYAxis);

    function callUpdateSelected() {
      if (setSelectedValues) {
        setSelectedValues(GG.selectAll(".polygon.selected").data());
      }
    }

    function mouseClick(event, d) {
      const selection = d3.select(this);
      selection.classed("selected", !selection.classed("selected"));
      callUpdateSelected();
    }

    let startingPoint = baseValue;
    GG.selectAll()
      .data(data)
      .enter()
      .append("polygon")
      .attr("points", function (d) {
        const xStart = startingPoint;
        startingPoint = startingPoint + d[x_value];
        return [getPolygon(xStart, d[x_value], d[y_value], X, Y)].map(function (
          d
        ) {
          return d.map((d) => [d.x, d.y].join(",")).join(" ");
        });
      })
      .attr("fill", (d) => getColor(0, d[x_value]))
      .attr("cursor", "pointer")
      .attr("class", "polygon")
      .on("click", mouseClick);

    startingPoint = baseValue;
    GG.selectAll()
      .data(data)
      .enter()
      .append("path")
      .attr("stroke", "grey")
      .attr("stroke-dasharray", "2,2")
      .attr("d", function (d) {
        startingPoint = startingPoint + d[x_value];
        return d3.line()([
          [X(startingPoint), Y(d[y_value]) - Y.bandwidth() / 4],
          [X(startingPoint), Y(d[y_value]) + Y.bandwidth()],
        ]);
      });

    const textMaxWidth = 50;
    startingPoint = baseValue;
    const legend = GG.selectAll()
      .data(data)
      .enter()
      .append("g")
      .attr("width", textMaxWidth)
      .attr("height", Y.bandwidth())
      .attr("transform", function (d) {
        const xStart = startingPoint;
        startingPoint = startingPoint + d[x_value];
        let x;
        if (Math.abs(X(d[x_value]) - X(0)) > textMaxWidth) {
          x = (X(startingPoint) + X(xStart)) / 2 - textMaxWidth / 2;
        } else {
          if (d[x_value] >= 0) {
            x = X(startingPoint);
          } else {
            x = X(startingPoint) - textMaxWidth;
          }
        }

        const y = Y(d[y_value]);
        return "translate(" + x + ", " + y + ")";
      });

    legend
      .append("text")
      .attr("x", textMaxWidth / 2)
      .attr("y", Y.bandwidth() / 2)
      .attr("dy", 1)
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "middle")
      .attr("fill", function (d) {
        if (Math.abs(X(d[x_value]) - X(0)) > textMaxWidth) {
          return "white";
        } else {
          if (d[x_value] >= 0) {
            return POSITIVE_COLOR;
          } else {
            return NEGATIVE_COLOR;
          }
        }
      })
      .text(function (d) {
        let text = "" + Math.round(d[x_value] * 100) / 100;
        if (d[x_value] >= 0) text = "+" + text;
        return text;
      });

    GG.append("text")
      .attr("x", X(startingPoint) - 10)
      .attr("y", 10)
      .text("f(x) = " + Math.round(startingPoint * 1000) / 1000);
  }
}
