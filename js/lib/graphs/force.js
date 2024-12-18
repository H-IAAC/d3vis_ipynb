import * as d3 from "d3";
import { BasePlot } from "./baseplot";
import { InformationCard } from "./tools/information_card";

const NEGATIVE_COLOR = "#33AFFF";
const NEGATIVE_SELECTED_COLOR = "#039AFC";
const POSITIVE_COLOR = "#FF335B";
const POSITIVE_SELECTED_COLOR = "#FF0334";
const GRAPH_Y = 100;
const GRAPH_HEIGHT = 40;

function invertedSort(property) {
  if (property[0] === "-") {
    property = property.substr(1);
  }
  return function (a, b) {
    var result;
    if (a[property] < 0 && b[property] >= 0) {
      result = 1;
    } else if (a[property] >= 0 && b[property] < 0) {
      result = -1;
    } else {
      result =
        a[property] > b[property] ? 1 : a[property] < b[property] ? -1 : 0;
    }

    return result;
  };
}

function findResultingValue(data, x_value, baseValue) {
  let value = baseValue;
  data.forEach((d) => (value += d[x_value]));
  return value;
}

function getDomain(data, x_value, baseValue) {
  let min = baseValue;
  let max = baseValue;

  data.forEach((d) => {
    const value = d[x_value];

    if (value < 0) min += value;
    if (value > 0) max += value;
  });

  return [min, max];
}

function getScaledPolygon(xStart, xEnd, xScale, transition) {
  const x = xScale(xStart);
  const y = GRAPH_Y;
  const lenght = Math.abs(xScale(xEnd) - xScale(0));
  let TRI_HEIGHT = 10;
  const HALF_HEIGHT = GRAPH_HEIGHT / 2;
  let polygon;
  if (lenght < 0) TRI_HEIGHT = -TRI_HEIGHT;

  if (transition) {
    polygon = [
      { x: x, y: y + HALF_HEIGHT },
      { x: x + lenght, y: y + HALF_HEIGHT },
      { x: x + lenght - TRI_HEIGHT, y: y },
      { x: x + lenght, y: y - HALF_HEIGHT },
      { x: x, y: y - HALF_HEIGHT },
    ];
  } else if (xEnd > 0) {
    polygon = [
      { x: x, y: y + HALF_HEIGHT },
      { x: x + lenght, y: y + HALF_HEIGHT },
      { x: x + lenght + TRI_HEIGHT, y: y },
      { x: x + lenght, y: y - HALF_HEIGHT },
      { x: x, y: y - HALF_HEIGHT },
      { x: x + TRI_HEIGHT, y: y },
    ];
  } else {
    polygon = [
      { x: x, y: y + HALF_HEIGHT },
      { x: x + lenght, y: y + HALF_HEIGHT },
      { x: x + lenght - TRI_HEIGHT, y: y },
      { x: x + lenght, y: y - HALF_HEIGHT },
      { x: x, y: y - HALF_HEIGHT },
      { x: x - TRI_HEIGHT, y: y },
    ];
  }

  return polygon;
}

function getPolygon(xStart, xEnd, lenght, xValue) {
  let x = xStart;
  const y = GRAPH_Y;
  let TRI_HEIGHT = 10;
  const HALF_HEIGHT = GRAPH_HEIGHT / 2;
  let polygon;
  if (lenght < 0) TRI_HEIGHT = -TRI_HEIGHT;

  if (xValue > 0) {
    x = x - 1;
    xEnd = xEnd - 1;
    polygon = [
      { x: x, y: y + HALF_HEIGHT },
      { x: x + lenght, y: y + HALF_HEIGHT },
      { x: x + lenght + TRI_HEIGHT, y: y },
      { x: x + lenght, y: y - HALF_HEIGHT },
      { x: x, y: y - HALF_HEIGHT },
      { x: x + TRI_HEIGHT, y: y },
    ];
  } else {
    x = x + 1;
    xEnd = xEnd + 1;
    polygon = [
      { x: xEnd - lenght, y: y + HALF_HEIGHT },
      { x: xEnd, y: y + HALF_HEIGHT },
      { x: xEnd - TRI_HEIGHT, y: y },
      { x: xEnd, y: y - HALF_HEIGHT },
      { x: xEnd - lenght, y: y - HALF_HEIGHT },
      { x: xEnd - lenght - TRI_HEIGHT, y: y },
    ];
  }

  return polygon;
}

function getColor(xStart, xEnd) {
  const lenght = xEnd - xStart;
  if (lenght >= 0) return POSITIVE_COLOR;
  return NEGATIVE_COLOR;
}

export class ForcePlot extends BasePlot {
  plot(
    data,
    x_value,
    y_value,
    z_value,
    baseValue,
    setSelectedValues,
    width,
    height
  ) {
    const informationCard = new InformationCard(this.element);

    this.baseValue = baseValue;
    data.sort(invertedSort(x_value));
    this.init(width, height);

    var zoom = d3
      .zoom()
      .scaleExtent([1, 50])
      .extent([
        [0, 0],
        [width, height],
      ])
      .translateExtent([
        [0, 0],
        [width, height],
      ])
      .on("zoom", onZoom);

    const GG = this.gGrid;
    this.svg.call(zoom);

    const xDomain = getDomain(data, x_value, baseValue);
    const X = this.getXLinearScale(xDomain, width);
    const tickValues = [baseValue];

    let initialValue = baseValue;
    let finalValue = baseValue;
    while (initialValue >= xDomain[0] || finalValue <= xDomain[1]) {
      initialValue -= 1;
      finalValue += 1;
      tickValues.push(initialValue);
      tickValues.push(finalValue);
    }
    tickValues.sort;

    const xAxis = GG.append("g")
      .attr("class", "x axis")
      .attr("transform", "translate(0," + (GRAPH_Y + GRAPH_HEIGHT) + ")")
      .call(
        d3.axisBottom(X).tickValues(tickValues).tickFormat(d3.format(".3f"))
      );

    xAxis
      .append("text")
      .attr("class", "label")
      .attr("x", X.range()[1])
      .attr("y", -6)
      .style("text-anchor", "end")
      .attr("fill", "black")
      .text(x_value);

    let startingPoint = xDomain[0];
    let lastValue = 0;
    let transition = false;

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

    function mouseover(event, d) {
      if (d[x_value] >= 0)
        d3.select(this).attr("fill", POSITIVE_SELECTED_COLOR);
      else d3.select(this).attr("fill", NEGATIVE_SELECTED_COLOR);

      const text = d[y_value] + "=" + d[z_value];
      informationCard.showText(text, event.layerX, event.layerY);
    }

    function mouseout(event, d) {
      if (d[x_value] >= 0) d3.select(this).attr("fill", POSITIVE_COLOR);
      else d3.select(this).attr("fill", NEGATIVE_COLOR);
      informationCard.hide();
    }

    const arrows = GG.selectAll().data(data).enter().append("polygon");

    arrows
      .attr("points", function (d) {
        const xStart = startingPoint;
        startingPoint = startingPoint + Math.abs(d[x_value]);
        transition = lastValue >= 0 && d[x_value] < 0;
        lastValue = d[x_value];
        return [getScaledPolygon(xStart, d[x_value], X, transition)].map(
          function (d) {
            return d.map((d) => [d.x, d.y].join(",")).join(" ");
          }
        );
      })
      .attr("fill", (d) => getColor(0, d[x_value]))
      .attr("cursor", "pointer")
      .attr("class", "polygon");

    arrows
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .on("click", mouseClick);

    startingPoint = xDomain[0];

    const whiteArrows = GG.selectAll().data(data).enter().append("polygon");

    whiteArrows
      .attr("points", function (d) {
        const xStart = startingPoint;
        startingPoint = startingPoint + Math.abs(d[x_value]);
        return [getPolygon(X(xStart), X(startingPoint), 3, d[x_value])].map(
          function (d) {
            return d.map((d) => [d.x, d.y].join(",")).join(" ");
          }
        );
      })
      .attr("fill", "white");

    const baseValueLine = GG.append("path")
      .attr("stroke", "grey")
      .attr("stroke-dasharray", "2,2")
      .attr(
        "d",
        d3.line()([
          [X(baseValue), GRAPH_Y - GRAPH_HEIGHT],
          [X(baseValue), GRAPH_Y + GRAPH_HEIGHT],
        ])
      );

    const baseValueText = GG.append("g")
      .attr("width", 80)
      .attr("height", 40)
      .attr(
        "transform",
        "translate(" +
          (X(baseValue) - 40) +
          ", " +
          (GRAPH_Y - 2 * GRAPH_HEIGHT) +
          ")"
      );

    baseValueText
      .append("text")
      .attr("x", 40)
      .attr("y", 20)
      .attr("dy", 1)
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "middle")
      .attr("fill", "grey")
      .text("base value");

    const resultValue = findResultingValue(data, x_value, baseValue);

    const resultValueText = GG.append("g")
      .attr("width", 80)
      .attr("height", 40)
      .attr(
        "transform",
        "translate(" +
          (X(resultValue) - 40) +
          ", " +
          (GRAPH_Y - 2 * GRAPH_HEIGHT + 20) +
          ")"
      );

    resultValueText
      .append("text")
      .attr("x", 40)
      .attr("y", 20)
      .attr("dy", 1)
      .attr("dominant-baseline", "middle")
      .attr("text-anchor", "middle")
      .attr("fill", "black")
      .text(Math.round(resultValue * 1000) / 1000);

    function onZoom(event) {
      var newX = event.transform.rescaleX(X);

      xAxis.call(d3.axisBottom(newX));

      let startingPoint = xDomain[0];
      arrows
        .attr("points", function (d) {
          const xStart = startingPoint;
          startingPoint = startingPoint + Math.abs(d[x_value]);
          transition = lastValue >= 0 && d[x_value] < 0;
          lastValue = d[x_value];
          return [getScaledPolygon(xStart, d[x_value], newX, transition)].map(
            function (d) {
              return d.map((d) => [d.x, d.y].join(",")).join(" ");
            }
          );
        })
        .attr("fill", (d) => getColor(0, d[x_value]));

      startingPoint = xDomain[0];
      whiteArrows
        .attr("points", function (d) {
          const xStart = startingPoint;
          startingPoint = startingPoint + Math.abs(d[x_value]);
          return [
            getPolygon(newX(xStart), newX(startingPoint), 3, d[x_value]),
          ].map(function (d) {
            return d.map((d) => [d.x, d.y].join(",")).join(" ");
          });
        })
        .attr("fill", "white");

      baseValueLine.attr(
        "d",
        d3.line()([
          [newX(baseValue), GRAPH_Y - GRAPH_HEIGHT],
          [newX(baseValue), GRAPH_Y + GRAPH_HEIGHT],
        ])
      );

      baseValueText.attr(
        "transform",
        "translate(" +
          (newX(baseValue) - 40) +
          ", " +
          (GRAPH_Y - 2 * GRAPH_HEIGHT) +
          ")"
      );

      resultValueText.attr(
        "transform",
        "translate(" +
          (newX(resultValue) - 40) +
          ", " +
          (GRAPH_Y - 2 * GRAPH_HEIGHT + 20) +
          ")"
      );
    }
  }
}
