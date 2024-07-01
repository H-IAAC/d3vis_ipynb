import * as d3 from "d3";

export function rangeslider(
  data,
  variable,
  step,
  description,
  fromValue,
  toValue,
  minValue,
  maxValue,
  setValues,
  setMinMax,
  element,
  margin
) {
  const rangeOutsideContainer = document.createElement("div");
  rangeOutsideContainer.classList.add("range_outside_container");
  rangeOutsideContainer.style.margin =
    margin.top +
    "px " +
    margin.right +
    "px " +
    margin.bottom +
    "px " +
    margin.left +
    "px";

  const rangeDescription = document.createElement("span");
  rangeDescription.classList.add("range_description");
  rangeDescription.textContent = description;
  rangeOutsideContainer.appendChild(rangeDescription);

  const rangeInsideContainer = document.createElement("div");
  rangeInsideContainer.classList.add("range_inside_container");
  rangeOutsideContainer.appendChild(rangeInsideContainer);

  const rangeValue = document.createElement("span");
  rangeValue.classList.add("range_value");
  rangeOutsideContainer.appendChild(rangeValue);

  const slidersControl = document.createElement("div");
  slidersControl.classList.add("sliders_control");
  rangeInsideContainer.appendChild(slidersControl);

  const fromSlider = document.createElement("input");
  fromSlider.classList.add("top_slider");
  fromSlider.setAttribute("step", step);
  fromSlider.setAttribute("type", "range");
  slidersControl.appendChild(fromSlider);

  const toSlider = document.createElement("input");
  toSlider.setAttribute("step", step);
  toSlider.setAttribute("type", "range");
  slidersControl.appendChild(toSlider);

  function updateValues(from, to) {
    rangeValue.textContent = from + " - " + to;
    setValues(from, to);
  }

  if (!minValue && data.length > 0) {
    minValue = d3.min(data, (d) => d[variable]);
  }
  if (!maxValue && data.length > 0) {
    maxValue = d3.max(data, (d) => d[variable]);
  }

  fromSlider.setAttribute("min", minValue);
  fromSlider.setAttribute("max", maxValue);
  toSlider.setAttribute("min", minValue);
  toSlider.setAttribute("max", maxValue);
  if (fromValue) {
    fromSlider.value = fromValue;
  } else {
    fromSlider.value = minValue;
  }
  if (toValue) {
    toSlider.value = toValue;
  } else {
    toSlider.value = maxValue;
  }

  const from = parseFloat(fromSlider.value);
  const to = parseFloat(toSlider.value);
  const min = parseFloat(minValue);
  const max = parseFloat(maxValue);
  updateValues(from, to);
  setMinMax(min, max);

  fromSlider.addEventListener("input", () => {
    const from = parseFloat(fromSlider.value);
    const to = parseFloat(toSlider.value);
    if (from > to) {
      fromSlider.value = toSlider.value;
    }
    updateValues(from, to);
  });

  toSlider.addEventListener("input", () => {
    const from = parseFloat(fromSlider.value);
    const to = parseFloat(toSlider.value);
    if (to < from) {
      toSlider.value = fromSlider.value;
    }
    updateValues(from, to);
  });

  fromSlider.addEventListener("click", () => {
    fromSlider.classList.add("top_slider");
    toSlider.classList.remove("top_slider");
  });

  toSlider.addEventListener("click", () => {
    toSlider.classList.add("top_slider");
    fromSlider.classList.remove("top_slider");
  });

  element.innerHTML = "";
  element.appendChild(rangeOutsideContainer);
}
