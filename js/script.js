function createBalls(numBalls) {
  for (var i=0;i<numBalls;i++) {
    addGamePiece = {
      x: Math.floor(Math.random() * 800),
      y: Math.floor(Math.random() * 450),
      color: ballColorGenerator(),
      vx: getRandomIntInclusive(-6, 6),
      vy: getRandomIntInclusive(-6, 6),
      radius: 10
    }
    balls.push(addGamePiece);
  }
}

// animation functions
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
  if (ctx != null) ctx.clearRect(0,0, canvas.width, canvas.height);

  if (canvas != null) {
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
}

// ball functions for the homepage canvas

function createBallsModified(numBalls) {
  for (var i=0;i<numBalls;i++) {
    addGamePiece = {
      x: Math.floor(Math.random() * 800),
      y: Math.floor(Math.random() * 450),
      color: ballColorGenerator(),
      vx: getRandomIntInclusive(-6, 6),
      vy: getRandomIntInclusive(-6, 6),
      radius: 10
    }
    backgroundBalls.push(addGamePiece);
  }
}

function drawBallModified(ball) {
  context.beginPath();
  context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
  context.closePath();
  context.fillStyle = ball.color;
  context.fill();
}

// add motion to the ball
function moveBallsModified() {
  context.clearRect(0,0, background.width, background.height);
  // update coordinates of balls
  for (var i=0;i<backgroundBalls.length;i++) {
    var ball = backgroundBalls[i];
    ball.x += ball.vx;
    ball.y += ball.vy;
    // keep the ball within the bounding box
    if (ball.y + ball.vy > background.height || ball.y + ball.vy < 0) {
      ball.vy = -ball.vy;
    }
    if (ball.x + ball.vx > background.width || ball.x + ball.vx < 0) {
      ball.vx = -ball.vx;
    }
    // draw out the ball
    drawBallModified(ball);
  }
}

function makeHitAreas() {
  // if no more hit areas, GAME OVER
  if (collisions != 0 && collisions_expired === collisions) {
    clearInterval(running);
    proceedNextLevel();
  }

  else {
    for (var i=0;i<hitAreas.length;i++) {
      var hitArea = hitAreas[i];

      if (hitArea.radius === 50.0) {
        hitArea.sizeInt = -.5;
      }
      if (hitArea.radius < 30) {
        collisions_expired++;
        hitAreas.splice(i, 1);
        if (musicOn) {
          var popSound = new Audio("sound-effects/Bounce-SoundBible.com-12678623.mp3");
          popSound.play();
        }
      }
      else {
        hitArea.radius += hitArea.sizeInt;
        drawBall(hitArea); // update size of hit area
        checkCollision(); // check if any of the balls have collided with the hit area
      }
    }
  }
}

// check if each ball is in any of the hit areas
function checkCollision() {
  for (var j=0; j<balls.length;j++) {
    var ball = balls[j];
    // if collision has occured
    if (ctx.isPointInPath(ball.x, ball.y)) {
      if (musicOn) {
        var hitSound = new Audio("sound-effects/Blop-Mark_DiAngelo-79054334.mp3");
        hitSound.play();
      }
      // update score
      collisions++;
      // update total score
      addScoreDiv.innerText = "+ " + (collisions-1)*10;
      roundScore += (collisions-1)*10;
      // update level score
      scoreBoard.innerText = "Level score: " + roundScore;
      // update total score
      totalScore += (collisions-1)*10;
      totalScoreBoard.innerText = "Total score: " + totalScore;
      // update balls captured
      ballsCaptured.innerText = "Balls captured: " + (collisions-1);
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

'LOAD AND PLAY GAME'

var placehitArea = function(e) {
  // calculate the current mouse position relative to the canvas
  // using e.client and the offsets
  var mouseX = e.clientX - canvas.offsetLeft;
  var mouseY = e.clientY - canvas.offsetTop;

  ctx = myGameArea.context;
  var img = document.querySelector('#target');
  ctx.drawImage(img, mouseX-15, mouseY-15, 30, 30);
}

var myGameArea = {
  // function to create canvas and start the game
  canvas : document.createElement("canvas"),
  start : function() {
    this.canvas.width = 800;
    this.canvas.height = 450;

    // resize canvas for mobile play
    if (window.innerWidth <= 981) {
      this.canvas.width = 820;
      this.canvas.height = 820;
    }

    this.canvas.id = "myCanvas";
    this.context = this.canvas.getContext("2d");
    // add to the bounding box
    var bounding_box = document.querySelector("#bounding-box");
    bounding_box.appendChild(this.canvas);
  }
}

var addhitArea = function(e) {
  hitAreaPlaced = true;
  var mouseX = e.clientX - canvas.offsetLeft;
  var mouseY = e.clientY - canvas.offsetTop;

  var newHitArea = {
    x: mouseX,
    y: mouseY,
    color: 'rgb(255, 69, 0)',
    sizeInt: 0.5,
    radius: 30
  };
  hitAreas.push(newHitArea);
  collisions++;
  canvas.removeEventListener('click', addhitArea);
  canvas.removeEventListener('mousemove', placehitArea);
}

function loadGame() {
  addScoreDiv.innerText = "";

  clearInterval(anotherRunning);

  // remove background
  if (background != null) document.body.removeChild(background);

  if (instructionsBox != null && instructionsBox.parentNode != null) {
    document.body.removeChild(instructionsBox);
  }

  // remove credits
  if (creditsBox != null && creditsBox.parentNode != null) header.removeChild(creditsBox);

  // remove github ad
  var github_div = document.querySelector('#github');
  if (github_div != null) content.removeChild(github_div);

  if (passed) {
    levelNum++; // increment level
    passed = false;
  }

  // reset variables
  hitAreaPlaced = false;
  balls = [];
  hitAreas = [];
  roundScore = 0;
  messageShown = false;
  gameover = false;
  collisions = 0;
  collisions_expired = 0;

  // remove all blur effects
  if (header != null) removeBlur(header);
  if (container != null) removeBlur(container);
  modifyHomePage();

  header.style.margin = "0 auto";

  myGameArea.start(); // create the canvas
  createBalls(levelNumBalls[levelNum-1]);

  // start the game
  // get the corresponding # of balls to the level number
  levelPrompt();
}

// start the game
function startGame() {

  if (window.innerWidth <= 981) {
    gameMusic.pause();
  }
  // remove blur effects
  if (header != null) removeBlur(header);
  if (container != null) removeBlur(container);
  clearInterval(running);

  // remove level levelPrompt
  if (levelPromptShown) document.body.removeChild(levelPromptDiv);
  levelPromptShown = false;

  if (exitGameBox != null && exitGameBox.parentNode != null) document.body.removeChild(exitGameBox);

  // extract the canvas
  canvas = document.getElementById('myCanvas');
  ctx = canvas.getContext('2d');

  canvas.addEventListener('mousemove', placehitArea);
  canvas.addEventListener('click', addhitArea);

  running = setInterval(moveBalls, 30);

  // load player stats
  displayPlayerStats();

  // remove eventlistners
  if (instructionsBox != null && instructionsBox.parentNode != null) {
    document.body.removeChild(instructionsBox);
  }

  startGameButton.removeEventListener('click',loadGame);
  startLevelButton.removeEventListener('click',startGame);
}

`TIME TO LOAD EVERYTHING!!!`

document.addEventListener('DOMContentLoaded',function(){
  window.onload = function() {

    if (musicOn) {
      gameMusic = new Audio('sound-effects/Bubbles-SoundBible.com-810959520.mp3');
      gameMusic.autoplay = true;
      gameMusic.loop = true;
      gameMusic.play();
    }

    createHomePage();
  }
});
