///////////////////////////////////////////////////////////////////////////////
// Global variables and constants.
///////////////////////////////////////////////////////////////////////////////
var CANVAS_WIDTH = 800;
var CANVAS_HEIGHT = 600;
var NUM_BOIDS_START = 20;
var boidId = 0;

var MAX_SPEED;
var NEIGHBOR_RADIUS;
var CROWD_RADIUS;
var SEPARATION_RADIUS;
var COHESION_RADIUS;

var boids = [];
var obstacles = [];

var fishImgOrange;
var fishImgRed;
var bubbleImg;
var canvasContext;

var options = {
	insertOption: 'addBoids',
	showFish: false,
	viewDebug: false,
	viewBackground: true,
	enableObstacles: true,
	enableCohesion: true,
	enableAlignment: true,
	enableSeparation: true,
	enableNoise: true
}

///////////////////////////////////////////////////////////////////////////////
// Preload function to load asynchronous content needed for the simulation.
///////////////////////////////////////////////////////////////////////////////
function preload() {
	fishImgOrange = loadImage('img/fish-orange.png');
	fishImgRed = loadImage('img/fish-red.png');
	bubbleImg = loadImage('img/bubble.png');
}

///////////////////////////////////////////////////////////////////////////////
// Setup function that runs on the beginning of the animation loop.
///////////////////////////////////////////////////////////////////////////////
function setup() {
	colorMode(RGB, 100);
	var canvas = createCanvas(800, 600);
	canvas.parent('canvas-container');
	var canvasElement = document.getElementById('defaultCanvas0');
    canvasContext = canvasElement.getContext('2d');
	for (var i = 0; i < NUM_BOIDS_START; i++) {
        boids.push(new Boid(random(CANVAS_WIDTH), random(CANVAS_HEIGHT)));
    }
	recalculateControlVariables();
}

///////////////////////////////////////////////////////////////////////////////
// Recalculate control variables.
///////////////////////////////////////////////////////////////////////////////
function recalculateControlVariables() {
	MAX_SPEED = 2.0;
    NEIGHBOR_RADIUS = 60;
    CROWD_RADIUS = (NEIGHBOR_RADIUS / 1.3);
    SEPARATION_RADIUS = 90;
    COHESION_RADIUS = NEIGHBOR_RADIUS;
}

///////////////////////////////////////////////////////////////////////////////
// Build walls of obstacles
///////////////////////////////////////////////////////////////////////////////
function setupObstacleWalls() {
	obstacles = [];
    for (var x = 20; x < CANVAS_WIDTH - 20; x += 10) {
        obstacles.push(new Obstacle(x, 10));
        obstacles.push(new Obstacle(x, CANVAS_HEIGHT - 10));
    }
    for (var y = 20; y < CANVAS_HEIGHT - 10; y += 10) {
        obstacles.push(new Obstacle(10, y));
        obstacles.push(new Obstacle(CANVAS_WIDTH - 20, y));
    }
}

///////////////////////////////////////////////////////////////////////////////
// Event listener for keyboard key pressed using jQuery selectors.
///////////////////////////////////////////////////////////////////////////////
$(document).ready(function () {
	$('.btn-add-boids').css('background', '#ab3232');
	$('.btn-add-boids').click(function () {
		options.insertOption = 'addBoids';
		$('.btn-add-boids').css('background', '#ab3232');
		$('.btn-add-bubble').css('background', '#8279BA');
	});
	$('.btn-add-bubble').click(function () {
		options.insertOption = 'addBubbles';
		$('.btn-add-boids').css('background', '#8279BA');
		$('.btn-add-bubble').css('background', '#ab3232');
	});
	$('.btn-view-debug').click(function () {
		options.viewDebug = !options.viewDebug;
		$('.btn-view-debug').html((options.viewDebug) ? 'Hide debug' : 'View debug');
	});
	$('.btn-toggle-background').click(function () {
		options.viewBackground = !options.viewBackground;
		$('.btn-toggle-background').html((options.viewBackground) ? 'Hide background' : 'View background');
	});
	$('.btn-toggle-obstacles').click(function () {
		options.enableObstacles = !options.enableObstacles;
		$('.btn-toggle-obstacles').html((options.enableObstacles) ? 'Ignore obstacles' : 'Enable obstacles');
		recalculateControlVariables();
	});
	$('.btn-toggle-cohesion').click(function () {
		options.enableCohesion = !options.enableCohesion;
		$('.btn-toggle-cohesion').html((options.enableCohesion) ? 'Disable cohesion' : 'Enable cohesion');
		recalculateControlVariables();
	});
	$('.btn-toggle-alignment').click(function () {
		options.enableAlignment = !options.enableAlignment;
		$('.btn-toggle-alignment').html((options.enableAlignment) ? 'Disable alignment' : 'Enable alignment');
		recalculateControlVariables();
	});
	$('.btn-toggle-separation').click(function () {
		options.enableSeparation = !options.enableSeparation;
		$('.btn-toggle-separation').html((options.enableSeparation) ? 'Disable separation' : 'Enable separation');
		recalculateControlVariables();
	});
});

//////////////////////////////////////////////////////////////////////////////
// Event listener for mouse pressed.
///////////////////////////////////////////////////////////////////////////////
function mousePressed() {
    switch (options.insertOption) {
        case 'addBoids':
            boids.push(new Boid(mouseX, mouseY));
            break;
        case 'addBubbles':
            obstacles.push(new Obstacle(mouseX, mouseY));
            break;
    }
}

///////////////////////////////////////////////////////////////////////////////
// Draw function that runs every frame of the animation loop.
///////////////////////////////////////////////////////////////////////////////
function draw() {
	if (options.viewBackground) {
		var bgImg = new Image();
		bgImg.src = 'img/bg.jpg';
		bgImg.onload = function () {
			options.showFish = true;
			for (var w = 0; w < CANVAS_WIDTH; w += bgImg.width) {
				for (var h = 0; h < CANVAS_HEIGHT; h  += bgImg.height) {
					canvasContext.drawImage(bgImg, w, h);
				}
			}
		}
		$('.glass-container').show();
	}
	else {
		background('#8279BA');
		$('.glass-container').hide();
	}

	if (options.showFish) {
		for (var i = 0; i < boids.length; i++) {
	        var boid = boids[i];
	        boid.update();
	        boid.draw();
	    }

	    for (var i = 0; i < obstacles.length; i++) {
	        var obstacle = obstacles[i];
	        obstacle.draw();
	    }
	}
}
