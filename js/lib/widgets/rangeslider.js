import * as d3 from "d3";

export function rangeslider(
  data,
  variable,
  step,
  description,
  fromValue,
  toValue,
  setValues,
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

  function updateValues(min, max) {
    rangeValue.textContent = min + " - " + max;
    setValues(min, max);
  }

  const minValue = d3.min(data, (d) => d[variable]);
  const maxValue = d3.max(data, (d) => d[variable]);

  fromSlider.setAttribute("min", minValue);
  fromSlider.setAttribute("max", maxValue);
  toSlider.setAttribute("min", minValue);
  toSlider.setAttribute("max", maxValue);
  if (fromValue && toValue) {
    fromSlider.value = fromValue;
    toSlider.value = toValue;
  } else {
    fromSlider.value = minValue;
    toSlider.value = maxValue;
  }

  const min = parseFloat(fromSlider.value);
  const max = parseFloat(toSlider.value);
  updateValues(min, max);

  fromSlider.addEventListener("input", () => {
    const min = parseFloat(fromSlider.value);
    const max = parseFloat(toSlider.value);
    if (min > max) {
      fromSlider.value = toSlider.value;
    }
    updateValues(min, max);
  });

  toSlider.addEventListener("input", () => {
    const min = parseFloat(fromSlider.value);
    const max = parseFloat(toSlider.value);
    if (max < min) {
      toSlider.value = fromSlider.value;
    }
    updateValues(min, max);
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
