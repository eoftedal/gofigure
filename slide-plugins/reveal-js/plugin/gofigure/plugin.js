function addScript(src) {
	var s = document.createElement("script");
	s.src = src;
	document.body.appendChild(s);
}

addScript("plugin/gofigure/lib/raphael-min.js");
addScript("plugin/gofigure/lib/jquery.min.js");
addScript("plugin/gofigure/gofigure.js");
setTimeout(function() {
	addScript("plugin/gofigure/lib/cufon.js");
	addScript("plugin/gofigure/lib/Vegur.js");
}, 200);

var gofigureplugin = {
	steps : {},
	isListening : false,
	addStep : function(id, animatable) {
		this.steps[id] = this.steps[id] || [];
		this.steps[id].push(animatable);
		var s = document.createElement("span");
		s.className = "fragment ";
		s.gofigureid = id;
		document.getElementById(id).appendChild(s);
		if (!this.isListening) {
			this.isListening = true;
			var those = this.steps;
			Reveal.addEventListener( 'fragmentshown', function(event) {
				if (event.fragment.gofigureid && those[event.fragment.gofigureid].length > 0) {
					those[event.fragment.gofigureid].reverse();
					those[event.fragment.gofigureid].pop().animate();
					those[event.fragment.gofigureid].reverse();
					event.fragment.remove();
				}
 			});
		}
	}
};

