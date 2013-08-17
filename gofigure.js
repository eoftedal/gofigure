/*global $:false, console:false, Raphael:false */

var gofigure = function() {
    var box = function(x, y, w, h) {
        w -= 12.875*2;
        h -= 12.876*2;
        x += 12.875;
        return { pathString: "M" + x + "," + y + 
            "h" + w + "c7.109,0,12.875,5.765,12.875,12.876 " + 
            "v" + h + "c0,7.109,-5.765,12.875,-12.875,12.876 " + 
            "h-" + w + "c-7.109,0,-12.875,-5.765,-12.875,-12.876 " + 
            "v-" + h + " c0,-7.109,5.765,-12.875,12.875,-12.876", 
            join: join };
    };
    var round = function(num, places) {
        return Math.round(num * Math.pow(10, places)) / Math.pow(10, places);
    }
    var arrow = function(x1, y1, x2, y2, options) {
        var heads = (options || {}).heads || "both";
        var len = (options || {}).len || 10;
        var ang = Math.atan((x1-x2)/(y1-y2));
        var begin = (heads == "end") ? "" : ("M" + x1 + "," + y1 + 
            "l" + -round(Math.sin(ang - Math.PI/4)*len, 3) + "," + round(Math.cos(ang - Math.PI / 4)*len, 3) +
            "M" + x1 + "," + y1 + 
            "l" + -round(Math.sin(ang + Math.PI/4)*len, 3) + "," + round(Math.cos(ang + Math.PI / 4)*len, 3));
        var end = (heads == "begin") ? "" : ("M" + x2 + "," + y2 + 
            "l" + round(Math.sin(ang - Math.PI/4)*len, 3) + "," + round(Math.cos(ang - Math.PI / 4)*len, 3) +
            "M" + x2 + "," + y2 + 
            "l" + round(Math.sin(ang + Math.PI/4)*len, 3) + "," + round(Math.cos(ang + Math.PI / 4)*len, 3));
        return  { pathString: 
            begin +
            "M" + x1 + "," + y1 +
            "l" + (x2 - x1) + "," + (y2 - y1) +
            end,
            join: join};
    };

    var drawcenteredtext = function(canvas, x, y, text) { //Yes, this is quite ugly code, but it seems to work
        var result = drawtext(canvas, -1000, -1000, text).pathString;
        var tmp = result.replace(/[A-Z](,?[A-Z])*/g, ",").replace(/^,+/, "").replace(/,+$/g, "");
        var parts = tmp.split(",");
        var maxRight = -2000;
        var minLeft = 200000;
        for (var i = 0; i < parts.length; i = i + 2) {
            var n = parseFloat(parts[i]);
            maxRight = maxRight < n ? n : maxRight;
            minLeft = minLeft < n ? minLeft : n;
        }
        return drawtext(canvas, x - (maxRight - minLeft)/2.0, y, text);
    }


    var drawtext = function(canvas, x, y, text) {
        var pathString = [];
        var line = canvas.print(x, y, text, canvas.getFont("Vegur"), 20);

        for (var i in line.items) {
            pathString.push(line[i].node.getAttribute("d"));
            line[i].remove();
        }
        return { pathString: pathString.join(","), join: join};
    };

    var join = function(drawing) {
        this.pathString += drawing.pathString;
        return this;
    };





    var gofigureid = 0;
    var gofigure_lineid = 0;

    function setupLine(canvas, group, part) {
        var line = canvas.path(part.path.pathString).attr({
            stroke: "#000",
            'stroke-width': 0
        });
        var identifier = group + "-animate-" + gofigure_lineid++;
        line.node.setAttribute('class', identifier);
        return { line : line, identifier : identifier, options : part.options };        
    }

    function animate(canvas, lineObj, callback) {
        var line = lineObj.line;
        var length = line.getTotalLength();
        var current = null;
        $('path.' + lineObj.identifier + '[fill*="none"]').animate({
            'to': 1
        }, {
            duration: lineObj.options.duration || 1000,
            step: function(pos, fx) {
                var offset = length * fx.pos;
                var subpath = line.getSubpath(0, offset);
                var subline = canvas.path(subpath).attr({
                    'stroke-width': lineObj.options.strokeWidth || 3,
                    stroke: "#000",
                    fill: lineObj.options.fill || "none"
                });
                if (current) {
                    current.remove();
                }
                current = subline;
            },
            done: function() {
                callback && callback();
            }
        });
    }


    function prepare(step, path, defaults, options) {
        options = $.extend(defaults, options);
        step.parts.push({ path: path, options: options});
        return step;
    }
    function doAnimate(canvas, group, parts) {
        var lines = [];
        for(var i in parts) {
            lines.push(setupLine(canvas, group, parts[i]));
        }
        function run(lines, i) {
            if (i >= lines.length) return;
            animate(canvas, lines[i], function() { run(lines, i + 1)});
        }
        run(lines, 0);
    }

    function createStep(canvas, group) {
        var step = { parts: [] };
        step.box = function(x, y, width, height, options) { 
            return prepare(step, box(x, y, width, height), {}, options); 
        };
        step.centeredText = function(x, y, text, options) { 
            return prepare(step, drawcenteredtext(canvas, x, y, text), { strokeWidth: -1, fill: "#000" }, options); 
        };
        step.arrow = function(xfrom, yfrom, xto, yto, options) { 
            return prepare(step, arrow(xfrom, yfrom, xto, yto, options), {}, options); 
        };
        step.animate = function() { 
            doAnimate(canvas, group, step.parts);
        }
        return step;
    }


    function create(containerId, width, height) {
        var canvas = Raphael(containerId, width, height);
        var group = "group" + gofigureid++;
        return fig = { 
            bindClick : function(steps) {
                var i = 0;
                $("#" + containerId + " svg").click(function() {
                    if (steps[i]) {
                        steps[i].animate();
                    }
                    i++;
                });
            },
            animate: function() {},
            box: function(x, y, width, height, options) { return createStep(canvas, group).box(x, y, width, height, options) },
            centeredText: function(x, y, text, options) { return createStep(canvas, group).centeredText(x, y, text, options) },
            arrow: function(xfrom, yfrom, xto, yto, options) { return createStep(canvas, group).arrow(xfrom, yfrom, xto, yto, options) },
        }
    }

    return { 
        create: create
	}; 
}();
