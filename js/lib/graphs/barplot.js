import * as d3 from "d3";

export function barplot(data, x_axis, y_axis, hue_axis, element, that) {
  var customHeight = 375;
  var customWidth = 720;
  if (element) {
    element = document.getElementById(element)
    customWidth = element.clientWidth;
    customHeight = element.clientHeight;
  } else {
    element = that.el;
  }
  d3.select(element).selectAll("*").remove();

  const margin = { top: 20, right: 20, bottom: 30, left: 40 };
  const width = customWidth - margin.left - margin.right;
  const height = customHeight - margin.top - margin.bottom;

  var svg = d3
    .select(element)
    .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

  if (!hue_axis) hue_axis = x_axis;

  const allHues = data.reduce((all, row) => {
    if (all && all.indexOf(row[hue_axis]) === -1) {
      all.push(row[hue_axis]);
    }
    return all;
  }, []);
  let values = {};

  var color = d3.scaleOrdinal(d3.schemeCategory10);

  if (hue_axis == x_axis) {
    createSingleBars();
  } else {
    createGroupBars();
  }

  function createSingleBars() {
    let result = data.reduce((res, row) => {
      let x = row[x_axis];
      let y = row[y_axis];

      if (x in res) {
        res[x] += y;
        values[x]["qt"] += 1;
        values[x][y_axis].push(y);
      } else {
        var newValues = {};
        newValues["qt"] = 1;
        newValues[y_axis] = [];
        newValues[y_axis].push(y);
        values[x] = newValues;
        res[x] = y;
      }

      return res;
    }, {});

    result = Object.keys(result).map((key) => {
      let newRow = {};
      newRow[x_axis] = key;
      newRow[y_axis] = result[key];
      if (values[key]["qt"] != 0) {
        newRow[y_axis] = newRow[y_axis] / values[key]["qt"];
      }
      return newRow;
    });

    Object.keys(values).forEach((key) => {
      let array = values[key][y_axis];
      let [min, max] = getCI(array);
      values[key]["min"] = min;
      values[key]["max"] = max;
    });

    var groups = result.map((r) => r[x_axis]);

    let y_domain = [];
    let all_min_max = Object.keys(values).map((key) => values[key]);
    y_domain.push(d3.min(all_min_max, (v) => v.min));
    y_domain.push(d3.max(all_min_max, (v) => v.max));
    if (y_domain[0] > 0 && y_domain[1] > 0) y_domain[0] = 0;
    else if (y_domain[0] < 0 && y_domain[1] < 0) y_domain[1] = 0;

    var y = d3.scaleLinear().domain(y_domain).range([height, 0]);

    svg.append("g").call(d3.axisLeft(y));

    var x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);

    svg
      .append("g")
      .selectAll("g")
      .data(result)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return x(d[x_axis]);
      })
      .attr("y", function (d) {
        return y(d[y_axis]) < y(0) ? y(d[y_axis]) : y(0);
      })
      .attr("width", x.bandwidth())
      .attr("height", function (d) {
        return Math.abs(y(0) - y(d[y_axis]));
      })
      .data(allHues)
      .attr("fill", function (d) {
        return color(d);
      });

    const itrValues = Object.keys(values).map((key) => {
      let newRow = {};
      newRow[x_axis] = key;
      newRow["min"] = values[key]["min"];
      newRow["max"] = values[key]["max"];
      return newRow;
    });

    svg
      .append("g")
      .selectAll("g")
      .data(itrValues)
      .enter()
      .append("rect")
      .attr("x", function (d) {
        return x(d[x_axis]) + x.bandwidth() / 2 - 1;
      })
      .attr("y", function (d) {
        return y(d["max"]);
      })
      .attr("width", 2)
      .attr("height", function (d) {
        return y(d["min"]) - y(d["max"]);
      });

    svg
      .append("g")
      .style("font", "18px times")
      .attr("transform", "translate(0," + y(0) + ")")
      .call(d3.axisBottom(x).tickSize(0));
  }

  function createGroupBars() {
    let result = data.reduce((res, row) => {
      let x = row[x_axis];
      let y = row[y_axis];
      let hue = row[hue_axis];

      if (x in res) {
        values[x]["qt"][y_axis + "-" + hue] += 1;
        values[x][hue][y_axis].push(y);
        for (let h of allHues) {
          if (hue == h) res[x][y_axis + "-" + h] += y;
        }
      } else {
        var newValues = {};
        allHues.forEach((hue) => {
          newValues[hue] = {};
          newValues[hue][y_axis] = [];
        });

        var qt = {};
        for (let h of allHues) {
          qt[y_axis + "-" + h] = 0;
        }
        qt[y_axis + "-" + hue] = 1;

        newValues["qt"] = qt;
        newValues[hue][y_axis].push(y);
        values[x] = newValues;
        let newRow = {};
        for (var h of allHues) {
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
      for (let i of Object.keys(result[key])) {
        if (values[key]["qt"][i] != 0) {
          result[key][i] = result[key][i] / values[key]["qt"][i];
        }
      }
      newRow = { ...newRow, ...result[key] };
      return newRow;
    });

    Object.keys(values).forEach((key) => {
      allHues.forEach((h) => {
        let array = values[key][h][y_axis];
        let [min, max] = getCI(array);
        values[key][h]["min"] = min;
        values[key][h]["max"] = max;
      });
    });

    var subgroups = allHues.map((value) => y_axis + "-" + value);
    var groups = result.map((r) => r[x_axis]);

    let all_min_max = [];
    Object.keys(values).map((key) => {
      allHues.forEach((h) => all_min_max.push(values[key][h]));
    });

    let y_domain = [];
    y_domain.push(d3.min(all_min_max, (v) => v.min));
    y_domain.push(d3.max(all_min_max, (v) => v.max));
    if (y_domain[0] > 0 && y_domain[1] > 0) y_domain[0] = 0;
    else if (y_domain[0] < 0 && y_domain[1] < 0) y_domain[1] = 0;

    var y = d3.scaleLinear().domain(y_domain).range([height, 0]);

    svg.append("g").call(d3.axisLeft(y));

    var x = d3.scaleBand().domain(groups).range([0, width]).padding([0.2]);

    var xSubgroup = d3
      .scaleBand()
      .domain(subgroups)
      .range([0, x.bandwidth()])
      .padding([0.05]);

    svg
      .append("g")
      .selectAll("g")
      .data(result)
      .enter()
      .append("g")
      .attr("transform", function (d) {
        return "translate(" + x(d[x_axis]) + ",0)";
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
        return y(d.value) < y(0) ? y(d.value) : y(0);
      })
      .attr("width", xSubgroup.bandwidth())
      .attr("height", function (d) {
        return Math.abs(y(0) - y(d.value));
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

    svg
      .append("g")
      .selectAll("g")
      .data(itrValues)
      .enter()
      .append("g")
      .attr("transform", function (d) {
        return "translate(" + x(d[x_axis]) + ",0)";
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
        return y(d.value["max"]);
      })
      .attr("width", 2)
      .attr("height", function (d) {
        if (!d.value.min || !d.value.max) return 0;
        return y(d.value["min"]) - y(d.value["max"]);
      });

    var legend = svg
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
      .attr("x", width - 18)
      .attr("width", 18)
      .attr("height", 18)
      .style("fill", color);

    legend
      .append("text")
      .attr("x", width - 24)
      .attr("y", 9)
      .attr("dy", ".35em")
      .style("text-anchor", "end")
      .text(function (d) {
        return d;
      });

    svg
      .append("g")
      .style("font", "18px times")
      .attr("transform", "translate(0," + y(0) + ")")
      .call(d3.axisBottom(x).tickSize(0));
  }
}

function standardDeviationPerSquareRootedSize(array, mean) {
  let sd = 0;
  array.forEach((num) => (sd = sd + (num - mean) ** 2));
  sd = Math.sqrt(sd) / array.length;
  return sd;
}

function getCI(array) {
  const mean = array.reduce((a, b) => a + b, 0) / array.length;
  let complement = 1.96 * standardDeviationPerSquareRootedSize(array, mean);
  return [mean - complement, mean + complement];
}
