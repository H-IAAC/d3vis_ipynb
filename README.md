# d3vis_ipynb

A Custom Jupyter Widget Library with visualizations created with D3.js.

## Installation

To install use pip:

    $ pip install d3vis-ipynb

For a development installation (requires [Node.js](https://nodejs.org) and [Yarn version 1](https://classic.yarnpkg.com/)),

    $ git clone https://github.com/H-IAAC/d3vis_ipynb.git
    $ cd d3vis_ipynb
    $ pip install -e .
    $ jupyter nbextension install --py --symlink --overwrite --sys-prefix d3vis_ipynb
    $ jupyter nbextension enable --py --sys-prefix d3vis_ipynb

When actively developing your extension for JupyterLab, run the command:

    $ jupyter labextension develop --overwrite .

Then you need to rebuild the JS when you make a code change:

    $ cd js
    $ yarn run build

You then need to refresh the JupyterLab page when your javascript changes.
