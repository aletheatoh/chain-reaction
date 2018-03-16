## Project Post Mortem
Post mortems are important to understand about what happened in a project and actively think about what you learned.

Post-mortems are meant to be a blame-less space open to objective conversation about what went well and what could be improved.

Even in the examples below, where tens of millions of dollars could be lost, the best approach is to think through the series of events that led to the outcome.

Large mistakes are almost never the fault of the developer, but of the systems and processes in place to prevent errors and problems.

[https://github.com/danluu/post-mortems](https://github.com/danluu/post-mortems)
https://blog.codinghorror.com/the-project-postmortem/

### What to Bring
Please answer the following questions. Take at least 30 minutes to prepare.

#### Approach and Process

1. What in my process and approach to this project would I do differently next time?
       - I would organize my code better into different files instead of just writing everything in one gigantic script


1. What in my process and approach to this project went well that I would repeat next time?
- I thought I approached the planning and development of my web game well. During the planning stage, I detailed my wireframes, user stories and key features I would include in my game on pen and paper. This gave me a clearer picture of how I wanted my game to turn out, and allowed me to clearly define the goals of my game.

--

#### Code and Code Design

1. What in my code and program design in the project would I do differently next time?
- Instead of constantly adding and removing divs, I could perhaps change my program such that I would add divs to my html code from the start, and just change the display settings (ie. "none") based on whether I want it to appear or not.

1. What in my code and program design in the project went well? Is there anything I would do the same next time?

- I felt that I did a good job of separating my code into different functions, which made it useful for calling functions repeatedly.

- I felt I did a good job of utilizing global variables. This eliminated many lines of unnecessary code whereby I would otherwise have to repeatedly find the respective document elements.
```
// DOCUMENT ELEMENTS
var navBar = document.querySelector('nav');
var container = document.getElementById('container');
var header = document.querySelector('#header');
var boundingBox = document.querySelector('#bounding-box');
var content = document.querySelector('#content');

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
var passLevel = [1,3,8,15,40];
```

- I felt I did a good job of preventing null pointer exceptions.
```
if (instructionsBox != null && instructionsBox.parentNode != null) document.body.removeChild(instructionsBox);

if (exitGameBox != null && exitGameBox.parentNode != null) document.body.removeChild(exitGameBox);
```

  For each, please include code examples.
  1. Code snippet up to 20 lines.
  2. Code design documents or architecture drawings / diagrams.
