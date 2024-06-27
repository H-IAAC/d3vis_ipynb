import * as d3 from "d3";
import { lasso } from "../tools/lasso";
import { BasePlot } from "./baseplot";

export class ScatterPlot extends BasePlot {
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
    noAxes
  ) {
    for (let i = 0; i < data.length; i++) {
      data[i]["id"] = i;
    }

    const randomString = Math.floor(
      Math.random() * Date.now() * 10000
    ).toString(36);

    const SVG = this.getSvg(width, height, margin);
    const xDomain = d3.extent(data, function (d) {
      return d[x_value];
    });
    const X = this.getXLinearScale(xDomain, width, margin);
    const yDomain = d3.extent(data, function (d) {
      return d[y_value];
    });
    const Y = this.getYLinearScale(yDomain, height, margin);

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

    if (!noAxes) this.plotAxes(SVG, X, Y, x_value, y_value);

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
      X,
      Y,
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

  replot(
    data,
    x_value,
    y_value,
    hue,
    setValue,
    setSelectedValues,
    width,
    height,
    margin,
    noAxes
  ) {
    this.clear();
    this.plot(
      data,
      x_value,
      y_value,
      hue,
      setValue,
      setSelectedValues,
      width,
      height,
      margin,
      noAxes
    );
  }
}
