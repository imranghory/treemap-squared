/*
 * Treemap Squared 0.5 - Treemap Charting library 
 *
 * https://github.com/imranghory/treemap-squared/
 *
 * Copyright (c) 2012 Imran Ghory (imranghory@gmail.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */

 /* Hints for JSHint */ 
 /*global Raphael, Treemap */ 

(function() {    
    "use strict";
    Treemap.draw = function(){ 

        // some utility functions 
        function isArray(arr) {
            return arr && arr.constructor === Array; 
        }

        function isFunction(func) {
            return func && func.constructor === Function; 
        }

        // mergeProperies - given two sets of associative arrays merge the,
        //                  for clashes copy the new value over the original one
        function mergeProperties(originalproperties, newproperties) {
            var property;
            for (property in newproperties) {
                if (newproperties.hasOwnProperty(property)) {
                    originalproperties[property] = newproperties[property];
                }
            }
         return originalproperties;
        }

        // drawTreemap - recursively iterate through the nested array of boxes
        //               and call the styles['draw'] method on them
        function drawTreemap(paper, boxes, labels, styles, index) {
            var i,j;
            var newindex; // the index to the next box to draw
            var label; // label of current box
           
            if(isArray(boxes[0][0])) {
                for(i=0; i<boxes.length; i++) {
                    newindex = index.slice();
                    newindex.push(i);
                    drawTreemap(paper, boxes[i],labels, styles, newindex);
                }
            } else {
                for(i=0; i<boxes.length; i++) {
                    newindex = index.slice();
                    newindex.push(i);

                    // figure out the matching label using the index 
                    label = labels;
                    for(j=0; j<newindex.length; j++){
                        label = label[newindex[j]];
                    }
                    
                    // draw box & label
                    styles.draw(boxes[i], label, newindex);
                }
            }
        }


        function draw(element, width, height, data, labels, styles) {
            var paper, background, nodes, labelFormatter, boxDrawer;
            styles = (typeof styles === "undefined") ? [] : styles;      

            /* create some default style functions */

            // This label formatter calculates a font-size based upon 
            // average label length and the size of the box the label is 
            // going into. The maximum font size is set to 20px.  
            labelFormatter = function () {                 
                var averagelabelsize = totalLabelLength(labels) / countLabels(labels); 

                // total length of labels (i.e [["Italy"],["Spain", "Greece"]] -> 16)
                function totalLabelLength(arr) {
                    var i, total = 0;
                    if(isArray(arr[0])) {
                        for(i=0; i<arr.length; i++) {
                            total += totalLabelLength(arr[i]);
                        }
                    } else {
                        for (i = 0; i<arr.length; i++){
                           total += arr[i].length;  
                        }
                    }
                    return total;
                }

                // count of labels (i.e [["Italy"],["Spain", "Greece"]] -> 3)
                function countLabels(arr) {
                    var i, total = 0;
                    if(isArray(arr[0])) {
                        for(i=0; i<arr.length; i++) {
                            total += countLabels(arr[i]);
                        }
                    } else {
                        for (i = 0; i<arr.length; i++){
                           total += 1;  
                        }
                    }
                    return total;
                }

                function fontSize(width, height) {
                    // the font size should be proportional to the size of the box (and the value)
                    // otherwise you can end up creating a visual distortion where two boxes of identical
                    // size have different sized labels, and thus make it look as if the two boxes
                    // represent diffferent sizes
                    var area = width*height;
                    var arearoot = Math.pow(area, 0.5);
                    return Math.min( arearoot / (averagelabelsize), 20);
                }

                function style(coordinates, index) {
                    return { "fill" : "#FCFCFC", "font-size": fontSize(coordinates[2] - coordinates[0], coordinates[3] - coordinates[1] )};   
                }

                return style;
            }();

            // default style for boxes
            var boxFormatter = function (coordinates, index) {
                var colors = ["hsb(0,1,0.4)", "hsb(0.2,1,0.4)", "hsb(0.4,1,0.4)", "hsb(0.6,1,0.4)", "hsb(0.8,1,0.4)"];  
                var color = (index.length === 1) ? colors[2] : colors[(index[0] + 2) % 5];          
                return  { "stroke": "FEFEFE", "fill" : color};
            };


            // default box & label drawing routine - in most cases this default one in combination with changing the styles
            // will suffice. Only if you're doing something complex and want to rewrite how the treemap gets drawn
            // would you replace this. 
            boxDrawer = function () { 
                function drawbox(coordinates, label, newindex) {
                    var x1=coordinates[0], y1=coordinates[1], x2=coordinates[2], y2=coordinates[3];
                    var box, text;
                    var boxattr, labelattr;
                    var rgbobj;

                    // draw box 
                    box = paper.rect(x1, y1, x2 - x1, y2 - y1);
                    
                    boxattr = isFunction(styles.box) ? styles.box(coordinates, newindex) : styles.box;
                    boxattr = mergeProperties(boxFormatter(coordinates, newindex), boxattr);

                    // dirty hack to fix opacity support in non-webkit web browsers
                    if ("fill-opacity" in boxattr) {
                        rgbobj = Raphael.getRGB(boxattr.fill);
                        if (!rgbobj.error) {
                            boxattr.fill = "rgba(" + rgbobj.r + "," + rgbobj.g + "," + rgbobj.b + "," + boxattr['fill-opacity'] + ")";
                        } 
                    }

                    box.attr(boxattr);

                    // draw labels 
                    text = paper.text((x1 + x2) / 2, (y1 + y2) / 2, label);

                    labelattr = isFunction(styles.label) ? styles.label(coordinates, newindex) : styles.label;
                    labelattr = mergeProperties(labelFormatter(coordinates, newindex), labelattr);

                    text.attr(labelattr);

                    // if the label fits better sideways then rotate it
                    if(text.getBBox().width > x2-x1 && text.getBBox().width <= y2-y1) {
                        text.rotate(-90); 
                    }
                    // TODO: add more sophisticated logic to shrink text if it overflows the box size   
                }
                return drawbox;
            }();

            styles.background = (typeof styles.background  === "undefined") ? {} : styles.background;
            styles.label = (typeof styles.label  === "undefined") ? {} : styles.label;
            styles.box = (typeof styles.box  === "undefined") ? {} : styles.box;
            styles.draw = (typeof styles.draw  === "undefined") ? boxDrawer : styles.draw;

            // create our canvas and style the background 
            paper = new Raphael(element, width, height);

            background = paper.rect(0, 0, width, height);
            background.attr(styles.background);

            // generate our treemap from our data
            nodes = Treemap.generate(data, width, height);

            // draw the generated treemap
            drawTreemap(paper, nodes, labels, styles, []);
        }

        return draw;
    }();
})();
