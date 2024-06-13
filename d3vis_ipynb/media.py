import mimetypes
import pathlib
from base64 import b64encode

import ipywidgets as widgets
from traitlets import Int, Unicode

from d3vis_ipynb.base_widget import BaseWidget


class _Media(BaseWidget):
    value = Unicode().tag(sync=True)
    format = Unicode().tag(sync=True)
    width = Int().tag(sync=True)
    height = Int().tag(sync=True)

    def __init__(self, file, type, **kwargs):
        self.value = self._load_file_value(file)
        self.format = self._guess_format(type, file)
        super().__init__(**kwargs)

    def _load_file_value(self, file):
        filename = ""
        read_file = None
        if getattr(file, "read", None) is not None:
            read_file = file.read()
            filename = file.name
        else:
            with open(file, "rb") as f:
                read_file = f.read()
                filename = file
        path = pathlib.Path(filename=filename)
        value = "data:" + path.name + ";base64," + b64encode(read_file).decode()
        return value

    def _guess_format(self, tag, file):
        name = getattr(file, "name", None)
        name = name or file

        try:
            mtype, _ = mimetypes.guess_type(name)
            if not mtype.startswith("{}/".format(tag)):
                return ""

            return mtype[len("{}/".format(tag)) :]
        except Exception:
            return ""


@widgets.register
class Video(_Media):
    _view_name = Unicode("VideoView").tag(sync=True)
    _model_name = Unicode("VideoModel").tag(sync=True)

    def __init__(self, file, **kwargs):
        super().__init__(file, "video", **kwargs)


@widgets.register
class Image(_Media):
    _view_name = Unicode("ImageView").tag(sync=True)
    _model_name = Unicode("ImageModel").tag(sync=True)

    def __init__(self, file, **kwargs):
        super().__init__(file, "image", **kwargs)
