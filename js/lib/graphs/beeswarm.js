import * as d3 from "d3";
import { BasePlot } from "./baseplot";

const GRAD_BAR_WIDTH = 150;

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

export class BeeswarmPlot extends BasePlot {
  plot(data, x_value, y_value, color_value, width, height, margin, noAxes) {
    const randomString = Math.floor(
      Math.random() * Date.now() * 10000
    ).toString(36);

    data.sort(absoluteSort(x_value, true));
    this.init(width, height, margin);

    const GG = this.gGrid;

    const allValues = data.reduce((all, row) => {
      return all.concat(row[x_value]);
    }, []);
    const xDomain = d3.extent(allValues);

    const X = this.getXLinearScale(xDomain, width - GRAD_BAR_WIDTH, margin);
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
          [X.range()[0], Y(d[y_value]) + Y.bandwidth() / 2],
          [X.range()[1], Y(d[y_value]) + Y.bandwidth() / 2],
        ]);
      });

    GG.append("path")
      .attr("fill", "none")
      .attr("stroke", "grey")
      .attr("stroke-width", 2)
      .attr("d", function (d) {
        return d3.line()([
          [X(0), Y.range()[0]],
          [X(0), Y(data.at(-1)[y_value])],
        ]);
      });

    let scatteredData = {};
    data.forEach((d, i) => {
      const nodes = d[x_value].map((v) => ({ value: v }));
      const simulation = d3
        .forceSimulation(nodes)
        .force("x", d3.forceX((d) => X(d.value)).strength(1))
        .force("y", d3.forceY(Y(d[y_value]) + Y.bandwidth() / 2).strength(4))
        .force("collide", d3.forceCollide(2))
        .stop();

      simulation.tick(120);
      const colorDomain = d3.extent(d[color_value]);

      nodes.forEach((d, j) => {
        const value = data[i][color_value][j];

        let lineXScalePercentage =
          (value - colorDomain[0]) / (colorDomain[1] - colorDomain[0]);

        if (isNaN(lineXScalePercentage)) {
          lineXScalePercentage = 0;
        }
        d["color"] = lineXScalePercentage;
      });

      scatteredData[d[y_value]] = nodes;
    });

    function getColor(value) {
      return [
        "rgb(",
        value * colors[1].r + (1 - value) * colors[0].r,
        ",",
        value * colors[1].g + (1 - value) * colors[0].g,
        ",",
        value * colors[1].b + (1 - value) * colors[0].b,
        ")",
      ].join("");
    }

    function addPoints(data, scatteredData, i) {
      let datum = [];
      data.forEach((d) => {
        // console.log(d[y_value] + " - " + scatteredData[d[y_value]][i].color)
        datum.push({
          x: X(d[x_value][i]),
          y: scatteredData[d[y_value]][i].y,
          color: getColor(scatteredData[d[y_value]][i].color),
        });
      });

      GG.selectAll(".dot")
        .data(datum)
        .enter()
        .append("circle")
        .attr("r", 3)
        .attr("fill", function (d) {
          return d.color;
        })
        .attr("cx", function (d) {
          return d.x;
        })
        .attr("cy", function (d) {
          return d.y;
        });
    }

    for (let i = 0; i < numLines; i++) {
      addPoints(data, scatteredData, i);
    }

    let grad = GG.append("defs")
      .append("linearGradient")
      .attr("id", "grad" + randomString)
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "100%")
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
      .attr("x", X.range()[1] + 50)
      .attr("y", Y.range()[1])
      .attr("width", 10)
      .attr("height", Y.range()[0])
      .style("fill", "url(#grad" + randomString + ")");

    GG.append("text")
      .attr("x", X.range()[1] + 80)
      .attr("y", Y.range()[1] + 5)
      .text("High");

    GG.append("text")
      .attr("x", X.range()[1] + 80)
      .attr("y", Y.range()[0] + 2)
      .text("Low");

    GG.append("text")
      .attr("x", Y.range()[0] / 2 - 50)
      .attr("y", -X.range()[1] - 80)
      .attr("transform", "rotate(90)")
      .text("Feature value");
  }
}
