import ipywidgets as widgets
import pandas as pd
from traitlets import Float, List, Unicode

from d3vis_ipynb.base_widget import BaseWidget


@widgets.register
class BarPlot(BaseWidget):
    _view_name = Unicode("BarPlotView").tag(sync=True)
    _model_name = Unicode("BarPlotModel").tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    x = Unicode().tag(sync=True)
    y = Unicode().tag(sync=True)
    hue = Unicode().tag(sync=True)

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
class HistogramPlot(BaseWidget):
    _view_name = Unicode("HistogramPlotView").tag(sync=True)
    _model_name = Unicode("HistogramPlotModel").tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    x = Unicode().tag(sync=True)

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
class LinearPlot(BaseWidget):
    _view_name = Unicode("LinearPlotView").tag(sync=True)
    _model_name = Unicode("LinearPlotModel").tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    x = Unicode().tag(sync=True)
    y = Unicode().tag(sync=True)
    hue = Unicode().tag(sync=True)
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
class RidgelinePlot(BaseWidget):
    _view_name = Unicode("RidgelinePlotView").tag(sync=True)
    _model_name = Unicode("RidgelinePlotModel").tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    xAxes = List([]).tag(sync=True)

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
class ScatterPlot(BaseWidget):
    _view_name = Unicode("ScatterPlotView").tag(sync=True)
    _model_name = Unicode("ScatterPlotModel").tag(sync=True)

    dataRecords = List([]).tag(sync=True)
    x = Unicode().tag(sync=True)
    y = Unicode().tag(sync=True)
    hue = Unicode().tag(sync=True)
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
