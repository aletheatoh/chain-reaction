// home page
function homePage() {
  if (header != null) removeBlur(header);
  if (document.body != null) removeBlur(document.body);

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

function createHomePage() {
  header.style.margin = "200px auto 10px auto";
  header.style.height = "140px";

  // brute force responsize design
  if (window.innerWidth <= 981) {
    header.style.margin = "600px auto 10px auto";
    header.style.height = "180px";
    header.style.width = "600px";
  }

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
  musicButton.addEventListener('click', musicOnOff);

  var credits = document.createElement('div');
  creditsBox = credits;
  credits.id = "credits";
  credits.innerText = "Created by Alethea Toh";
  header.appendChild(credits);

  background = document.createElement('canvas');
  background.width = window.innerWidth;
  background.height = window.innerHeight;
  background.id = "background";
  // document.body.insertBefore(background,header);
  document.body.insertBefore(background,content);

  context = background.getContext('2d');
  context.clearRect(0,0, background.width, background.height);

  if (window.innerWidth <= 981) createBallsModified(100);
  else createBallsModified(50);
  anotherRunning = setInterval(moveBallsModified, 30);

  console.log(window.innerWidth);
  console.log(window.innerHeight);
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
  exitGame.addEventListener('click', sureExit);
  exitGameButton = exitGame;
  navBar.appendChild(exitGame);
}

function instructions() {
  // blur out the background
  if (header != null) blurOut(header);

  var instructions = document.createElement('div');
  instructions.id = "instructions-box";
  instructionsBox = instructions;

  // add game description
  var description = document.createElement('div');
  description.id = "description";
  description.innerText = "Place the target anywhere on the screen, and capture as many balls as possible. The larger the chain reaction you create, the more points you win!";
  instructions.appendChild(description);

  var demodiv = document.createElement('div');
  demodiv.id = "demodiv";
  var demo = document.createElement('video');
  demo.id = "demo";
  demo.setAttribute('src', 'media/demo.mov');
  demodiv.appendChild(demo);
  instructions.appendChild(demodiv);
  demo.autoplay = true;
  demo.load();

  if (running || levelNum === 1) {
    if (container != null) blurOut(container);
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

// resumes game from instructions mode
function resumeGame() {
  clearInterval(running);
  if (header != null) removeBlur(header);
  if (container != null) removeBlur(container);

  // game is over
  if (gameover) {
    clearInterval(running);
    canvas.removeEventListener('mousemove', placehitArea);
    canvas.removeEventListener('click', addhitArea);
  }
  else {
    canvas.addEventListener('mousemove', placehitArea);
    canvas.addEventListener('click', addhitArea);
  }

  if (!levelPromptShown) running = setInterval(moveBalls, 30);

  if (instructionsBox != null && instructionsBox.parentNode != null) document.body.removeChild(instructionsBox);

  if (exitGameBox != null && exitGameBox.parentNode != null) document.body.removeChild(exitGameBox);
}

function pauseResumeGame() {
  clearInterval(running);
  // game is over
  if (gameover) {
    clearInterval(running);
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
      console.log(levelPromptDiv);
      running = setInterval(moveBalls, 30);
      canvas.addEventListener('mousemove', placehitArea);
      canvas.addEventListener('click', addhitArea);
    }
    counterPauseResume++;
  }
}

function levelPrompt() {
  // blur out background
  levelPromptShown = true;
  if (header != null) blurOut(header);
  if (container!= null) blurOut(container);

  // add message
  var prompt = document.createElement('div');
  prompt.id = "level-prompt";
  levelPromptDiv = prompt;
  var levelNumHeading = document.createElement('div');
  levelNumHeading.id = "level-num-heading";
  levelNumHeading.innerText = "Level " + levelNum;

  prompt.appendChild(levelNumHeading);
  var text = document.createElement('div');
  text.innerText = "Capture at least " + passLevel[levelNum-1] + " out of " + levelNumBalls[levelNum-1] + " balls!";
  text.id = "level-prompt-text";
  prompt.appendChild(text);

  document.body.appendChild(prompt);

  var startLevel = document.createElement('button');
  startLevel.innerText = "Start Game";
  prompt.appendChild(startLevel);
  startLevelButton = startLevel;

  startLevelButton.addEventListener('click',startGame);
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
    if (header != null) blurOut(header);
    if (container != null) blurOut(container);
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
        text.innerText = "Congratulations, you made it through all 5 levels! Your total score is " + totalScore + ". Wanna play again?";
        message.style.height = "135px";

        // brute force browser resize
        if (window.innerWidth <= 981) {
          message.style.height = "165px";
          message.style.width = "350px";
        }
        message.appendChild(text);
        var yes = document.createElement('button');
        yes.innerText = "Play Again";
        yes.addEventListener('click', function() {
          // reser variables to 0
          levelNum = 0;
          totalScore = 0;
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
  scoreBoard = score;
  score.innerText = "Level score: " + roundScore;
  container.appendChild(score);

  var score_all_levels = document.createElement('div');
  score_all_levels.setAttribute('class', 'player-stats');
  score_all_levels.id = 'score-all-levels';
  totalScoreBoard = score_all_levels;
  score_all_levels.innerText = "Total score: " + totalScore;
  container.appendChild(score_all_levels);

  var collisions = document.createElement('div');
  collisions.setAttribute('class', 'player-stats');
  collisions.id = 'collisions';
  ballsCaptured = collisions;
  collisions.innerText = "Balls captured: 0";

  // insert above canvas
  container.insertBefore(collisions, container.childNodes[0]);
  container.insertBefore(score_all_levels, container.childNodes[0]);
  container.insertBefore(score, container.childNodes[0]);
  container.insertBefore(level, container.childNodes[0]);
}

// ask player if he/she really wants to exit the game
function sureExit() {
  // blur out the background
  if (header != null) blurOut(header);
  if (container != null) blurOut(container);
  clearInterval(running);

  if (canvas != null) {
    canvas.removeEventListener('mousemove', placehitArea);
    canvas.removeEventListener('click', addhitArea);
  }
  var exitGameDiv = document.createElement('div');
  exitGameDiv.id = "exit-game-box";
  exitGameBox = exitGameDiv;

  var ask = document.createElement('div');
  ask.id = "exit-game-ask";
  ask.innerText = "Are you sure you want to quit?";
  exitGameBox.appendChild(ask);

  // add resume game button
  var resumeGameButton = document.createElement('button');
  resumeGameButton.innerText = "Resume Game";
  resumeGameButton.addEventListener('click',function(){
    if (levelPromptDiv !== null && levelPromptDiv.parentNode != null) {
      document.body.removeChild(levelPromptDiv);
      levelPrompt();
    }
    else resumeGame();
  });
  exitGameBox.appendChild(resumeGameButton);

  // add exit game button
  var exitGame = document.createElement('button');
  exitGame.innerText = "Exit Game";
  exitGame.addEventListener('click', function() {
    location.reload();
  });
  exitGameBox.appendChild(exitGame);

  document.body.appendChild(exitGameBox);
}
