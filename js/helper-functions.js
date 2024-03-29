`HELPER FUNCTIONS`

// generates solid colors for the balls
function ballColorGenerator() {
  var r = Math.floor(Math.random() * 255);
  var g = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);
  return "rgb(" + r + "," + g + "," + b + ")";
}

// generates colors with transparencies
function dynamicColors() {
  var r = Math.floor(Math.random() * 255);
  var g = Math.floor(Math.random() * 255);
  var b = Math.floor(Math.random() * 255);
  return "rgba(" + r + "," + g + "," + b + "," + 0.7 + ")";
}

// generates random integer in a range (inclusive)
function getRandomIntInclusive(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  res = Math.floor(Math.random() * (max - min + 1)) + min;
  while (res === 0) {
    min = Math.ceil(min);
    max = Math.floor(max);
    res = Math.floor(Math.random() * (max - min + 1)) + min;
  }
  return res;
}

// blur out a document element
function blurOut(docElement) {
  docElement.setAttribute('style', "-webkit-filter: blur(2px); -moz-filter: blur(2px); -o-filter: blur(2px); -ms-filter: blur(2px); filter: blur(2px);");
}

// remove blur effect on a document element
function removeBlur(docElement) {
  docElement.setAttribute('style', "-webkit-filter: ''; -moz-filter: ''; -o-filter: ''; -ms-filter: ''; filter: '';");
}

// switch on/off music
function musicOnOff() {
  if (counterMusic%2==0) {
    gameMusic.pause();
    musicOn = false;
  }
  else if (counterMusic%2==1) {
    gameMusic.play();
    musicOn = true;
  }
  counterMusic++;
}
