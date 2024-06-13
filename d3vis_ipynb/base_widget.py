import ipywidgets as widgets
from traitlets import Unicode
from ._version import NPM_PACKAGE_RANGE


class BaseWidget(widgets.DOMWidget):
    _view_module = Unicode("d3vis_ipynb").tag(sync=True)
    _model_module = Unicode("d3vis_ipynb").tag(sync=True)
    _view_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)
    _model_module_version = Unicode(NPM_PACKAGE_RANGE).tag(sync=True)

    elementId = Unicode().tag(sync=True)
