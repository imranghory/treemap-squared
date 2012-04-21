treemap-squared
===============

![Example](examples/example.png)


Treemap Squared provides a way to easily generate attractive Treemaps.

It was developed due to the lack of attractive options for generating simple Treemaps. Historically most Treemap software has been focused purely on functionallity resulting in very brutalist styles of design (some examples can been seen on the [Wikipedia Treemap Page](http://en.wikipedia.org/wiki/Treemapping)). However modern uses such as web applications and infographics place higher importance on aesthetics, and that's the need this library aims to serve.

As a secondary objective it also provides a clean open-source implementation of the Squarified Treemap algorithm. While there have been other open-source implementations in the past they've generally been tightly coupled with visualization code. Treemap Squared's implementation of the algorithm (and extensions) is completely independent of the visualization code and the two operate at arms length.

Treemap Squared has a visualization component which uses the Raphael vector drawing library, but it should be relatively straight-forward to use the treemap code with any other graphics library and the code has been designed to accomodate this.

The Treemap algorithm used can be found in:

[Squarified Treemaps](http://www.win.tue.nl/~vanwijk/stm.pdf) (2000) - *Bruls, Mark; Huizing, Kees; van Wijk, Jarke J.*  
*Data Visualization 2000: Proc. Joint Eurographics and IEEE TCVG Symp. on Visualization, Springer-Verlag, pp. 33-42.*

The core algorithm is as found in the paper but a number of (straight forward) extra features have been added:

* Data normalization allowing any arbitary numeric data to be used as input
* Support for multidimensional data by recursively applying the algorithm

Unlike other implementations which directly call into visualization methods from within the algorithms implementation, the treemap library here instead returns a ordered array of cartesian coordinates (the order matching that of the input data) which represents each of the boxes to be drawn which can then be passed to a visulization library. This allows for a clean decoupling of the treemap structure generation and the actual visualization.

The code base is split into two files:

* treemap-squarify.js  - containing the code to calculate the structure of the treemap
* treemap-raphael.js - containing the visualization code

Using treemap-raphael.js
=========================



Using treemap-squarify.js
=========================



