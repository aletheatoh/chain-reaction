`GLOBAL VARIABLES`

// `DOCUMENT ELEMENTS`
var navBar = document.querySelector('nav');
var container = document.getElementById('container');
var header = document.querySelector('#header');
var boundingBox = document.querySelector('#bounding-box');

// for background
var backgroundBalls = [];
var background;
var context;
var anotherRunning; // set interval turn on/off

// 'Created by Alethea' - only shown on home page
var creditsBox;

// level num and corresponding # of balls + passing bar
var levelNum = 0;
var levelNumBalls = [5,10,20,30,50];
var passLevel = [1,3,8,15,35];

// home page buttons
var startGameButton;
var instructionsButton;
var musicButton;

// canvas for playing mode
var canvas;
var ctx;
var running; // setInterval turn on/off
var balls = [];
var hitAreas = [];
var totalScore = 0; // score for all levels
var roundScore = 0; // score for a given round

// player stats div
var scoreBoard;
var totalScoreBoard;
var ballsCaptured;

// global variables for playing mode
var startLevelButton;
var exitGameButton;

// popup boxes
var levelPromptDiv;
var instructionsBox;
var exitGameBox;

// other global variables
var collisions = 0; // score for each round
var collisions_expired = 0;
var passed = true;
var counterMusic = 0;
var gameMusic;
var musicOn = true;
var hitAreaPlaced = false;
var messageShown = false;
var gameover = false;
var levelPromptShown = false;
var counterPauseResume = 0;