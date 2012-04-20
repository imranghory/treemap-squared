treemap-squared
===============

Treemap Squared provides a way to easily generate attractive Treemaps.

It was developed due to the lack of attractive options for generating simple Treemaps, most Treemap software has been focused purely on functionallity resulting in very brutalist styles of Treemaps (some examples can been seen on the [Wikipedia Treemap Page](http://en.wikipedia.org/wiki/Treemapping)).

As a secondary objective it also provides a clean open-source implementation of the Bruls, Huizing, and van Wijk Squarified Treemap Algorithm. While there have been other open-source implementations in the past they've generally been tightly coupled with visualization code. Treemap Squared's implementation of the algorithm (and extensions) is completely independent of the visualization code and the two operate at arms length.

Treemap Squared has a visualization component which uses the Raphael vector drawing library, but it should be relatively trivial to port the algorithm to any other graphics library, and the code is designed to accomodate this.

The code base is split into two files:

* treemap-squarify.js  - containing the code to calculate the structure of the treemap
* treemap-raphael.js - containing purely the visualization code


![Example](examples/example.png)

<div id="example-0"></div>
<br>
<div id="example-1"></div>
<br>
<div id="example-2"></div>

<script type="text/javascript" src="http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js"></script>    
<script type="text/javascript" src="raphael-min.js"></script>
<script type="text/javascript" src="treemap-squarify.js"></script>
<script type="text/javascript" src="treemap-raphael.js"></script>

<script type="text/javascript">

    $(document).ready(function () {
        data = [60000, 60000, 40000, 30000, 20000, 10000];
        labels = ["Paris", "London", "New York", "San Francisco", "Berlin", "Tokyo"];    
        Treemap.draw("example-1", 400, 300, data, labels, { 'background' : { "fill" : "8b7765" }, 'box' : { "stroke": "#FEFEFE", "fill" : "url('bg.png')", "fill-opacity" : 
"20%"}});
        Treemap.draw("example-0", 400, 300, data, labels, {'box' : {"stroke": "FEFEFE"}});
    

        data = [[60000, 60000, 40000], [30000, 20000, 10000]];
        labels = [["Paris", "London", "New York"], ["San Francisco", "Berlin", "Tokyo"]];

        var boxFormatter = function (coordinates, index) {
            if (index[0] === 0) {
                style = { "stroke": "FEFEFE", "fill" : "green"}
            } else {
                style = { "stroke": "FEFEFE", "fill" : "darkred"}               
            }
            return style;
        }

        Treemap.draw("example-2", 400, 300, data, labels, {'box' : boxFormatter});

    });

</script>



