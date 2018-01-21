///////////////////////////////////////////////////////////////////////////////
// Boid constructor.
///////////////////////////////////////////////////////////////////////////////
function Boid(x, y) {
	this.id = boidId++;
	this.move = new createVector(0, 0);
	this.pos = new createVector(x, y);
	this.neighbors = [];
}

///////////////////////////////////////////////////////////////////////////////
// Boid update function.
///////////////////////////////////////////////////////////////////////////////
Boid.prototype.update = function() {
	this.wrap();
	this.getNeighbors();
	this.computeFlockForces();
	this.pos.add(this.move);
}

///////////////////////////////////////////////////////////////////////////////
// Flock forces (alignment, cohesion, separation, and avoid obstacles).
///////////////////////////////////////////////////////////////////////////////
Boid.prototype.computeFlockForces = function () {
	var alignment = this.getAverageAlignment();
	var separation = this.getSeparation();
	var avoidance = this.getObstacleAvoidanceDirection();
	var cohesion = this.getCohesion();
	var noise = createVector(random(2) - 1, random(2) - 1);

	alignment.mult((options.enableAlignment) ? 1 : 0);
	separation.mult((options.enableSeparation) ? 1 : 0);
	avoidance.mult((options.enableObstacles) ? 5 : 0);
	noise.mult((options.enableNoise) ? 0.1 : 0);
	cohesion.mult((options.enableCohesion) ? 1 : 0);

	this.move.add(alignment);
	this.move.add(separation);
	this.move.add(avoidance);
	this.move.add(noise);
	this.move.add(cohesion);

	this.move.limit(MAX_SPEED);
}

///////////////////////////////////////////////////////////////////////////////
// Create an array of neighbors based on boid visibility.
///////////////////////////////////////////////////////////////////////////////
Boid.prototype.getNeighbors = function () {
	nearby = [];
	for (var i = 0; i < boids.length; i++) {
		var other = boids[i];
		if (other == this) {
			continue;
		}
		if (abs(other.pos.x - this.pos.x) < NEIGHBOR_RADIUS && abs(other.pos.y - this.pos.y) < NEIGHBOR_RADIUS) {
			nearby.push(other);
		}
	}
	this.neighbors = nearby;
}

///////////////////////////////////////////////////////////////////////////////
// Compute the average alignment between the boid and its visible neighbors.
///////////////////////////////////////////////////////////////////////////////
Boid.prototype.getAverageAlignment = function () {
	var sum = createVector(0, 0);
	var count = 0;
	var thisBoid = this;
	this.neighbors.forEach(function (other) {
		var d = p5.Vector.dist(thisBoid.pos, other.pos);
		if ((d > 0) && (d < NEIGHBOR_RADIUS)) {
			var copy = other.move.copy();
			copy.normalize();
			copy.div(d);
			sum.add(copy);
			count++;
		}
	});
	return sum;
}

///////////////////////////////////////////////////////////////////////////////
// Compute the separation force between the boid and its visible neighbors.
///////////////////////////////////////////////////////////////////////////////
Boid.prototype.getSeparation = function () {
	var steer = createVector(0, 0);
	var count = 0;
	var thisBoid = this;
	this.neighbors.forEach(function (other) {
		var d = p5.Vector.dist(thisBoid.pos, other.pos);
		if ((d > 0) && (d < CROWD_RADIUS)) {
			var diff = p5.Vector.sub(thisBoid.pos, other.pos);
			diff.normalize();
			diff.div(d);
			steer.add(diff);
			count++;
		}
	});
	return steer;
}

///////////////////////////////////////////////////////////////////////////////
// Compute the force to make the boid avoid visible obstacles.
///////////////////////////////////////////////////////////////////////////////
Boid.prototype.getObstacleAvoidanceDirection = function () {
	var steer = createVector(0, 0);
	var count = 0;
	var thisBoid = this;
	obstacles.forEach(function (other) {
		var d = p5.Vector.dist(thisBoid.pos, other.pos);
		if ((d > 0) && (d < SEPARATION_RADIUS)) {
			var diff = p5.Vector.sub(thisBoid.pos, other.pos);
			diff.normalize();
			diff.div(d);
			steer.add(diff);
			count++;
		}
	});
	return steer;
}

///////////////////////////////////////////////////////////////////////////////
// Compute the cohesion force between the boid and its visible neighbors.
///////////////////////////////////////////////////////////////////////////////
Boid.prototype.getCohesion = function () {
	var neighbordist = 50;
	var sum = createVector(0, 0);
	var count = 0;
	var thisBoid = this;
	this.neighbors.forEach(function (other) {
		var d = p5.Vector.dist(thisBoid.pos, other.pos);
		if ((d > 0) && (d < COHESION_RADIUS)) {
			sum.add(other.pos);
			count++;
		}
	});
	if (count > 0) {
		sum.div(count);
		var desired = p5.Vector.sub(sum, this.pos);
		return desired.setMag(0.05);
	} else {
		return createVector(0, 0);
	}
}

///////////////////////////////////////////////////////////////////////////////
// Boid draw method.
///////////////////////////////////////////////////////////////////////////////
Boid.prototype.draw = function () {
	for (var i = 0; i < this.neighbors.length; i++) {
		var f = this.neighbors[i];
		stroke('#963232');
		if (options.viewDebug) {
			line(this.pos.x, this.pos.y, f.pos.x, f.pos.y);
		}
	}
	noStroke();
	fill(255, 90, 200);
	push();
	translate(this.pos.x, this.pos.y);
	rotate(this.move.heading());
	if (options.viewDebug) {
		beginShape();
		vertex(10, 0);
		vertex(-2, 2);
		vertex(-2, -2);
		endShape(CLOSE);
	} else {
		image((this.id % 2 == 0) ? fishImgOrange : fishImgRed, -8, -5);
	}
	pop();
}

///////////////////////////////////////////////////////////////////////////////
// Wrap the boid position inside the canvas width and height.
///////////////////////////////////////////////////////////////////////////////
Boid.prototype.wrap = function () {
	this.pos.x = (this.pos.x + CANVAS_WIDTH) % CANVAS_WIDTH;
	this.pos.y = (this.pos.y + CANVAS_HEIGHT) % CANVAS_HEIGHT;
}
