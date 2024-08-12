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
  plot(
    data,
    x_axis,
    y_axis,
    hue_axis,
    width,
    height,
    margin,
    noAxes
  ) {
    this.svg = this.getSvg(width, height, margin);

    if (!hue_axis) hue_axis = x_axis;

    const allHues = data.reduce((all, row) => {
      if (all && all.indexOf(row[hue_axis]) === -1) {
        all.push(row[hue_axis]);
      }
      return all;
    }, []);
    const values = {};

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    if (hue_axis == x_axis) {
      createSingleBars(this);
    } else {
      createGroupBars(this);
    }

    function createSingleBars(that) {
      let result = data.reduce((res, row) => {
        const x = row[x_axis];
        const y = row[y_axis];

        if (x in res) {
          res[x] += y;
          values[x]["qt"] += 1;
          values[x][y_axis].push(y);
        } else {
          const newValues = {};
          newValues["qt"] = 1;
          newValues[y_axis] = [];
          newValues[y_axis].push(y);
          values[x] = newValues;
          res[x] = y;
        }

        return res;
      }, {});

      result = Object.keys(result).map((key) => {
        const newRow = {};
        newRow[x_axis] = key;
        newRow[y_axis] = result[key];
        if (values[key]["qt"] != 0) {
          newRow[y_axis] = newRow[y_axis] / values[key]["qt"];
        }
        return newRow;
      });

      Object.keys(values).forEach((key) => {
        const array = values[key][y_axis];
        const [min, max] = getCI(array);
        values[key]["min"] = min;
        values[key]["max"] = max;
      });

      const groups = result.map((r) => r[x_axis]).sort();

      const y_domain = [];
      const all_min_max = Object.keys(values).map((key) => values[key]);
      y_domain.push(d3.min(all_min_max, (v) => v.min));
      y_domain.push(d3.max(all_min_max, (v) => v.max));
      if (y_domain[0] > 0 && y_domain[1] > 0) y_domain[0] = 0;
      else if (y_domain[0] < 0 && y_domain[1] < 0) y_domain[1] = 0;

      const Y = that.getYLinearScale(y_domain, height, margin);
      const X = that.getXBandScale(groups, width, margin, [0.2]);

      if (!noAxes) that.plotAxes(that.svg, X, Y, x_axis, y_axis);

      that.svg
        .append("g")
        .selectAll("g")
        .data(result)
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return X(d[x_axis]);
        })
        .attr("y", function (d) {
          return Y(d[y_axis]) < Y(0) ? Y(d[y_axis]) : Y(0);
        })
        .attr("width", X.bandwidth())
        .attr("height", function (d) {
          return Math.abs(Y(0) - Y(d[y_axis]));
        })
        .data(allHues)
        .attr("fill", function (d) {
          return color(d);
        });

      const itrValues = Object.keys(values).map((key) => {
        const newRow = {};
        newRow[x_axis] = key;
        newRow["min"] = values[key]["min"];
        newRow["max"] = values[key]["max"];
        return newRow;
      });

      that.svg
        .append("g")
        .selectAll("g")
        .data(itrValues)
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return X(d[x_axis]) + X.bandwidth() / 2 - 1;
        })
        .attr("y", function (d) {
          return Y(d["max"]);
        })
        .attr("width", 2)
        .attr("height", function (d) {
          return Y(d["min"]) - Y(d["max"]);
        });
    }

    function createGroupBars(that) {
      let result = data.reduce((res, row) => {
        const x = row[x_axis];
        const y = row[y_axis];
        const hue = row[hue_axis];

        if (x in res) {
          values[x]["qt"][y_axis + "-" + hue] += 1;
          values[x][hue][y_axis].push(y);
          for (const h of allHues) {
            if (hue == h) res[x][y_axis + "-" + h] += y;
          }
        } else {
          const newValues = {};
          allHues.forEach((hue) => {
            newValues[hue] = {};
            newValues[hue][y_axis] = [];
          });

          const qt = {};
          for (const h of allHues) {
            qt[y_axis + "-" + h] = 0;
          }
          qt[y_axis + "-" + hue] = 1;

          newValues["qt"] = qt;
          newValues[hue][y_axis].push(y);
          values[x] = newValues;
          const newRow = {};
          for (const h of allHues) {
            if (hue == h) newRow[y_axis + "-" + h] = y;
            else newRow[y_axis + "-" + h] = 0;
          }
          res[x] = newRow;
        }

        return res;
      }, {});

      result = Object.keys(result).map((key) => {
        let newRow = {};
        newRow[x_axis] = key;
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
          const array = values[key][h][y_axis];
          const [min, max] = getCI(array);
          values[key][h]["min"] = min;
          values[key][h]["max"] = max;
        });
      });

      const subgroups = allHues.map((value) => y_axis + "-" + value);
      const groups = result.map((r) => r[x_axis]).sort();

      const all_min_max = [];
      Object.keys(values).map((key) => {
        allHues.forEach((h) => all_min_max.push(values[key][h]));
      });

      const y_domain = [];
      y_domain.push(d3.min(all_min_max, (v) => v.min));
      y_domain.push(d3.max(all_min_max, (v) => v.max));
      if (y_domain[0] > 0 && y_domain[1] > 0) y_domain[0] = 0;
      else if (y_domain[0] < 0 && y_domain[1] < 0) y_domain[1] = 0;

      const X = that.getXBandScale(groups, width, margin, [0.2]);
      const Y = that.getYLinearScale(y_domain, height, margin);

      if (!noAxes) that.plotAxes(that.svg, X, Y, x_axis, y_axis);

      const xSubgroup = d3
        .scaleBand()
        .domain(subgroups)
        .range([0, X.bandwidth()])
        .padding([0.05]);

      that.svg
        .append("g")
        .selectAll("g")
        .data(result)
        .enter()
        .append("g")
        .attr("transform", function (d) {
          return "translate(" + X(d[x_axis]) + ",0)";
        })
        .selectAll("rect")
        .data(function (d) {
          return subgroups.map(function (key) {
            return { key: key, value: d[key] };
          });
        })
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return xSubgroup(d.key);
        })
        .attr("y", function (d) {
          return Y(d.value) < Y(0) ? Y(d.value) : Y(0);
        })
        .attr("width", xSubgroup.bandwidth())
        .attr("height", function (d) {
          return Math.abs(Y(0) - Y(d.value));
        })
        .data(allHues)
        .attr("fill", function (d) {
          return color(d);
        });

      const itrValues = Object.keys(values).map((key) => {
        let newRow = {};
        newRow[x_axis] = key;
        newRow = { ...newRow, ...values[key] };
        return newRow;
      });

      that.svg
        .append("g")
        .selectAll("g")
        .data(itrValues)
        .enter()
        .append("g")
        .attr("transform", function (d) {
          return "translate(" + X(d[x_axis]) + ",0)";
        })
        .selectAll("rect")
        .data(function (d) {
          return allHues.map(function (key) {
            return { key: y_axis + "-" + key, value: d[key] };
          });
        })
        .enter()
        .append("rect")
        .attr("x", function (d) {
          return xSubgroup(d.key) + xSubgroup.bandwidth() / 2 - 1;
        })
        .attr("y", function (d) {
          if (!d.value.max) return 0;
          return Y(d.value["max"]);
        })
        .attr("width", 2)
        .attr("height", function (d) {
          if (!d.value.min || !d.value.max) return 0;
          return Y(d.value["min"]) - Y(d.value["max"]);
        });

      const legend = that.svg
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
        .attr("x", innerWidth - 18)
        .attr("width", 18)
        .attr("height", 18)
        .style("fill", color);

      legend
        .append("text")
        .attr("x", innerWidth - 24)
        .attr("y", 9)
        .attr("dy", ".35em")
        .style("text-anchor", "end")
        .text(function (d) {
          return d;
        });
    }
  }

  replot(data, x_axis, y_axis, hue_axis, width, height, margin) {
    this.clear();
    this.plot(data, x_axis, y_axis, hue_axis, width, height, margin);
  }
}
