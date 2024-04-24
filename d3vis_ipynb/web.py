import anywidget
import urllib3


class WebWidget(anywidget.AnyWidget):
    def readFromWeb(url):
        http = urllib3.PoolManager(cert_reqs="CERT_NONE")
        response = http.request("GET", url)
        text = response.data.decode("utf-8")
        return text

    def createWidgetFromUrl(
        widgetCall: str, varList: list, updatableVars: list, jsUrl: str
    ):
        modelVars = ""
        modelChanges = ""
        for var in varList:
            newModelVar = "let " + var + ' = model.get("' + var + '");\n'
            modelVars += newModelVar

        for var in updatableVars:
            newModelChange = 'model.on("change:' + var + '", plotAfterInterval);\n'
            modelChanges += newModelChange

        jsUrlStr = WebWidget.readFromWeb(jsUrl)
        jsStr = """
        import * as d3 from "https://esm.sh/d3@7";

        function render({{ model, el }} ) {{
            {jsUrlStr}
            
            let timeout;

            function plotAfterInterval() {{
                if (timeout) {{
                    clearTimeout(timeout);
                }}
                timeout = setTimeout(() => {{
                    plot(model, el);
                }}, 100);
            }}
        
            function plot() {{
                {modelVars}
                
                let height = 400;
                let element = el;
                if (elementId) {{
                element = document.getElementById(elementId);
                height = element.clientHeight;
                }}
                let width = element.clientWidth;
                const margin = {{ top: 20, right: 20, bottom: 30, left: 40 }};
                
                {widgetCall};
            }}

            plotAfterInterval();
            
            {modelChanges}
            window.addEventListener("resize", () => plotAfterInterval(this));
        }}
        
        

        export default {{ render }};
        """.format(
            jsUrlStr=jsUrlStr,
            modelVars=modelVars,
            widgetCall=widgetCall,
            modelChanges=modelChanges,
        )

        return jsStr

    def linkData(self, widget, widgetAttr):
        def callback(change):
            self.data = getattr(widget, widgetAttr)

        widget.observe(callback, names=[widgetAttr])
