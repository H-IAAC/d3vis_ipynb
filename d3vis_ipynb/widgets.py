import ipywidgets as widgets
from traitlets import Unicode, List, Float
from ._version import NPM_PACKAGE_RANGE

# See js/lib/example.js for the frontend counterpart to this file.


@widgets.register
class LinearHistPlot(widgets.DOMWidget):
    _view_name = Unicode("LinearHistPlotView").tag(sync=True)
    _model_name = Unicode("LinearHistPlotModel").tag(sync=True)
    _view_module = Unicode("d3vis_ipynb").tag(sync=True)
    _model_module = Unicode("d3vis_ipynb").tag(sync=True)
    _view_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)
    _model_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)

    _name = "linearhistplot"
    _observing = []

    linearData_x = List([]).tag(sync=True)
    linearData_y = List([]).tag(sync=True)
    histogramData = List([]).tag(sync=True)
    elementId = Unicode().tag(sync=True)
    clickedValue = Unicode().tag(sync=True)

    def name(self):
        return self._name

    def export_data(self):
        data = {
            "linearData_x": self.linearData_x,
            "linearData_y": self.linearData_y,
            "histogramData": self.histogramData,
            "elementId": self.elementId,
            "observing": self._observing,
        }

        return {self._name: data}

    def on_click_value(self, callback):
        self.observe(callback, names=["clickedValue"])


@widgets.register
class ScatterPlot(widgets.DOMWidget):
    _view_name = Unicode("ScatterPlotView").tag(sync=True)
    _model_name = Unicode("ScatterPlotModel").tag(sync=True)
    _view_module = Unicode("d3vis_ipynb").tag(sync=True)
    _model_module = Unicode("d3vis_ipynb").tag(sync=True)
    _view_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)
    _model_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)

    _name = "scatterplot"
    _observing = []

    data = List([]).tag(sync=True)
    x = Unicode().tag(sync=True)
    y = Unicode().tag(sync=True)
    hue = Unicode().tag(sync=True)
    elementId = Unicode().tag(sync=True)
    clickedValue = Unicode().tag(sync=True)
    selectedValues = List([]).tag(sync=True)

    def name(self):
        return self._name

    def export_data(self):
        data = {
            "data": self.data,
            "x": self.x,
            "y": self.y,
            "hue": self.hue,
            "elementId": self.elementId,
            "observing": self._observing,
        }

        return {self._name: data}

    def on_select_values(self, callback):
        self.observe(callback, names=["selectedValues"])

    def on_click_value(self, callback):
        self.observe(callback, names=["clickedValue"])


@widgets.register
class BarPlot(widgets.DOMWidget):
    _view_name = Unicode("BarPlotView").tag(sync=True)
    _model_name = Unicode("BarPlotModel").tag(sync=True)
    _view_module = Unicode("d3vis_ipynb").tag(sync=True)
    _model_module = Unicode("d3vis_ipynb").tag(sync=True)
    _view_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)
    _model_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)

    _name = "barplot"
    _observing = []

    data = List([]).tag(sync=True)
    x = Unicode().tag(sync=True)
    y = Unicode().tag(sync=True)
    hue = Unicode().tag(sync=True)
    elementId = Unicode().tag(sync=True)

    def name(self):
        return self._name

    def export_data(self):
        data = {
            "data": self.data,
            "x": self.x,
            "y": self.y,
            "hue": self.hue,
            "elementId": self.elementId,
            "observing": self._observing,
        }

        return {self._name: data}


@widgets.register
class HistogramPlot(widgets.DOMWidget):
    _view_name = Unicode("HistogramPlotView").tag(sync=True)
    _model_name = Unicode("HistogramPlotModel").tag(sync=True)
    _view_module = Unicode("d3vis_ipynb").tag(sync=True)
    _model_module = Unicode("d3vis_ipynb").tag(sync=True)
    _view_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)
    _model_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)

    _name = "histogramplot"
    _observing = []

    data = List([]).tag(sync=True)
    x = Unicode().tag(sync=True)
    start = Float().tag(sync=True)
    end = Float().tag(sync=True)
    elementId = Unicode().tag(sync=True)

    def name(self):
        return self._name

    def export_data(self):
        data = {
            "data": self.data,
            "x": self.x,
            "start": self.start,
            "end": self.end,
            "elementId": self.elementId,
            "observing": self._observing,
        }

        return {self._name: data}


@widgets.register
class RangeSlider(widgets.DOMWidget):
    _view_name = Unicode("RangeSliderView").tag(sync=True)
    _model_name = Unicode("RangeSliderModel").tag(sync=True)
    _view_module = Unicode("d3vis_ipynb").tag(sync=True)
    _model_module = Unicode("d3vis_ipynb").tag(sync=True)
    _view_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)
    _model_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)

    _name = "rangeslider"
    _observing = []

    data = List([]).tag(sync=True)
    variable = Unicode().tag(sync=True)
    step = Float().tag(sync=True)
    description = Unicode().tag(sync=True)
    minValue = Float().tag(sync=True)
    maxValue = Float().tag(sync=True)
    elementId = Unicode().tag(sync=True)

    def name(self):
        return self._name

    def export_data(self):
        data = {
            "data": self.data,
            "variable": self.variable,
            "step": self.step,
            "description": self.description,
            "elementId": self.elementId,
            "observing": self._observing,
        }

        return {self._name: data}

    def on_drag(self, callback):
        self.observe(callback, names=["minValue", "maxValue"])
