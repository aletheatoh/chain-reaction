`GLOBAL VARIABLES`

var balls = [];
var hitAreas = [];
var scoreBoard = document.getElementById('score');
var ballsCaptured = document.getElementById('collisions');
var collisions = 0;
var collisions_expired = 0;
var running;
`HELPER FUNCTIONS`

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}

function dynamicColors() {
    var r = Math.floor(Math.random() * 255);
    var g = Math.floor(Math.random() * 255);
    var b = Math.floor(Math.random() * 255);
    return "rgba(" + r + "," + g + "," + b + "," + 0.5 + ")";
};

function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  res = Math.floor(Math.random() * (max - min + 1)) + min;
  if (res != 0) return res;
  else return 3;
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

// start the game
function startGame(numBalls) {
    myGameArea.start();
    for (var i=0;i<numBalls;i++) {
      addGamePiece = {
        x: Math.floor(Math.random() * 800),
        y: Math.floor(Math.random() * 500),
        color: getRandomColor(),
        vx: getRandomIntInclusive(-6, 6),
        vy: getRandomIntInclusive(-6, 6),
        radius: 10
      }
      balls.push(addGamePiece);
    }
}

// draw a ball onto the canvas
function drawBall(ball) {
  ctx = myGameArea.context;
  ctx.beginPath();
  ctx.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fillStyle = ball.color;
  ctx.fill();
}

// add motion to the ball
var counter = 0;
function moveBalls() {

  ctx.clearRect(0,0, canvas.width, canvas.height);

  // update coordinates of balls
  for (var i=0;i<balls.length;i++) {
    var ball = balls[i];

    ball.x += ball.vx;
    ball.y += ball.vy;

    // keep the ball within the bounding box
    if (ball.y + ball.vy > canvas.height || ball.y + ball.vy < 0) {
    ball.vy = -ball.vy;
    }
    if (ball.x + ball.vx > canvas.width || ball.x + ball.vx < 0) {
      ball.vx = -ball.vx;
    }

    drawBall(ball);
  }

  // draw out the hit areas
  makeHitAreas();
}

function makeHitAreas() {

  // if no more hit areas, GAME OVER
  setTimeout(function(){

    if (collisions != 0 && collisions_expired === collisions) {
      // stop the game
      clearInterval(running);

      // create popup message
      var message = document.createElement('div');
      message.id = "message";
      var text = document.createElement('div');
      text.innerText = "You win!";
      var button = document.createElement('button');
      button.innerText = "hi";
      message.appendChild(text);
      message.appendChild(button);
      document.body.appendChild(message);
    }
  }, 5000);

  for (var i=0;i<hitAreas.length;i++) {
    var hitArea = hitAreas[i];

    if (hitArea.radius === 50.0) {
		    hitArea.sizeInt = -.5;
  	}
  	if (hitArea.radius < 30) {
      collisions_expired++;
  		hitAreas.splice(i, 1);
  	}
    else {
      hitArea.radius += hitArea.sizeInt;
      drawBall(hitArea); // update size of hit area
      checkCollision(); // check if any of the balls have collided with the hit area
    }
  }
}

// check if each ball is in any of the hit areas
function checkCollision() {
  for (var j=0; j<balls.length;j++) {
    var ball = balls[j];

    // if collision has occured
    if (ctx.isPointInPath(ball.x, ball.y)) {

      // update score
      collisions++;
      scoreBoard.innerText = "Your score: " + (collisions-1);
      ballsCaptured.innerText = "Balls Captured: " + (collisions-1);
      // create another hit area
      var addhitArea = {
        x: ball.x,
        y: ball.y,
        color: dynamicColors(),
        sizeInt: 0.5,
        radius: 30
      };
      // add to hitAreas[] array
      hitAreas.push(addhitArea);
      // remove ball from array
      balls.splice(j, 1);
    }
  }
}

var placehitArea = function(e) {
  // calculate the current mouse position relative to the canvas
  // using e.client and the offsets
  var mouseX = e.clientX - canvas.offsetLeft;
	var mouseY = e.clientY - canvas.offsetTop;

  ctx = myGameArea.context;
  ctx.beginPath();
  ctx.arc(mouseX, mouseY, 30, 0, Math.PI * 2);
  ctx.closePath();
  ctx.fillStyle = 'rgba(127, 255, 0, 0.6)';
  ctx.fill();
}

startGame(20);

// extract the canvas
var canvas = document.getElementById('myCanvas');
var ctx = canvas.getContext('2d');

canvas.addEventListener('mousemove', placehitArea);

var addhitArea = function(e) {
  var mouseX = e.clientX - canvas.offsetLeft;
	var mouseY = e.clientY - canvas.offsetTop;

  var newHitArea = {
    x: mouseX,
    y: mouseY,
    color: 'rgba(127, 255, 0, 0.6)',
    sizeInt: 0.5,
    radius: 30
  };

  hitAreas.push(newHitArea);
  collisions++;
  console.log(hitAreas);
  canvas.removeEventListener('click', addhitArea);
  canvas.removeEventListener('mousemove', placehitArea);
}

canvas.addEventListener('click', addhitArea);

`LOAD AND PLAY THE GAME`

running = setInterval(moveBalls, 30);
