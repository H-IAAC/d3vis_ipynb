import * as d3 from "d3";

export function lasso(
  element,
  xScale,
  yScale,
  x_value,
  y_value,
  x_translate,
  y_translate,
  resetColor,
  setLassoValues,
  randomString
) {
  // const PATH_COLOR = "black"
  // const PATH_BACKGROUND_COLOR = "#00000054"
  const PATH_COLOR = "blue";
  const PATH_BACKGROUND_COLOR = "#00008854";
  const SELECTED_DOTS_COLOR = "red";

  let coords = [];
  const lineGenerator = d3.line();

  const pointInPolygon = function (point, vs) {
    var x = point[0],
      y = point[1];

    var inside = false;
    for (var i = 0, j = vs.length - 1; i < vs.length; j = i++) {
      var xi = vs[i][0],
        yi = vs[i][1];
      var xj = vs[j][0],
        yj = vs[j][1];

      var intersect =
        yi > y != yj > y && x < ((xj - xi) * (y - yi)) / (yj - yi) + xi;
      if (intersect) inside = !inside;
    }

    return inside;
  };

  const circles = d3.select(element).selectAll(".dot");

  function drawPath() {
    d3.select("#lasso" + randomString)
      .style("stroke", PATH_COLOR)
      .style("stroke-width", 2)
      .style("fill", PATH_BACKGROUND_COLOR)
      .attr("d", lineGenerator(coords));
  }

  function dragStart() {
    coords = [];
    resetColor();
    d3.select(element).select("svg").append("path").attr("id", "lasso" + randomString);
  }

  function dragMove(event) {
    let mouseX = event.sourceEvent.offsetX;
    let mouseY = event.sourceEvent.offsetY;
    coords.push([mouseX, mouseY]);
    drawPath();
  }

  function dragEnd() {
    let selectedDots = [];
    circles.each((d, i) => {
      let point = [
        xScale(d[x_value]) + x_translate,
        yScale(d[y_value]) + y_translate,
      ];
      if (pointInPolygon(point, coords)) {
        d3.select("#dot-" + randomString + d.id)
          .style("fill", SELECTED_DOTS_COLOR)
          .attr("r", 6);
        selectedDots.push(d);
      }
    });
    d3.select("#lasso" + randomString).remove();
    setLassoValues(selectedDots);
  }

  const drag = d3
    .drag()
    .on("start", dragStart)
    .on("drag", dragMove)
    .on("end", dragEnd);

  d3.select(element).call(drag);
}
