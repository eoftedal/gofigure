/*! gofigure v0.0.2 */
/* global $:false, Raphael:false */

var gofigure = function() {
    var box = function(x, y, w, h, options) {
        var radius = $.extend({radius: 12.875}, options).radius;
        var cx = [7.109 / 12.875 * radius, 12.875 / 12.875 * radius];
        var cy = [5.765 / 12.875 * radius, 12.876 / 12.875 * radius];
        w -= 12.875 / 12.875 * radius * 2;
        h -= 12.876 / 12.875 * radius * 2;
        x += 12.875 / 12.875 * radius;
        return { 
            pathString: "M" + (x - options.strokeWidth/2.0 ) + "," + y + "h" + options.strokeWidth/2.0 + 
            "h" + w + "c" + cx[0] + ",0," + cx[1] + "," + cy[0] + "," + cx[1] + "," + cy[1] + " " +
            "v" + h + "c0," + cx[0] + ",-" + cy[0] + "," + cx[1] + ",-" + cx[1] + "," + cy[1] + " " +
            "h-" + w + "c-" + cx[0] + ",0,-" + cx[1] + ",-" + cy[0] + ",-" + cx[1] + ",-" + cy[1] + " " +
            "v-" + h + "c0,-" + cx[0] + "," + cy[0] + ",-" + cx[1] + "," + cx[1] + ",-" + cy[1]
        };
    };

    var circle = function(x, y, radius, options) {
        return box(x-radius, y-radius, radius*2.001, radius*2.001, $.extend(options, { radius: radius }));
    };

    var round = function(num, places) {
        return Math.round(num * Math.pow(10, places)) / Math.pow(10, places);
    };

    var line = function(x1, y1, x2, y2, options) {
        var heads = (options || {}).arrowheads || "none";
        var len = (options || {}).len || 10;
        var ang = Math.atan2((y2-y1), (x2-x1));
        var begin = (heads != "begin" && heads != "both") ? "" : ("M" + x1 + "," + y1 +
            "l" + round(Math.cos(ang - Math.PI/4)*len, 3) + "," + round(Math.sin(ang - Math.PI/4)*len, 3) +
            "M" + x1 + "," + y1 +
            "l" + round(Math.cos(ang + Math.PI/4)*len, 3) + "," + round(Math.sin(ang + Math.PI/4)*len, 3));
        var end = (heads != "end" && heads != "both") ? "" : ("M" + x2 + "," + y2 +
            "l" + round(Math.cos(ang - Math.PI*3/4)*len, 3) + "," + round(Math.sin(ang - Math.PI*3/4)*len, 3) +
            "M" + x2 + "," + y2 +
            "l" + round(Math.cos(ang + Math.PI*3/4)*len, 3) + "," + round(Math.sin(ang + Math.PI*3/4)*len, 3));
        return  { 
            pathString: begin + "M" + x1 + "," + y1 + "l" + (x2 - x1) + "," + (y2 - y1) + end 
        };
    };

    var path = function(points, options) {
        console.log(points.length, points);
        if (points.length <= 1) return { pathString: "" };
        if (points.length === 2) return line(points[0][0], points[0][1], points[1][0], points[1][1], options);
        var headBegin = /(begin|both)/.test(options.arrowheads) ? "begin" : "none"; 
        var headEnd = /(end|both)/.test(options.arrowheads) ? "end" : "none"; 
        var l = line(points[0][0], points[0][1], points[1][0], points[1][1], $.extend(options, {"arrowheads" : headBegin}));
        for (var i = 1; i < (points.length - 2); i++) {
            l.pathString += line(points[i][0], points[i][1], points[i+1][0], points[i+1][1], $.extend(options, {"arrowheads" : "none"})).pathString;
        }
        l.pathString += line(points[points.length - 2][0], points[points.length - 2][1], points[points.length - 1][0], points[points.length - 1][1], $.extend(options, {"arrowheads" : headEnd})).pathString;
        return l;
    };


    var drawcenteredtext = function(canvas, x, y, text, options) { //Yes, this is quite ugly code, but it seems to work
        var result = drawtext(canvas, -1000, -1000, text, options).pathString;
        var tmp = result.replace(/[A-Z](,?[A-Z])*/g, ",").replace(/^,+/, "").replace(/,+$/g, "");
        var parts = tmp.split(",");
        var maxRight = -2000;
        var minLeft = 200000;
        for (var i = 0; i < parts.length; i = i + 2) {
            var n = parseFloat(parts[i]);
            maxRight = maxRight < n ? n : maxRight;
            minLeft = minLeft < n ? minLeft : n;
        }
        return drawtext(canvas, x - (maxRight - minLeft)/2.0, y, text, options);
    };


    var drawtext = function(canvas, x, y, text, options) {
        options = $.extend({fontsize : 20}, options);
        var pathString = [];
        var line = canvas.print(x, y, text, canvas.getFont("Vegur"), options.fontsize);
        pathString.push(line[0].getAttribute("d"));
        line[0].remove();
        return { pathString: pathString.join(",") };
    };

    var gofigureid = 0;
    var gofigure_lineid = 0;

    function setupLine(canvas, group, part) {
        var line = canvas.path(part.path.pathString).attr({
            "stroke": "#000",
            "stroke-width": 0
        });
        var identifier = group + "-animate-" + gofigure_lineid++;
        line.node.setAttribute("class", identifier);
        return { line : line, identifier : identifier, options : part.options };
    }

    function animate(canvas, lineObj, callback) {
        var line = lineObj.line;
        var length = line.getTotalLength();
        var current = null;
        $("path." + lineObj.identifier + '[fill*="none"]').animate({
            "to": 1
        }, {
            duration: lineObj.options.duration || 1000,
            step: function(pos, fx) {
                var offset = length * fx.pos;
                var subpath = line.getSubpath(0, offset);
                var subline = canvas.path(subpath).attr({
                    "stroke-width": lineObj.options.strokeWidth || 3,
                    stroke: "#000",
                    fill: lineObj.options.fill || "none"
                });
                if (current) {
                    current.remove();
                }
                current = subline;
            },
            done: function() {
                line.remove();
                if (callback) callback();
            }
        });
    }

    function prepare(step, path, options) {
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
            animate(canvas, lines[i], function() { run(lines, i + 1); });
        }
        run(lines, 0);
    }

    function createStep(canvas, group) {
        var step = { parts: [] };
        var defaults = function(options){ return $.extend({ strokeWidth : 3 }, options); };
        step.box = function(x, y, width, height, options) {
            options = defaults(options);
            return prepare(step, box(x, y, width, height, options), options);
        };
        step.centeredText = function(x, y, text, options) {
            options = defaults($.extend({ strokeWidth: -1, fill: "#000" }, options));
            return prepare(step, drawcenteredtext(canvas, x, y, text, options), options);
        };
        step.circle = function(x, y, radius, options) {
            options = defaults(options);
            return prepare(step, circle(x, y, radius, options), options);
        };
        step.path = function(points, options) {
            options = defaults(options);
            return prepare(step, path(points, options), options);
        };
        step.line = function(xfrom, yfrom, xto, yto, options) {
            options = defaults(options);
            return prepare(step, line(xfrom, yfrom, xto, yto, options), options);
        };
        step.arrow = function(xfrom, yfrom, xto, yto, options) {
            options = defaults($.extend({ arrowheads : "both"}, options));
            return prepare(step, line(xfrom, yfrom, xto, yto, options), options);
        };
        step.animate = function() {
            doAnimate(canvas, group, step.parts);
        };
        return step;
    }


    function create(containerId, width, height) {
        var canvas = Raphael(containerId, width, height);
        $("#" + containerId + " svg").wrap("<div>");

        var group = "group" + gofigureid++;
        return {
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
            box: function(x, y, width, height, options) { return createStep(canvas, group).box(x, y, width, height, options); },
            centeredText: function(x, y, text, options) { return createStep(canvas, group).centeredText(x, y, text, options); },
            circle: function(x, y, radius, options) { return createStep(canvas, group).circle(x, y, radius, options); },
            path: function(points, options) { return createStep(canvas, group).path(points, options); },
            line: function(xfrom, yfrom, xto, yto, options) { return createStep(canvas, group).line(xfrom, yfrom, xto, yto, options); },
            arrow: function(xfrom, yfrom, xto, yto, options) { return createStep(canvas, group).arrow(xfrom, yfrom, xto, yto, options); },

        };
    }

    return {
        create: create
	};
}();
