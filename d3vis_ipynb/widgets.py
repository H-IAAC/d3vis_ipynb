import ipywidgets as widgets
import pandas as pd
from traitlets import Float, List, Unicode

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

    linearData_x = List([]).tag(sync=True)
    linearData_y = List([]).tag(sync=True)
    histogramData = List([]).tag(sync=True)
    elementId = Unicode().tag(sync=True)
    clickedValue = Unicode().tag(sync=True)

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

    dataRecords = List([]).tag(sync=True)
    x = Unicode().tag(sync=True)
    y = Unicode().tag(sync=True)
    hue = Unicode().tag(sync=True)
    elementId = Unicode().tag(sync=True)
    clickedValue = Unicode().tag(sync=True)
    selectedValuesRecords = List([]).tag(sync=True)

    def __init__(self, data, **kwargs):
        self.data = data
        self.selectedValues = pd.DataFrame()
        super().__init__(**kwargs)

    @property
    def data(self):
        return pd.DataFrame.from_records(self.dataRecords)

    @data.setter
    def data(self, val):
        self.dataRecords = val.to_dict(orient="records")

    @property
    def selectedValues(self):
        return pd.DataFrame.from_records(self.selectedValuesRecords)

    @selectedValues.setter
    def selectedValues(self, val):
        self.selectedValuesRecords = val.to_dict(orient="records")

    def on_select_values(self, callback):
        self.observe(callback, names=["selectedValuesRecords"])

    def on_click_value(self, callback):
        self.observe(callback, names=["clickedValue"])

@widgets.register
class LinearPlot(widgets.DOMWidget):
    _view_name = Unicode("LinearPlotView").tag(sync=True)
    _model_name = Unicode("LinearPlotModel").tag(sync=True)
    _view_module = Unicode("d3vis_ipynb").tag(sync=True)
    _model_module = Unicode("d3vis_ipynb").tag(sync=True)
    _view_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)
    _model_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    x = Unicode().tag(sync=True)
    y = Unicode().tag(sync=True)
    hue = Unicode().tag(sync=True)
    elementId = Unicode().tag(sync=True)
    clickedValue = Unicode().tag(sync=True)
    selectedValuesRecords = List([]).tag(sync=True)

    def __init__(self, data, **kwargs):
        self.data = data
        self.selectedValues = pd.DataFrame()
        super().__init__(**kwargs)

    @property
    def data(self):
        return pd.DataFrame.from_records(self.dataRecords)

    @data.setter
    def data(self, val):
        self.dataRecords = val.to_dict(orient="records")

    @property
    def selectedValues(self):
        return pd.DataFrame.from_records(self.selectedValuesRecords)

    @selectedValues.setter
    def selectedValues(self, val):
        self.selectedValuesRecords = val.to_dict(orient="records")

    def on_select_values(self, callback):
        self.observe(callback, names=["selectedValuesRecords"])

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

    dataRecords = List([]).tag(sync=True)
    x = Unicode().tag(sync=True)
    y = Unicode().tag(sync=True)
    hue = Unicode().tag(sync=True)
    elementId = Unicode().tag(sync=True)

    def __init__(self, data, **kwargs):
        self.data = data
        super().__init__(**kwargs)

    @property
    def data(self):
        return pd.DataFrame.from_records(self.dataRecords)

    @data.setter
    def data(self, val):
        self.dataRecords = val.to_dict(orient="records")


@widgets.register
class HistogramPlot(widgets.DOMWidget):
    _view_name = Unicode("HistogramPlotView").tag(sync=True)
    _model_name = Unicode("HistogramPlotModel").tag(sync=True)
    _view_module = Unicode("d3vis_ipynb").tag(sync=True)
    _model_module = Unicode("d3vis_ipynb").tag(sync=True)
    _view_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)
    _model_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    x = Unicode().tag(sync=True)
    start = Float().tag(sync=True)
    end = Float().tag(sync=True)
    elementId = Unicode().tag(sync=True)

    def __init__(self, data, **kwargs):
        self.data = data
        super().__init__(**kwargs)

    @property
    def data(self):
        return pd.DataFrame.from_records(self.dataRecords)

    @data.setter
    def data(self, val):
        self.dataRecords = val.to_dict(orient="records")


@widgets.register
class RangeSlider(widgets.DOMWidget):
    _view_name = Unicode("RangeSliderView").tag(sync=True)
    _model_name = Unicode("RangeSliderModel").tag(sync=True)
    _view_module = Unicode("d3vis_ipynb").tag(sync=True)
    _model_module = Unicode("d3vis_ipynb").tag(sync=True)
    _view_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)
    _model_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    variable = Unicode().tag(sync=True)
    step = Float().tag(sync=True)
    description = Unicode().tag(sync=True)
    minValue = Float().tag(sync=True)
    maxValue = Float().tag(sync=True)
    elementId = Unicode().tag(sync=True)

    def __init__(self, data, **kwargs):
        self.data = data
        super().__init__(**kwargs)

    @property
    def data(self):
        return pd.DataFrame.from_records(self.dataRecords)

    @data.setter
    def data(self, val):
        self.dataRecords = val.to_dict(orient="records")

    def on_drag(self, callback):
        self.observe(callback, names=["minValue", "maxValue"])
