import anywidget
import urllib3


class CustomWidget(anywidget.AnyWidget):
    def readFromWeb(url):
        http = urllib3.PoolManager(cert_reqs="CERT_NONE")
        response = http.request("GET", url)
        text = response.data.decode("utf-8")
        return text

    def readFromLocalFile(path):
        text = ""
        with open(path, "r") as file:
            lines = file.readlines()
            text = text.join(lines)
        return text

    def createWidgetFromLocalFile(
        widgetCall: str, varList: list, updatableVars: list, filePath: str
    ):
        return CustomWidget._createWidget(
            widgetCall, varList, updatableVars, filePath, CustomWidget.readFromLocalFile
        )

    def createWidgetFromUrl(
        widgetCall: str, varList: list, updatableVars: list, jsUrl: str
    ):
        return CustomWidget._createWidget(
            widgetCall, varList, updatableVars, jsUrl, CustomWidget.readFromWeb
        )

    def _createWidget(
        widgetCall: str, varList: list, updatableVars: list, string: str, fileReader
    ):
        modelVars = ""
        modelChanges = ""
        for var in varList:
            newModelVar = "let " + var + ' = model.get("' + var + '");\n'
            modelVars += newModelVar

        for var in updatableVars:
            newModelChange = 'model.on("change:' + var + '", plotAfterInterval);\n'
            modelChanges += newModelChange

        fileStr = fileReader(string)
        jsStr = """
        import * as d3 from "https://esm.sh/d3@7";

        function render({{ model, el }} ) {{
            {fileStr}
            
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
            fileStr=fileStr,
            modelVars=modelVars,
            widgetCall=widgetCall,
            modelChanges=modelChanges,
        )

        return jsStr
