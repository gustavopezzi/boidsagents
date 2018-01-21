///////////////////////////////////////////////////////////////////////////////
// Obstacle class definition.
///////////////////////////////////////////////////////////////////////////////
function Obstacle(x, y) {
	this.pos = createVector(x, y);
}

Obstacle.prototype.draw = function() {
	noStroke();
	fill(255, 90, 200);
	if (options.enableObstacles) {
		if (options.viewDebug) {
			ellipse(this.pos.x, this.pos.y, 32, 32);
		} else {
			push();
			translate(this.pos.x, this.pos.y);
			image(bubbleImg, -16, -16);
			pop();
		}
	}
}
