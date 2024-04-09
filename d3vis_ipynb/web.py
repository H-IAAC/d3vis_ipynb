import anywidget
import urllib3


class WebWidget(anywidget.AnyWidget):
    def readFromWeb(url):
        http = urllib3.PoolManager(cert_reqs="CERT_NONE")
        response = http.request("GET", url)
        text = response.data.decode("utf-8")
        return text

    def createWidgetFromUrl(widgetCall: str, varList: list, jsUrl: str):
        modelVars = ""
        for var in varList:
            newLine = "let " + var + ' = model.get("' + var + '");\n'
            modelVars += newLine

        jsUrlStr = WebWidget.readFromWeb(jsUrl)
        jsStr = """
        import * as d3 from "https://esm.sh/d3@7";

        function render({{ model, el }} ) {{
            {jsUrlStr}

            function value_changed() {{
                {modelVars}

                setTimeout(() => {{
                    {widgetCall};
                }}, 50);
            }}

            value_changed();
            model.on("change:data", value_changed);
        }}

        export default {{ render }};
        """.format(
            jsUrlStr=jsUrlStr, modelVars=modelVars, widgetCall=widgetCall
        )

        return jsStr

    def linkData(self, widget, widgetAttr):
        def callback(change):
            self.data = getattr(widget, widgetAttr)

        widget.observe(callback, names=[widgetAttr])
