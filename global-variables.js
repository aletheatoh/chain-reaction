`GLOBAL VARIABLES`

// `DOCUMENT ELEMENTS`
var navBar = document.querySelector('nav');
var container = document.getElementById('container');
var header = document.querySelector('#header');
var boundingBox = document.querySelector('#bounding-box');

// home page buttons
var startGameButton;
var instructionsButton;
var musicButton;

// container: contains 1) player stats, and 2) canvas
var scoreBoard;
var ballsCaptured;
var instructionsBox;
var creditsBox;

// global variables for playing mode
var startLevelButton;
var levelPromptDiv;
var passed = true;
var musicOn = true;

// for background
var backgroundBalls = [];
var background;
var context;

var levelNumBalls = [5,10,20,30,50];
var passLevel = [1,3,8,15,35];
// var passLevel = [1,1,1,1,1];
// need to reset each round
var balls = [];
var hitAreas = [];
var levelNum = 0;
var collisions = 0;
var collisions_expired = 0;
var running;
var messageShown = false;
var gameover = false;

var canvas;
var ctx;

var counterPauseResume = 0;
var counterMusic = 0;
var gameMusic;
var anotherRunning;
