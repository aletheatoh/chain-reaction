// save and restore states of the canvas
// https://developer.mozilla.org/en-US/docs/Web/API/Canvas_API/Tutorial/Transformations

`GLOBAL VARIABLES`

var balls = [];
var coordinates = [
  [Math.floor(Math.random() * 800),Math.floor(Math.random() * 500)],
  [Math.floor(Math.random() * 800),Math.floor(Math.random() * 500)],
  [Math.floor(Math.random() * 800),Math.floor(Math.random() * 500)],
  [Math.floor(Math.random() * 800),Math.floor(Math.random() * 500)],
  [Math.floor(Math.random() * 800),Math.floor(Math.random() * 500)]
];

var raf;

// queue to store the hit areas
var queue = [];

var running = false;
var hitareax = 300;
var hitareay = 300;
var hitarear = 50;

`HELPER FUNCTIONS`

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

var myGameArea = {
    // function to create canvas and start the game
    canvas : document.createElement("canvas"),
    start : function() {
        this.canvas.width = 800;
        this.canvas.height = 500;
        this.canvas.id = "myCanvas";
        this.context = this.canvas.getContext("2d");
        // add to the bounding box
        var bounding_box = document.querySelector("#bounding-box");
        bounding_box.appendChild(this.canvas);
    }
}

startGame();

// extract the canvas
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

// start the game
function startGame() {
    myGameArea.start();
    for (var i=0;i<coordinates.length;i++) {
      addGamePiece = new ball(coordinates[i][0], coordinates[i][1], getRandomColor(), 3, 3, 10);
      balls.push(addGamePiece);
    }
}

// ball constructor
function ball(x, y, color, vx, vy, radius) {
    this.x = x;
    this.y = y;
    this.color = color;
    this.vx = vx;
    this.vy = vy;
    this.radius = radius;
}

// returns if ball is inside hit area (if there has been a collision)
function insideHitArea(x, y) {
  if (Math.sqrt((hitareax-x)*(hitareax-x) + (hitareay-y)*(hitareay-y)) <= hitarear) {
			return true;
		}
	else {
		return false;
	}
}

// draw a ball onto the canvas
function drawBall(x, y, r, color) {
  ctx = myGameArea.context;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fillStyle = color;
  ctx.fill();
}

// draw the balls onto the canvas
function drawBalls() {
  for (var i=0;i<balls.length;i++) {

    ball = balls[i];
    ctx = myGameArea.context;
    ctx.beginPath();
    ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fillStyle = ball.color;
    ctx.fill();
  }
}

// add motion to the ball
function moveBalls() {

  ctx.clearRect(0,0, canvas.width, canvas.height);

  ctx = myGameArea.context;
  ctx.beginPath();
  ctx.arc(300, 300, 50, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.fill();

  ctx = myGameArea.context;
  ctx.beginPath();
  ctx.arc(50, 100, 50, 0, Math.PI * 2, true);
  ctx.closePath();
  ctx.fillStyle = "red";
  ctx.fill();

  // move each rect in the balls[] array by its own directionx

  var stop = false;
  for (var i=0;i<balls.length;i++) {
    ball = balls[i];

    // if ball is within hit area, expand hit area, remove ball
    if (insideHitArea(ball.x, ball.y)) {
      stop = true;
      ball.radius = 50;
      // drawBall(ball.x, ball.y, 50, ball.color);
      ctx.save();
      // balls.splice(i, 1);
    }

    else {
      ball.x += ball.vx;
      ball.y += ball.vy;

      // keep the ball within the bounding box
      if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
      ball.vy = -ball.vy;
      }
      if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
        ball.vx = -ball.vx;
      }
    }
  }

  // draw the balls
  drawBalls();

  raf = window.requestAnimationFrame(moveBalls);
  // if (!stop) {
  //   // request another frame in the animation loop
  //   raf = window.requestAnimationFrame(moveBalls);
  // }
}

function buttonClick(subEvent)
{
    var mainEvent = subEvent ? subEvent : window.event;
    alert("This button click occurred at: X(" +
    mainEvent.screenX + ") and Y(" + mainEvent.screenY + ")");
}

`LOAD AND PLAY THE GAME`

// start the animation loop
raf = window.requestAnimationFrame(moveBalls);

console.log(balls);
