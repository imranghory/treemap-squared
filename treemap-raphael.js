/*
 * Treemap Squared 0.5 - Treemap Charting library 
 *
 * http://treemapsquared.github.com
 *
 * Copyright (c) 2012 Imran Ghory (imranghory@gmail.com)
 * Licensed under the MIT (http://www.opensource.org/licenses/mit-license.php) license.
 */

(function() {    
    Treemap.draw = function(){
        function isArray(arr) {
            return arr && arr.constructor === Array; 
        }

        function isFunction(func) {
            return func && func.constructor === Function; 
        }

        function drawTreemap(paper, treemapNodes, labels, styles, index) {
            var i,j, newindex;
            console.log("drawing: ")   
            console.log(arguments)
           
            if(isArray(treemapNodes[0][0])) {
                for(i=0; i<treemapNodes.length; i++) {
                    newIndex = index.slice();
                    newIndex.push(i);
                    console.log(newIndex);
                    drawTreemap(paper, treemapNodes[i],labels, styles, newIndex);
                }
            } else {
                for(i=0; i<treemapNodes.length; i++) {
                    newindex = index.slice();
                    newindex.push(i);

                    // figure out the matching label using the index 
                    label = labels;
                    for(j=0; j<newindex.length; j++){
                        label = label[newindex[j]];
                    }
                    
                    styles['draw'](treemapNodes[i], label, newindex);
                }
            }
        }


        function draw(element, width, height, data, labels, styles) {
            var paper, background, data, nodes, labelFormatter, boxDrawer;
            styles = (typeof styles === "undefined") ? [] : styles;      

            /* create some default style functions */

            // This label formatter calculates a font-size based upon 
            // average label length and the size of the box the label is 
            // going into. The maximum font size is set to 20px.  
            labelFormatter = function () { 
                averageLabelSize = totalLabelLength(labels) / countLabels(labels); 

                // total length of labels (i.e [["Italy"],["Spain", "Greece"]] -> 16)
                function totalLabelLength(arr) {
                    var i, total = 0;
                    if(isArray(arr[0])) {
                        for(i=0; i<arr.length; i++) {
                            total += totalLabelLength(arr[i])
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
                            total += countLabels(arr[i])
                        }
                    } else {
                        for (i = 0; i<arr.length; i++){
                           total += 1;  
                        }
                    }
                    return total;
                }

                function fontSize(width) {
                    return Math.min( width / (averageLabelSize), 20);
                }

                function style(coordinates, index) {
                    return { "fill" : "#FCFCFC", "font-size": fontSize(coordinates[2] - coordinates[0])}   
                }

                return style;
            }();


            // default box & label drawing routine - in most cases this default one in combination with the other style
            // will suffice. Only if you're doing something complex and want to rewrite how the treemap gets drawn
            // would you replace this. 
            boxDrawer = function () { 
                function drawbox(coordinates, label, newindex) {
                    var x1=coordinates[0], y1=coordinates[1], x2=coordinates[2], y2=coordinates[3];

                    // draw box 
                    box = paper.rect(x1, y1, x2 - x1, y2 - y1);
                    
                    if (isFunction(styles['box'])) {
                        box.attr(styles['box'](coordinates, newindex));
                    } else {
                        box.attr(styles['box']);
                    }

                    // draw labels 
                    var text = paper.text((x1 + x2) / 2, (y1 + y2) / 2, label);

                    if (isFunction(styles['label'])) {
                        text.attr(styles['label'](coordinates, newindex));
                    } else {
                        text.attr(styles['label']);
                    }
                }
                return drawbox;
            }();

            // default style for boxes
            boxFormatter = { "stroke": "#FEFEFE", "fill" : "green", "fill-opacity" : "50%"};

            styles['background'] = (typeof styles['background']  === "undefined") ? {fill: "green"} : styles['background'];
            styles['label'] = (typeof styles['label']  === "undefined") ? labelFormatter : styles['label'];
            styles['box'] = (typeof styles['box']  === "undefined") ? boxFormatter : styles['box'];
            styles['draw'] = (typeof styles['draw']  === "undefined") ? boxDrawer : styles['draw'];

            // create our canvas and style the background 
            paper = new Raphael(element, width, height);
            background = paper.rect(0, 0, width, height);
            background.attr(styles['background']);

            // generate our treemap from our data
            nodes = Treemap.generate(data, width, height);

            // draw the generated treemap
            drawTreemap(paper, nodes, labels, styles, []);
        }

        return draw;
    }();
})();
