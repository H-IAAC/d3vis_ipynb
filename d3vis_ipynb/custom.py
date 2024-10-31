import anywidget
import urllib3
from traitlets import Unicode


class CustomWidget(anywidget.AnyWidget):
    elementId = Unicode().tag(sync=True)

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

    def createWidgetFromLocalFile(paramList: list, filePath: str):
        return CustomWidget._createWidget(
            paramList, filePath, CustomWidget.readFromLocalFile
        )

    def createWidgetFromUrl(paramList: list, jsUrl: str):
        return CustomWidget._createWidget(paramList, jsUrl, CustomWidget.readFromWeb)

    def _createWidget(paramList: list, string: str, fileReader):
        modelVars = ""
        modelChanges = ""
        paramsString = ", ".join(paramList)
        for var in paramList:
            newModelVar = "\t\t\t\t\tconst " + var + ' = model.get("' + var + '");\n'
            modelVars += newModelVar

        for var in paramList:
            newModelChange = '\t\t\t\t\tmodel.on("change:' + var + '", replot);\n'
            modelChanges += newModelChange

        fileStr = fileReader(string)
        jsStr = """
import * as d3 from "https://esm.sh/d3@7";

function render({{ model, el }} ) {{
    let element;
    let width;
    let height;

    function getElement() {{
        const elementId = model.get("elementId");

        let element = el;
        if (elementId) {{
            element = document.getElementById(elementId);
        }}
        
        return element;
    }}

    function setSizes() {{
        const elementId = model.get("elementId");

        height = 400;
        if (elementId) {{
            element = document.getElementById(elementId);
            if (element.clientHeight) height = element.clientHeight;
            else height = null;
        }}
        if (element.clientWidth) width = element.clientWidth;
        else width = null;
    }}

    function replot() {{
        element.innerHTML = "";

{modelVars}

        plot({paramsString})
    }}

    let elapsedTime = 0;

    let intr = setInterval(() => {{
        try {{
            elapsedTime += 100;
            if (elapsedTime > 20000) {{
                throw "Widget took too long to render";
            }}
            element = getElement();
            if (!element) return;
                setSizes();
                if (element && width && height) {{
{modelChanges}

{modelVars}
                    plot({paramsString});
                    clearInterval(intr);
                }}
        }} catch (err) {{
            console.log(err.stack);
            clearInterval(intr);
        }}
    }}, 100);

    {fileStr}
}}

export default {{ render }};
        """.format(
            fileStr=fileStr,
            modelVars=modelVars,
            paramsString=paramsString,
            modelChanges=modelChanges,
        )

        # with open("teste.js", "w") as f:
        #     f.write(jsStr)

        return jsStr
