How to
------

1. Copy the plugin/gofigure folder into the plugin directory in your reveal presentation
2. Add the plugin under `Render.initialize`, `dependencies`:
<<<<<<< HEAD
	{ src: 'plugin/gofigure/plugin.js',  condition: function() { return true; } }
=======
	{ src: 'plugin/gofigure/plugin.js', condition: function() { return true; } }
>>>>>>> master
3. Add a div with an id to a slide (the id 'figure' is used below)
4. Create the steps:
		<script>

<<<<<<< HEAD
		window.addEventListener('load', function() {
		  setTimeout(function() {
=======
		Reveal.addEventListener( 'ready', function( event ) {
			setTimeout(function() {
>>>>>>> master
			var figure = gofigure.create('figure', '780', '450');
		    var opts = {arrowheads: "end", duration:500 };
		    gofigureplugin.addStep('figure', figure.arrow(10, 10, 40, 40, opts));
		    gofigureplugin.addStep('figure', figure.arrow(50, 10, 50, 40, opts));
		    gofigureplugin.addStep('figure', figure.arrow(90, 10, 60, 40, opts));
		    gofigureplugin.addStep('figure', figure.arrow(10, 50, 40, 50, opts));
		    gofigureplugin.addStep('figure', figure.arrow(90, 50, 60, 50, opts));
		  }, 1000);
		}, false);

		</script>


The setTimeout is a bit ugly, but seems to be needed to make sure all libraries are loaded.
