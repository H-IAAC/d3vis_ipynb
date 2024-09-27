import * as d3 from "d3";

export function getColorScale(color_domain, color_scheme) {
  let range;
  let domain;
  switch (color_scheme) {
    case 1:
      range = ["#FF335B", "white", "#33AFFF"];
      domain = [
        color_domain[0],
        color_domain[0] * 0.5 + color_domain[1] * 0.5,
        color_domain[1],
      ];
      break;
    default:
      range = ["black", "blue", "red", "white"];
      domain = [
        color_domain[0],
        color_domain[0] * (2 / 3) + color_domain[1] * (1 / 3),
        color_domain[0] * (1 / 3) + color_domain[1] * (2 / 3),
        color_domain[1],
      ];
  }
  return d3.scaleLinear().range(range).domain(domain);
}
