import * as d3 from "d3";

export function barplot(
  data,
  x_axis,
  y_axis,
  hue_axis,
  element,
  width,
  height,
  margin
) {
  const innerWidth = width - margin.left - margin.right;
  const innerHeight = height - margin.top - margin.bottom;

  d3.select(element).selectAll("*").remove();

  const svg = d3
    .select(element)
    .append("svg")
    .attr("width", width)
    .attr("height", height)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

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
    createSingleBars();
  } else {
    createGroupBars();
  }

  function createSingleBars() {
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

    const groups = result.map((r) => r[x_axis]);

    const y_domain = [];
    const all_min_max = Object.keys(values).map((key) => values[key]);
    y_domain.push(d3.min(all_min_max, (v) => v.min));
    y_domain.push(d3.max(all_min_max, (v) => v.max));
    if (y_domain[0] > 0 && y_domain[1] > 0) y_domain[0] = 0;
    else if (y_domain[0] < 0 && y_domain[1] < 0) y_domain[1] = 0;

    const y = d3.scaleLinear().domain(y_domain).range([innerHeight, 0]);

    svg.append("g").call(d3.axisLeft(y));

    const x = d3
      .scaleBand()
      .domain(groups)
      .range([0, innerWidth])
      .padding([0.2]);

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
      const newRow = {};
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
    const groups = result.map((r) => r[x_axis]);

    const all_min_max = [];
    Object.keys(values).map((key) => {
      allHues.forEach((h) => all_min_max.push(values[key][h]));
    });

    const y_domain = [];
    y_domain.push(d3.min(all_min_max, (v) => v.min));
    y_domain.push(d3.max(all_min_max, (v) => v.max));
    if (y_domain[0] > 0 && y_domain[1] > 0) y_domain[0] = 0;
    else if (y_domain[0] < 0 && y_domain[1] < 0) y_domain[1] = 0;

    const y = d3.scaleLinear().domain(y_domain).range([innerHeight, 0]);

    svg.append("g").call(d3.axisLeft(y));

    const x = d3
      .scaleBand()
      .domain(groups)
      .range([0, innerWidth])
      .padding([0.2]);

    const xSubgroup = d3
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

    const legend = svg
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
  const complement = 1.96 * standardDeviationPerSquareRootedSize(array, mean);
  return [mean - complement, mean + complement];
}
