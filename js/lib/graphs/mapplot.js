import * as d3 from "d3";
import { BasePlot } from "./baseplot";

export class MapPlot extends BasePlot {
  plot(data, onSelectionChange, width, height) {
    const updateSelection = (selection) => {
      if (this.timeout) {
        clearTimeout(this.timeout);
      }
      this.timeout = setTimeout(() => {
        onSelectionChange(selection);
      }, 1000);
    };

    function reset() {
      GG.transition()
        .duration(750)
        .call(
          zoom.transform,
          d3.zoomIdentity,
          d3.zoomTransform(GG.node()).invert([width / 2, height / 2])
        );
    }
    this.init(width, height);

    const GG = this.gGrid;

    const g = GG.append("g");
    const projection = d3
      .geoMercator()
      .scale(800)
      .center([-55, -15])
      .translate([width / 2, height / 2]);

    const path = d3.geoPath().projection(projection);

    // Define zoom behavior
    const zoom = d3.zoom().scaleExtent([1, 8]).on("zoom", zoomed);

    GG.call(zoom);

    function zoomed(event) {
      g.attr("transform", event.transform);
    }

    function addSchoolMarker(lat, lon, name) {
      g.append("circle")
        .attr("cx", projection([lon, lat])[0])
        .attr("cy", projection([lon, lat])[1])
        .attr("r", 1)
        .attr("fill", "red")
        .attr("stroke", "black")
        .attr("stroke-width", 0.1)
        .append("title")
        .text(name);
    }

    const geoData = require("../../data/brazil_geo.json");

    function clicked(event, d) {
      const [[x0, y0], [x1, y1]] = path.bounds(d);
      event.stopPropagation();

      GG.transition()
        .duration(750)
        .call(
          zoom.transform,
          d3.zoomIdentity
            .translate(width / 2, height / 2)
            .scale(
              Math.min(8, 0.9 / Math.max((x1 - x0) / width, (y1 - y0) / height))
            )
            .translate(-(x0 + x1) / 2, -(y0 + y1) / 2),
          d3.pointer(event, GG.node())
        );
      loadSchoolsForState(d.properties.name);
    }

    const states = g
      .selectAll("path")
      .data(geoData.features)
      .enter()
      .append("path")
      .attr("d", path)
      .attr("fill", "#cce5df") //cor do mapa
      .attr("stroke", "#333") //cor da borda
      .on("click", clicked);

    states.append("title").text((d) => d.properties.name);

    let schools = [];
    function loadSchoolsForState(stateName) {
      const schoolsInState = data.filter((d) => d.ESTADO === stateName);

      g.selectAll("circle").remove();
      schools = [];
      schoolsInState.forEach(function (school) {
        addSchoolMarker(
          parseFloat(school.LATITUDE),
          parseFloat(school.LONGITUDE),
          school.NO_ENTIDADE
        );
        schools.push(school);
      });
      updateSelection(schools);
    }
  }
}
