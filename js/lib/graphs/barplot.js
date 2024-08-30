import * as d3 from "d3";
import { BasePlot } from "./baseplot";

function standardDeviationPerSquareRootedSize(array, mean) {
  let sd = 0;
  array.forEach((num) => (sd = sd + (num - mean) ** 2));
  sd = Math.sqrt(sd) / array.length;
  return sd;
}

function getCI(array) {
  const mean = array.reduce((a, b) => a + b, 0) / array.length;
  const complement = 1.96 * standardDeviationPerSquareRootedSize(array, mean);
  return [mean - complement, mean + complement];
}

export class BarPlot extends BasePlot {
  plot(data, x_value, y_value, hue, direction, width, height, margin, noAxes) {

    this.init(width, height, margin);

    const GG = this.gGrid;

    let base_value, side_value;
    if (direction === "vertical") {
      base_value = x_value;
      side_value = y_value;
    } else {
      base_value = y_value;
      side_value = x_value;
    }

    if (!hue) hue = base_value;

    const allHues = data.reduce((all, row) => {
      if (all && all.indexOf(row[hue]) === -1) {
        all.push(row[hue]);
      }
      return all;
    }, []);
    const values = {};

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    if (hue == base_value) {
      createSingleBars(this);
    } else {
      createGroupBars(this);
    }

    function createSingleBars(that) {
      let result = data.reduce((res, row) => {
        const x = row[base_value];
        const y = row[side_value];

        if (x in res) {
          res[x] += y;
          values[x]["qt"] += 1;
          values[x][side_value].push(y);
        } else {
          const newValues = {};
          newValues["qt"] = 1;
          newValues[side_value] = [];
          newValues[side_value].push(y);
          values[x] = newValues;
          res[x] = y;
        }

        return res;
      }, {});

      result = Object.keys(result).map((key) => {
        const newRow = {};
        newRow[base_value] = key;
        newRow[side_value] = result[key];
        if (values[key]["qt"] != 0) {
          newRow[side_value] = newRow[side_value] / values[key]["qt"];
        }
        return newRow;
      });

      Object.keys(values).forEach((key) => {
        const array = values[key][side_value];
        const [min, max] = getCI(array);
        values[key]["min"] = min;
        values[key]["max"] = max;
      });

      const groups = result.map((r) => r[base_value]).sort();

      const side_domain = [];
      const all_min_max = Object.keys(values).map((key) => values[key]);
      side_domain.push(d3.min(all_min_max, (v) => v.min));
      side_domain.push(d3.max(all_min_max, (v) => v.max));
      if (side_domain[0] > 0 && side_domain[1] > 0) side_domain[0] = 0;
      else if (side_domain[0] < 0 && side_domain[1] < 0) side_domain[1] = 0;

      let X,
        Y,
        baseScale,
        sideScale,
        baseAxis,
        sideAxis,
        baseLenght,
        sideLenght;
      if (direction === "vertical") {
        X = that.getXBandScale(groups, width, margin, [0.2]);
        Y = that.getYLinearScale(side_domain, height, margin);
        [baseScale, sideScale, baseAxis, sideAxis, baseLenght, sideLenght] = [
          X,
          Y,
          "x",
          "y",
          "width",
          "height",
        ];
      } else {
        X = that.getXLinearScale(side_domain, width, margin);
        Y = that.getYBandScale(groups, height, margin, [0.2]);
        [baseScale, sideScale, baseAxis, sideAxis, baseLenght, sideLenght] = [
          Y,
          X,
          "y",
          "x",
          "height",
          "width",
        ];
      }

      if (!noAxes) that.plotAxes(GG, X, Y, base_value, side_value);

      GG
        .append("g")
        .selectAll("g")
        .data(result)
        .enter()
        .append("rect")
        .attr(baseAxis, function (d) {
          return baseScale(d[base_value]);
        })
        .attr(sideAxis, function (d) {
          return sideScale(d[side_value]) < sideScale(0)
            ? sideScale(d[side_value])
            : sideScale(0);
        })
        .attr(baseLenght, baseScale.bandwidth())
        .attr(sideLenght, function (d) {
          return Math.abs(sideScale(0) - sideScale(d[side_value]));
        })
        .data(allHues)
        .attr("fill", function (d) {
          return color(d);
        });

      const itrValues = Object.keys(values).map((key) => {
        const newRow = {};
        newRow[base_value] = key;
        newRow["min"] = values[key]["min"];
        newRow["max"] = values[key]["max"];
        return newRow;
      });

      GG
        .selectAll()
        .data(itrValues)
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("d", function (d) {
          const base = baseScale(d[base_value]) + baseScale.bandwidth() / 2;
          if (direction === "vertical") {
            return d3.line()([
              [base, sideScale(d["min"])],
              [base, sideScale(d["max"])],
            ]);
          }
          return d3.line()([
            [sideScale(d["min"]), base],
            [sideScale(d["max"]), base],
          ]);
        });
    }

    function createGroupBars(that) {
      let result = data.reduce((res, row) => {
        const x = row[base_value];
        const y = row[side_value];
        const hueRow = row[hue];

        if (x in res) {
          values[x]["qt"][side_value + "-" + hueRow] += 1;
          values[x][hueRow][side_value].push(y);
          for (const h of allHues) {
            if (hueRow == h) res[x][side_value + "-" + h] += y;
          }
        } else {
          const newValues = {};
          allHues.forEach((h) => {
            newValues[h] = {};
            newValues[h][side_value] = [];
          });

          const qt = {};
          for (const h of allHues) {
            qt[side_value + "-" + h] = 0;
          }
          qt[side_value + "-" + hueRow] = 1;

          newValues["qt"] = qt;
          newValues[hueRow][side_value].push(y);
          values[x] = newValues;
          const newRow = {};
          for (const h of allHues) {
            if (hueRow == h) newRow[side_value + "-" + h] = y;
            else newRow[side_value + "-" + h] = 0;
          }
          res[x] = newRow;
        }

        return res;
      }, {});

      result = Object.keys(result).map((key) => {
        let newRow = {};
        newRow[base_value] = key;
        for (const i of Object.keys(result[key])) {
          if (values[key]["qt"][i] != 0) {
            result[key][i] = result[key][i] / values[key]["qt"][i];
          }
        }
        newRow = { ...newRow, ...result[key] };
        return newRow;
      });

      Object.keys(values).forEach((key) => {
        allHues.forEach((h) => {
          const array = values[key][h][side_value];
          const [min, max] = getCI(array);
          values[key][h]["min"] = min;
          values[key][h]["max"] = max;
        });
      });

      const subgroups = allHues.map((value) => side_value + "-" + value);
      const groups = result.map((r) => r[base_value]).sort();

      const all_min_max = [];
      Object.keys(values).map((key) => {
        allHues.forEach((h) => all_min_max.push(values[key][h]));
      });

      const side_domain = [];
      side_domain.push(d3.min(all_min_max, (v) => v.min));
      side_domain.push(d3.max(all_min_max, (v) => v.max));
      if (side_domain[0] > 0 && side_domain[1] > 0) side_domain[0] = 0;
      else if (side_domain[0] < 0 && side_domain[1] < 0) side_domain[1] = 0;

      let X,
        Y,
        baseScale,
        sideScale,
        baseAxis,
        sideAxis,
        baseLenght,
        sideLenght;
      if (direction === "vertical") {
        X = that.getXBandScale(groups, width, margin, [0.2]);
        Y = that.getYLinearScale(side_domain, height, margin);
        [baseScale, sideScale, baseAxis, sideAxis, baseLenght, sideLenght] = [
          X,
          Y,
          "x",
          "y",
          "width",
          "height",
        ];
      } else {
        X = that.getXLinearScale(side_domain, width, margin);
        Y = that.getYBandScale(groups, height, margin, [0.2]);
        [baseScale, sideScale, baseAxis, sideAxis, baseLenght, sideLenght] = [
          Y,
          X,
          "y",
          "x",
          "height",
          "width",
        ];
      }

      if (!noAxes) that.plotAxes(GG, X, Y, base_value, side_value);

      const xSubgroup = d3
        .scaleBand()
        .domain(subgroups)
        .range([0, baseScale.bandwidth()])
        .padding([0.05]);

      GG
        .append("g")
        .selectAll("g")
        .data(result)
        .enter()
        .append("g")
        .attr("transform", function (d) {
          if (direction === "vertical") {
            return "translate(" + baseScale(d[base_value]) + ",0)";
          }
          return "translate(0," + baseScale(d[base_value]) + ")";
        })
        .selectAll("rect")
        .data(function (d) {
          return subgroups.map(function (key) {
            return { key: key, value: d[key] };
          });
        })
        .enter()
        .append("rect")
        .attr(baseAxis, function (d) {
          return xSubgroup(d.key);
        })
        .attr(sideAxis, function (d) {
          return sideScale(d.value) < sideScale(0)
            ? sideScale(d.value)
            : sideScale(0);
        })
        .attr(baseLenght, xSubgroup.bandwidth())
        .attr(sideLenght, function (d) {
          return Math.abs(sideScale(0) - sideScale(d.value));
        })
        .data(allHues)
        .attr("fill", function (d) {
          return color(d);
        });

      const itrValues = Object.keys(values).map((key) => {
        let newRow = {};
        newRow[base_value] = key;
        newRow = { ...newRow, ...values[key] };
        return newRow;
      });

      GG
        .append("g")
        .selectAll("g")
        .data(itrValues)
        .enter()
        .append("g")
        .attr("transform", function (d) {
          if (direction === "vertical") {
            return "translate(" + baseScale(d[base_value]) + ",0)";
          }
          return "translate(0," + baseScale(d[base_value]) + ")";
        })
        .selectAll("rect")
        .data(function (d) {
          return allHues.map(function (key) {
            return { key: side_value + "-" + key, value: d[key] };
          });
        })
        .enter()
        .append("path")
        .attr("fill", "none")
        .attr("stroke", "black")
        .attr("stroke-width", 2)
        .attr("d", function (d) {
          const base = xSubgroup(d.key) + xSubgroup.bandwidth() / 2;
          if (direction === "vertical") {
            return d3.line()([
              [base, sideScale(d.value["min"])],
              [base, sideScale(d.value["max"])],
            ]);
          }
          return d3.line()([
            [sideScale(d.value["min"]), base],
            [sideScale(d.value["max"]), base],
          ]);
        });

      const legend = GG
        .selectAll(".legend")
        .data(color.domain())
        .enter()
        .append("g")
        .attr("class", "legend")
        .attr("transform", function (d, i) {
          return "translate(0," + i * 20 + ")";
        });

      legend
        .append("rect")
        .attr("x", width - margin.left - margin.right - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

      legend
        .append("text")
        .attr("x", width - margin.left - margin.right - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) {
          return d;
        });
    }
  }

  replot(data, x_axis, y_axis, hue_axis, direction, width, height, margin) {
    this.clear();
    this.plot(data, x_axis, y_axis, hue_axis, direction, width, height, margin);
  }
}
