import * as d3 from "d3";
import { getDataMeans, groupArrayBy } from "../tools/group_data";
import { lasso } from "../tools/lasso";
import { Base } from "./base";

export class LinearPlot extends Base {
  xScale;
  yScale;

  createScales(data, x_value, y_value, width, height) {
    this.xScale = d3.scaleLinear().range([0, width]);
    this.yScale = d3.scaleLinear().range([height, 0]);
    this.xScale
      .domain(
        d3.extent(data, function (d) {
          return d[x_value];
        })
      )
      .nice();
    this.yScale
      .domain(
        d3.extent(data, function (d) {
          return d[y_value];
        })
      )
      .nice();
  }

  plot(
    data,
    x_value,
    y_value,
    hue,
    setValue,
    setSelectedValues,
    width,
    height,
    margin,
    hasAxes
  ) {
    data = getDataMeans(data, x_value, [y_value], hue);

    for (let i = 0; i < data.length; i++) {
      data[i]["id"] = i;
    }

    const randomString = Math.floor(
      Math.random() * Date.now() * 10000
    ).toString(36);

    d3.select(this.element).selectAll("*").remove();

    this.createSvg(width, height, margin);
    this.createScales(
      data,
      x_value,
      y_value,
      this.innerWidth,
      this.innerHeight
    );

    const SVG = this.svg;
    const X = this.xScale;
    const Y = this.yScale;

    if (hasAxes) this.plotAxes(SVG, this.innerWidth, this.innerHeight, X, Y);

    const color = d3.scaleOrdinal(d3.schemeCategory10);

    function mouseover(event, d) {
      focus.style("opacity", 1);
      focusText.style("opacity", 1);
      focus.attr("x", event.offsetX - 30).attr("y", event.offsetY - 40);
      focusText
        .html(
          "x: " +
            Math.round(d[x_value] * 10) / 10 +
            "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
            "y: " +
            Math.round(d[y_value] * 10) / 10
        )
        .attr("x", event.offsetX - 15)
        .attr("y", event.offsetY - 20);
    }

    function mouseout() {
      focus.style("opacity", 0);
      focusText.style("opacity", 0);
    }

    function mouseClick(event, d) {
      const text =
        "x:" +
        Math.round(d[x_value] * 10) / 10 +
        "    " +
        "y:" +
        Math.round(d[y_value] * 10) / 10;
      if (setValue !== undefined) {
        setValue(text);
      }
    }

    function addPath(datum, colorSelector) {
      SVG.append("path")
        .datum(datum)
        .attr("fill", "none")
        .attr("stroke", color(colorSelector))
        .attr("stroke-width", 2)
        .attr(
          "d",
          d3
            .line()
            .x((d) => X(d[x_value]))
            .y((d) => Y(d[y_value]))
        );
    }

    if (!hue) {
      addPath(data);
    } else {
      const groupedByHue = groupArrayBy(data, hue);
      Object.keys(groupedByHue).forEach(function (key, index) {
        addPath(groupedByHue[key], key);
      });
    }

    SVG.selectAll(".dot")
      .data(data)
      .enter()
      .append("circle")
      .attr("id", function (d, i) {
        return "dot-" + randomString + d.id;
      })
      .attr("class", "dot")
      .attr("r", 3.5)
      .attr("cx", function (d) {
        return X(d[x_value]);
      })
      .attr("cy", function (d) {
        return Y(d[y_value]);
      })
      .style("fill", function (d) {
        return color(d[hue]);
      })
      .on("mouseover", mouseover)
      .on("mouseout", mouseout)
      .on("click", mouseClick);

    function resetColor() {
      SVG.selectAll(".dot")
        .data(data)
        .attr("r", 3.5)
        .style("fill", function (d) {
          return color(d[hue]);
        });
    }

    function setLassoValues(values) {
      if (setSelectedValues !== undefined) {
        setSelectedValues(values);
      }
    }

    lasso(
      this,
      this.xScale,
      this.yScale,
      x_value,
      y_value,
      margin.left,
      margin.top,
      resetColor,
      setLassoValues,
      randomString
    );

    if (hue) {
      const legend = SVG.selectAll(".legend")
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

    const focus = SVG.append("g")
      .append("rect")
      .style("fill", "none")
      .attr("width", 160)
      .attr("height", 40)
      .attr("stroke", "#69b3a2")
      .attr("stroke-width", 4)
      .style("opacity", 0);

    const focusText = SVG.append("g")
      .append("text")
      .style("opacity", 0)
      .attr("text-anchor", "left")
      .attr("alignment-baseline", "middle");
  }
}
