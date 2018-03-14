`HELPER FUNCTIONS`

// creates sound effect
function sound(src) {
  this.sound = document.createElement("audio");
  this.sound.src = src;
  this.sound.setAttribute("preload", "auto");
  this.sound.setAttribute("controls", "none");
  this.sound.style.display = "none";
  document.body.appendChild(this.sound);
  this.play = function() {
      this.sound.play();
    }
  this.stop = function() {
      this.sound.pause();
    }
  }

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
