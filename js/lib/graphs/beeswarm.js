import * as d3 from "d3";
import { BasePlot } from "./baseplot";
import { ClickSelectButton } from "./tools/button_click_select";
import { SideBar } from "./tools/side_bar";
import { LineDragButton } from "./tools/button_line_drag";

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

    data.sort(absoluteSort(x_value, true));
    this.init(width, height);

    const GG = this.gGrid;

    const allValues = data.reduce((all, row) => {
      return all.concat(row[x_value]);
    }, []);
    const xDomain = d3.extent(allValues);

    const X = this.getXLinearScale(xDomain, width - GRAD_BAR_WIDTH);
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
    const dataSize = data[0][x_value].length;
    let forceValue = 1;
    if (dataSize < 50) {
      forceValue = 3;
    } else if (dataSize < 300) {
      forceValue = 2;
    }
    data.forEach((d, i) => {
      const nodes = d[x_value].map((v) => ({ value: v }));

      const simulation = d3
        .forceSimulation(nodes)
        .force("x", d3.forceX((d) => X(d.value)).strength(1))
        .force("y", d3.forceY(Y(d[y_value]) + Y.bandwidth() / 2).strength(1))
        .force("collide", d3.forceCollide(forceValue))
        .stop();

      simulation.tick(50);
      const colorDomain = d3.extent(d[z_value]);

      nodes.forEach((d, j) => {
        const value = data[i][z_value][j];

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
    const allDots = [];
    const selectedPaths = [];

    function clearSelectedPaths() {
      GG.selectAll(".beeswarm-dot-selected").remove();
      selectedPaths.length = 0;
      callUpdateSelected(selectedPaths);
    }

    function selectAllPaths() {
      selectedPaths.length = 0;
      for (let i = 0; i < numLines; i++) selectedPaths.push(i);
      callUpdateSelected(selectedPaths);
    }

    function dotClick(event, d) {
      setTimeout(() => {
        const selectedData = GG.selectAll(".beeswarm-dot-" + d.row).data();

        GG.selectAll(".dot")
          .data(selectedData)
          .enter()
          .append("circle")
          .attr("r", 6)
          .attr("fill", function (d) {
            return d.color;
          })
          .attr("stroke", "white")
          .attr("stroke-width", "1")
          .attr("cx", function (d) {
            return d.x;
          })
          .attr("cy", function (d) {
            return d.scatter_y;
          })
          .attr("class", "beeswarm-dot-selected");

        selectedPaths.push([selectedData[0].row][0]);
        callUpdateSelected(selectedPaths);
      }, 10);
    }

    function addPoints(data, scatteredData, i) {
      let datum = [];
      data.forEach((d) => {
        datum.push({
          x: X(d[x_value][i]),
          scatter_y: scatteredData[d[y_value]][i].y,
          y: Y(d[y_value]) + Y.bandwidth() / 2,
          color: getColor(scatteredData[d[y_value]][i].color),
          [y_value]: d[y_value],
          row: i,
        });
      });

      let pathDatum = [
        { x: X(0), scatter_y: Y.range()[0], y: Y.range()[0], index: i },
        ...datum,
      ];

      const newPath = GG.append("path").datum(pathDatum);

      newPath
        .attr("visibility", "hidden")
        .attr("fill", "none")
        .attr("stroke", "grey")
        .attr("stroke-width", 1)
        .attr(
          "d",
          d3
            .line()
            .x((d) => {
              return d.x;
            })
            .y((d) => {
              return d.scatter_y;
            })
        )
        .classed("beeswarm-path", true)
        .attr("opacity", 0.4);

      allPaths.push(newPath);

      const newDot = GG.selectAll(".dot").data(datum).enter().append("circle");

      newDot
        .attr("r", 3)
        .attr("fill", function (d) {
          return d.color;
        })
        .attr("cx", function (d) {
          return d.x;
        })
        .attr("cy", function (d) {
          return d.scatter_y;
        })
        .attr("cursor", "pointer")
        .attr("class", function (d) {
          return "beeswarm-dot-" + d.row;
        });

      allDots.push(newDot);
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

    function selectButtonStart() {
      clearSelectedPaths();
      this.svg.on("click", clearSelectedPaths);
      allDots.forEach((dot) =>
        dot.on("click", dotClick).attr("cursor", "pointer")
      );
    }

    const referenceLines = GG.selectAll().data(data).enter().append("path");

    referenceLines
      .attr("visibility", "hidden")
      .attr("stroke", "white")
      .attr("stroke-width", "5")
      .attr("stroke-opacity", "0")
      .attr("d", function (d) {
        return d3.line()([
          [X.range()[0], Y(d[y_value]) + Y.bandwidth() / 2],
          [X.range()[1], Y(d[y_value]) + Y.bandwidth() / 2],
        ]);
      });

    function selectButtonEnd() {
      this.svg.on("click", null);
      clearSelectedPaths();
      allDots.forEach((dot) => dot.on("click", null).attr("cursor", ""));
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
        GG.selectAll(".beeswarm-path"),
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
