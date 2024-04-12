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

    def linkData(self, widget, widgetAttr):
        self._observing.append({"data": {widget.name(): widgetAttr}})

        def callback(change):
            self.data = getattr(widget, widgetAttr)

        widget.observe(callback, names=[widgetAttr])


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
