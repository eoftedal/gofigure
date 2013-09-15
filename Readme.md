Simple library for animated drawings of arrows, boxes and text in HTML5

Example: [http://eoftedal.github.io/gofigure/index.html]

Works best in Google Chrome.

Example code
------------

    //Add a drawing area to element with id main, with the given width and height
    var figure = gofigure.create('main', '780', '450'); 
    
    //Draw a box and animate drawing immediately
    figure.box(600, 50, 100, 200).animate();
    
    //Group two animations together and begin animation immediately
    figure.arrow(600, 150, 500, 150).centeredText(550, 167, "to").animate();

    //Create list of animations and bind them to clicks on the drawing area
    var steps = [
        figure.arrow(600, 150, 500, 150).centeredText(550, 167, "to"),
        figure.box(400, 50, 100, 200, { radius: 0 }).centeredText(450, 270, "Box with small text", {fontsize: 11}),
        figure.arrow(400, 150, 300, 150, {arrowheads: "end" }).centeredText(350, 167, "single head arrow", {fontsize: 11}),

        figure.centeredText(250, 270, "Slowly drawn box").box(200, 50, 100, 200, {duration: 5000, radius: 25 }),
    ];
    figure.bindClick(steps);


Api
---

##### **create** `gofigure.create(containerId, width, height)`
Add a drawing area to element with id `containerId` with given width and height.

Returns drawing area.

Options:

* `duration` - animation duration in ms (default: 1000)
* `radius` - border radius (default: 12.875)


- - -

##### **box** `<drawing area or animatable>.box(x, y, width, height, [options])`
Draw a box with upper left corner at point (x, y) with the given width and height.

Returns animatable figure.

Options:

* `duration` - animation duration in ms (default: 1000)
* `radius` - border radius (default: 12.875)

- - -

##### **arrow** `<drawing area or animatable>.arrow(x1, y1, x2, y2, [options])`
Draw an arrow from point (x1, y1) to (x2, y2).

Returns animatable figure.

Options:

* `duration` - animation duration in ms (default: 1000)
* `arrowheads` - where to draw arrowheads (default: "both", possible values "both", "begin", "end", "none")

- - -

##### **line** `<drawing area or animatable>.line(x1, y1, x2, y2, [options])`
Alias for arrow with arrowheads set to "none"

Returns animatable figure.

Options:

* `duration` - animation duration in ms (default: 1000)
* `arrowheads` - where to draw arrowheads (default: "both", possible values "both", "begin", "end", "none")

- - -

##### **path** `<drawing area or animatable>.path(points, [options])`
Draw line between array of points in order.

Returns animatable figure.

Options:

* `duration` - animation duration in ms (default: 1000)
* `arrowheads` - where to draw arrowheads (default: "both", possible values "both", "begin", "end", "none")

- - -


##### **circle** `<drawing area or animatable>.circle(x, y, radius, [options])`
Draw a circle with center at (x, y) with the given radius.

Returns animatable figure.

Options:

* `duration` - animation duration in ms (default: 1000)

- - -

##### **centeredText** `<drawing area or animatable>.centeredText(x, y, text, [options])`
Draw text horisontally centered around point (x,y)

Returns animatable figure.

Options:

* `duration` - animation duration in ms (default: 1000)
* `fontsize` - size of text (default: 20)

- - -

##### **bindClick** `<drawing area>.bindClick(steps)`
Bind click on sketch to animation of array of animatables. Clicking on the resulting image will result in animate being
called on each animatable in sequence.

Returns nothing.

- - -

##### **animate** `<animatable>.animate()`
Start animation of the animatable.

Returns nothing.


