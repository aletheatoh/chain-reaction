`GLOBAL VARIABLES`

var balls = [];
var hitAreas = [];

var startGameButton = document.getElementById('start-game');
var instructionsButton = document.getElementById('instructions');
var container = document.getElementById('container');
var scoreBoard;
var ballsCaptured;
var header = document.querySelector('header');
var instructionsBox;

var level = 0;
var collisions = 0;
var collisions_expired = 0;
var running;

var canvas;
var ctx;

var counterPauseResume = 0;

`HELPER FUNCTIONS`

function pauseResumeGame() {
  // pause game
  if (counterPauseResume % 2 === 0) {
    clearInterval(running);
  }
  // resume game
  else if (counterPauseResume % 2 === 1) {
    running = setInterval(moveBalls, 30);
  }
  counterPauseResume++;
}

function modifyHomePage() {
  // modify home page to game play mode
  var buttons = document.querySelectorAll('button');
  var pause_or_resume = buttons[0];

  pause_or_resume.setAttribute('class', 'nav-bar');
  pause_or_resume.id = "pause-or-resume";
  pause_or_resume.innerText = "Pause/Resume Game";
  pause_or_resume.addEventListener('click', pauseResumeGame);
  var exitGame = buttons[1];
  exitGame.setAttribute('class', 'nav-bar');
  exitGame.id = "exit-game";
  exitGame.innerText = "Exit Game";

  var instructions = buttons[2];
  instructions.setAttribute('class', 'nav-bar');
  instructions.id = "instructions";
  instructions.innerText = "Instructions";
}

function instructions() {

  // blur out the background
  header.setAttribute('style', "-webkit-filter: blur(2px); -moz-filter: blur(2px); -o-filter: blur(2px); -ms-filter: blur(2px); filter: blur(2px);");
  var instructions = document.createElement('div');
  instructions.id = "instructions-box";
  var description = document.createElement('p');
  description.innerText = "Your goal is to place a bomb anywhere on the screen, and capture as many balls as possible. The longer the chain reaction you create, the more points you win!";

  instructions.appendChild(description);
  instructions.appendChild(startGameButton);
  document.body.appendChild(instructions);

  instructionsBox = document.getElementById('instructions-box');
}

instructionsButton.addEventListener('click', instructions);

function displayPlayerStats() {
  var level = document.createElement('div');
  level.setAttribute('class', 'player-stats');
  level.id = 'level';
  level.innerText = "Level ";
  container.appendChild(level);

  var score = document.createElement('div');
  score.setAttribute('class', 'player-stats');
  score.id = 'score';
  score.innerText = "Your Score: ";
  container.appendChild(score);

  var collisions = document.createElement('div');
  collisions.setAttribute('class', 'player-stats');
  collisions.id = 'collisions';
  collisions.innerText = "Balls Captured";

  // insert above canvas
  container.insertBefore(collisions, container.childNodes[0]);
  container.insertBefore(score, container.childNodes[0]);
  container.insertBefore(level, container.childNodes[0]);

  scoreBoard = document.getElementById('score');
  ballsCaptured = document.getElementById('collisions');
}

function ballColorGenerator() {
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

    // draw out the ball
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

'LOAD AND PLAY GAME'
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

startGameButton.addEventListener('click', loadGame);

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
  canvas.removeEventListener('click', addhitArea);
  canvas.removeEventListener('mousemove', placehitArea);
}

function loadGame() {
  header.setAttribute('style', "-webkit-filter: ''; -moz-filter: ''; -o-filter: ''; -ms-filter: ''; filter: '';");
  modifyHomePage();
  displayPlayerStats();
  startGame(10);
  // extract the canvas
  canvas = document.getElementById('myCanvas');
  ctx = canvas.getContext('2d');
  canvas.addEventListener('mousemove', placehitArea);
  canvas.addEventListener('click', addhitArea);
  startGameButton.removeEventListener('click',loadGame);
}
// start the game
function startGame(numBalls) {
    if (instructionsBox != null) {
      document.body.removeChild(instructionsBox);
    }
    myGameArea.start();
    for (var i=0;i<numBalls;i++) {
      addGamePiece = {
        x: Math.floor(Math.random() * 800),
        y: Math.floor(Math.random() * 500),
        color: ballColorGenerator(),
        vx: getRandomIntInclusive(-6, 6),
        vy: getRandomIntInclusive(-6, 6),
        radius: 10
      }
      balls.push(addGamePiece);
    }
    running = setInterval(moveBalls, 30);
}
