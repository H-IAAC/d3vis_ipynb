// This file contains the javascript that is run when the notebook is loaded.
// It contains some requirejs configuration and the `load_ipython_extension`
// which is required for any notebook extension.

// Configure requirejs
if (window.require) {
    window.require.config({
        map: {
            "*" : {
                "d3vis_ipynb": "nbextensions/d3vis_ipynb/index",
            }
        }
    });
}

export function load_ipython_extension() { };
