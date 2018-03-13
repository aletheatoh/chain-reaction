
window.onload = function() {

  // switch on/off music
  function musicOnOff() {
    if (counterMusic%2==0) {
      gameMusic.stop();
      musicOn = false;
    }
    else if (counterMusic%2==1) {
      gameMusic.play();
      musicOn = true;
    }
    counterMusic++;
  }

  // modify home page to game play mode
  function modifyHomePage() {
    // clear home page buttons
    while (navBar.firstChild) {
      navBar.removeChild(navBar.firstChild);
    }

    // pause/resume button
    var pause_or_resume = document.createElement('button');
    pause_or_resume.setAttribute('class', 'nav-bar');
    pause_or_resume.id = "pause-or-resume";
    pause_or_resume.innerText = "Pause/Resume Game";
    pause_or_resume.addEventListener('click', pauseResumeGame);
    navBar.appendChild(pause_or_resume);

    // instructions button
    var instructions_playMode = document.createElement('button');
    instructions_playMode.setAttribute('class', 'nav-bar');
    instructions_playMode.id = "instructions";
    instructions_playMode.innerText = "Instructions";
    instructions_playMode.addEventListener('click', instructions);
    navBar.appendChild(instructions_playMode);

    var exitGame = document.createElement('button');
    exitGame.setAttribute('class', 'nav-bar');
    exitGame.id = "exit-game";
    exitGame.innerText = "Exit Game";
    exitGame.addEventListener('click', function() {
      location.reload();
    });
    navBar.appendChild(exitGame);
  }

  // resumes game from instructions mode
  function resumeGame() {
    removeBlur(header);
    removeBlur(container);

    // game is over
    if (gameover) {
      canvas.removeEventListener('mousemove', placehitArea);
      canvas.removeEventListener('click', addhitArea);
    }
    else {
      running = setInterval(moveBalls, 30);
      canvas.addEventListener('mousemove', placehitArea);
      canvas.addEventListener('click', addhitArea);
    }
    document.body.removeChild(instructionsBox);
  }

  function pauseResumeGame() {
    // game is over
    if (gameover) {
      canvas.removeEventListener('mousemove', placehitArea);
      canvas.removeEventListener('click', addhitArea);
    }

    else {
      // pause game
      if (counterPauseResume % 2 === 0) {
        gamePaused = true;
        clearInterval(running);
        canvas.removeEventListener('mousemove', placehitArea);
        canvas.removeEventListener('click', addhitArea);
      }
      // resume game
      else if (counterPauseResume % 2 === 1) {
        gamePaused = false;
        running = setInterval(moveBalls, 30);
        canvas.addEventListener('mousemove', placehitArea);
        canvas.addEventListener('click', addhitArea);
      }
      counterPauseResume++;
    }
  }

  function instructions() {
    // blur out the background
    blurOut(header);

    var instructions = document.createElement('div');
    instructions.id = "instructions-box";
    instructionsBox = instructions;

    // add game description
    var description = document.createElement('div');
    description.id = "description";
    description.innerText = "Place the target anywhere on the screen, and capture as many balls as possible. The larger the chain reaction you create, the more points you win!";
    instructions.appendChild(description);

    if (running) {
      blurOut(container);
      clearInterval(running);
      canvas.removeEventListener('mousemove', placehitArea);
      canvas.removeEventListener('click', addhitArea);

      // add resume game button
      var resumeGameButton = document.createElement('button');
      resumeGameButton.innerText = "Resume Game";
      resumeGameButton.addEventListener('click',resumeGame);
      instructions.appendChild(resumeGameButton);
    }
    else {
      // create back button
      header.style.margin = "200px auto";
      var backButton = document.createElement('button');
      backButton.innerText = "Back";
      backButton.addEventListener('click', homePage);
      instructions.appendChild(backButton);

      // add start game button
      var startGameButtonCopy = startGameButton.cloneNode(true);
      instructions.appendChild(startGameButtonCopy);
      startGameButtonCopy.addEventListener('click',loadGame);
    }
    document.body.appendChild(instructions);
  }

  // home page
  function homePage() {
    removeBlur(header);
    removeBlur(document.body);

    if (instructionsBox != null && instructionsBox.parentNode != null) document.body.removeChild(instructionsBox);
    // remove nav bar
    while (navBar.firstChild) {
      navBar.removeChild(navBar.firstChild);
    }

    // remove credits
    if (creditsBox != null && creditsBox.parentNode != null) header.removeChild(creditsBox);

    // remove old player-stats bar
    var replace = document.querySelectorAll('.player-stats');
    for (var i=0; i<replace.length;i++) {
      container.removeChild(replace[i]);
    }

    // remove popup message
    var messages = document.querySelectorAll('#message');
    for (var i=0;i<messages.length;i++) {
      document.body.removeChild(messages[i]);
    }

    // rest background
    clearInterval(anotherRunning);
    context.clearRect(0,0, background.width, background.height);

    // create home page
    createHomePage();
  }

  function modifyNextLevel() {
    // remove old player-stats bar
    var replace = document.querySelectorAll('.player-stats');
    for (var i=0; i<replace.length;i++) {
      container.removeChild(replace[i]);
    }

    // remove popup message
    var messages = document.querySelectorAll('#message');
    for (var i=0;i<messages.length;i++) {
      document.body.removeChild(messages[i]);
    }

    // reload the game
    loadGame();
  }

  var proceedNextLevel = function() {
    if (!messageShown) {
      messageShown = true;
      // create popup message
      var message = document.createElement('div');
      message.id = "message";

      var text = document.createElement('div');
      text.id = "proceed-next-level-text";

      // if passed round, proceed to next level
      if ( (collisions-1) >= passLevel[levelNum-1]) {
        passed = true;
        gameover = true;

        // completed all levels
        if (levelNum === 5) {
          if (musicOn) {
            var winSound = new sound("sound-effects/Cheering-SoundBible.com-1115515042.mp3");
            winSound.play();
          }
          message.style.height = "115px";
          text.innerText = "Congratulations, you made it through all 5 levels! Wanna play again?";
          message.appendChild(text);
          var yes = document.createElement('button');
          yes.innerText = "Play Again";
          yes.addEventListener('click', function() {
            levelNum = 0;
            homePage();
            loadGame();
          });
          message.appendChild(yes);
        }
        else {
          // advance to the next level

          // play sound
          if (musicOn) {
            var winSound = new sound("sound-effects/Cheering-SoundBible.com-1115515042.mp3");
            winSound.play();
          }
          text.innerText = "Well Done! Advance to Level " + (levelNum+1) + "?";
          message.appendChild(text);
          var yes = document.createElement('button');
          yes.innerText = "Next Level";
          // have to wait for everything to load first
          yes.addEventListener('click', function() {
            homePage();
            loadGame();
          });
          message.appendChild(yes);
        }
      }
      // if did not pass round, ask if try again
      else {
        if (musicOn) {
          var loseSound = new sound("sound-effects/Crowd Boo 3-SoundBible.com-595364990.mp3");
          loseSound.play();
        }
        passed = false;
        text.innerText = "Failed to pass Level " + levelNum + ". Try again?";
        message.appendChild(text);
        var try_again = document.createElement('button');
        try_again.innerText = "Try Again";
        try_again.addEventListener('click', function() {
          homePage();
          loadGame();
        });
        message.appendChild(try_again);
      }

      var no = document.createElement('button');
      no.innerText = "Exit Game";
      no.addEventListener('click', function() {
        location.reload();
      });
      message.appendChild(no);

      setTimeout(function() {
        document.body.appendChild(message);
      }, 700);
    }
  }

  function displayPlayerStats() {
    var level = document.createElement('div');
    level.setAttribute('class', 'player-stats');
    level.id = 'level';
    level.innerText = "Level " + levelNum;
    // level.style.fontWeight = "bold";
    container.appendChild(level);

    var score = document.createElement('div');
    score.setAttribute('class', 'player-stats');
    score.id = 'score';
    score.innerText = "Your score: 0";
    container.appendChild(score);

    var collisions = document.createElement('div');
    collisions.setAttribute('class', 'player-stats');
    collisions.id = 'collisions';
    collisions.innerText = "Balls Captured: 0";

    // insert above canvas
    container.insertBefore(collisions, container.childNodes[0]);
    container.insertBefore(score, container.childNodes[0]);
    container.insertBefore(level, container.childNodes[0]);

    scoreBoard = document.getElementById('score');
    ballsCaptured = document.getElementById('collisions');
  }

  // `animation functions`
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
            var popSound = new sound("sound-effects/Bounce-SoundBible.com-12678623.mp3");
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
          var hitSound = new sound("sound-effects/Blop-Mark_DiAngelo-79054334.mp3");
          hitSound.play();
        }
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
    // ctx.beginPath();
    // ctx.arc(mouseX, mouseY, 30, 0, Math.PI * 2);
    // ctx.closePath();
    // ctx.fillStyle = 'rgba(127, 255, 0, 0.6)';
    // ctx.fill();
    var img = document.querySelector('#target');
    ctx.drawImage(img, mouseX, mouseY, 30, 30);

  }

  'LOAD AND PLAY GAME'

  var myGameArea = {
    // function to create canvas and start the game
    canvas : document.createElement("canvas"),
    start : function() {
      this.canvas.width = 800;
      this.canvas.height = 450;
      this.canvas.id = "myCanvas";
      this.context = this.canvas.getContext("2d");
      // add to the bounding box
      var bounding_box = document.querySelector("#bounding-box");
      bounding_box.appendChild(this.canvas);
    }
  }

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

  function createHomePage() {
    header.style.margin = "200px auto 10px auto";
    header.style.height = "140px";
    var button1 = document.createElement('button');
    button1.id = "start-game";
    button1.innerText = "Start Game";
    startGameButton = button1;
    navBar.appendChild(startGameButton);
    startGameButton.addEventListener('click', loadGame);

    var button2 = document.createElement('button');
    button2.id = "instructions";
    button2.innerText = "Instructions";
    instructionsButton = button2;
    navBar.appendChild(instructionsButton);
    instructionsButton.addEventListener('click', instructions);

    var button3 = document.createElement('button');
    button3.id = "music";
    button3.innerText = "Music On/Off";
    musicButton = button3;
    navBar.appendChild(musicButton);
    musicButton.addEventListener('click',musicOnOff);

    var credits = document.createElement('div');
    creditsBox = credits;
    credits.id = "credits";
    credits.innerText = "Created by Alethea Toh";
    header.appendChild(credits);

    background = document.createElement('canvas');
    background.width = "1200";
    background.height = "800";
    background.id = "background";
    document.body.insertBefore(background,header);

    context = background.getContext('2d');
    context.clearRect(0,0, background.width, background.height);

    createBallsModified(50);
    anotherRunning = setInterval(moveBallsModified, 30);
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

  function drawBallModified(ball) {
    context.beginPath();
    context.arc(ball.x, ball.y, ball.radius, 0, Math.PI * 2);
    context.closePath();
    context.fillStyle = ball.color;
    context.fill();
  }

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

  function loadGame() {

    clearInterval(anotherRunning);

    // remove background
    if (background != null) document.body.removeChild(background);

    if (instructionsBox != null && instructionsBox.parentNode != null) {
      document.body.removeChild(instructionsBox);
    }

    // remove credits
    if (creditsBox != null && creditsBox.parentNode != null) header.removeChild(creditsBox);

    // remove github ad
    var github = document.querySelector('#github');
    if (github != null) document.body.removeChild(github);

    if (passed) {
      levelNum++; // increment level
      passed = false;
    }

    // reset variables
    balls = [];
    hitAreas = [];
    messageShown = false;
    gameover = false;
    collisions = 0;
    collisions_expired = 0;
    // remove all blur effects

    removeBlur(header);
    removeBlur(container);
    modifyHomePage();

    header.style.margin = "0 auto";
    myGameArea.start(); // create the canvas
    createBalls(levelNumBalls[levelNum-1]);

    // start the game
    // get the corresponding # of balls to the level number
    levelPrompt();
  }
//
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

  function levelPrompt() {
    // blur out background
    blurOut(header);
    blurOut(container);

    // add message
    var prompt = document.createElement('div');
    prompt.id = "level-prompt";
    levelPromptDiv = prompt;
    var levelNumHeading = document.createElement('div');
    levelNumHeading.id = "level-num-heading";
    levelNumHeading.innerText = "Level " + levelNum;
    levelNumHeading.style.fontWeight = "bold";

    prompt.appendChild(levelNumHeading);
    var text = document.createElement('div');
    text.innerText = "Capture " + passLevel[levelNum-1] + " out of " + levelNumBalls[levelNum-1] + " balls!";
    text.id = "level-prompt-text";
    prompt.appendChild(text);

    document.body.appendChild(prompt);

    var startLevel = document.createElement('button');
    startLevel.innerText = "Start Game";
    prompt.appendChild(startLevel);
    startLevelButton = startLevel;

    startLevelButton.addEventListener('click',startGame);
  }

  // start the game
  function startGame() {
    // remove blur effects
    removeBlur(header);
    removeBlur(container);

    // remove level levelPrompt
    if (levelPromptDiv != null) document.body.removeChild(levelPromptDiv);

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

  if (musicOn) {
    gameMusic = new sound('sound-effects/Bubbles-SoundBible.com-810959520.mp3');
    gameMusic.loop = true;
    gameMusic.play();
  }

  function test() {
    var img1 = new Image();
    img1.src = 'img/Target-icon.png';
    context.drawImage(img1, 0, 0);
    //draw a box over the top
    context.fillStyle = "rgba(200, 0, 0, 0.5)";
    context.fillRect(0, 0, 500, 500);
    img1.onload = function () {
    //draw background image
    context.drawImage(img1, 0, 0);
    //draw a box over the top
    context.fillStyle = "rgba(200, 0, 0, 0.5)";
    context.fillRect(0, 0, 500, 500);
    };
  }

  createHomePage();


}
