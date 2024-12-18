import * as d3 from "d3";
import { BasePlot } from "./baseplot";
import { InformationCard } from "./tools/information_card";
import { getColorScale } from "./tools/heatmap_colors";

const GRAD_BAR_WIDTH = 150;

export class HeatmapPlot extends BasePlot {
  plot(
    data,
    x_value,
    y_value,
    rect_value,
    xValues,
    yValues,
    color_domain,
    color_scheme,
    width,
    height
  ) {
    const informationCard = new InformationCard(this.element);

    this.init(width, height);

    const SVG = this.svg;
    const GG = this.gGrid;

    let xDomain;
    if (xValues) {
      xDomain = xValues;
    } else {
      xDomain = data
        .reduce((res, row) => {
          if (!res.includes(row[x_value])) {
            res.push(row[x_value]);
          }
          return res;
        }, [])
        .sort();
    }

    const X = this.getXBandScale(xDomain, width - GRAD_BAR_WIDTH, [0]);
    let yDomain;
    if (yValues) {
      yDomain = yValues;
    } else {
      yDomain = data
        .reduce((res, row) => {
          if (!res.includes(row[y_value])) {
            res.push(row[y_value]);
          }
          return res;
        }, [])
        .sort();
    }
    yDomain = yDomain.reverse();

    const Y = this.getYBandScale(yDomain, height, [0]);

    function mouseover(event, d) {
      const text =
        "x: " +
        d[x_value] +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
        "y: " +
        d[y_value] +
        "&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;" +
        "value: " +
        d[rect_value];

      informationCard.showText(text, event.layerX, event.layerY);
    }

    function mouseout() {
      informationCard.hide();
    }

    if (!color_domain) {
      color_domain = d3.extent(data, function (d) {
        return parseFloat(d[rect_value]);
      });
    }

    var myColor = getColorScale(color_domain, color_scheme);

    let xAxis, yAxis;
    [xAxis, yAxis] = this.plotAxes(GG, X, Y, x_value, y_value);

    const rects = GG.selectAll()
      .data(data, function (d) {
        return d.group + ":" + d.variable;
      })
      .enter()
      .append("rect");

    rects
      .attr("x", function (d) {
        return X(d[x_value]);
      })
      .attr("y", function (d) {
        return Y(d[y_value]);
      })
      .attr("width", X.bandwidth())
      .attr("height", Y.bandwidth())
      .style("fill", function (d) {
        return myColor(d[rect_value]);
      })
      .on("mouseover", mouseover)
      .on("mouseout", mouseout);

    let grad = GG.append("defs")
      .append("linearGradient")
      .attr("id", "heatmap_grad")
      .attr("x1", "0%")
      .attr("x2", "0%")
      .attr("y1", "100%")
      .attr("y2", "0%");

    const grad_data = myColor.range().map((value, index, element) => {
      const size = element.length - 1;
      const position = (index / size) * 100 + "%";
      return [value, position];
    });

    grad
      .selectAll("stop")
      .data(grad_data)
      .enter()
      .append("stop")
      .style("stop-color", (d) => d[0])
      .attr("offset", (d) => d[1]);

    GG.append("rect")
      .attr("x", X.range()[1] + 50)
      .attr("y", Y.range()[1])
      .attr("width", 20)
      .attr("height", Y.range()[0])
      .style("fill", "url(#heatmap_grad)");

    GG.append("text")
      .attr("x", X.range()[1] + 80)
      .attr("y", Y.range()[1] + 5)
      .text(color_domain[1]);

    GG.append("text")
      .attr("x", X.range()[1] + 80)
      .attr("y", Y.range()[0] + 2)
      .text(color_domain[0]);
  }
}
