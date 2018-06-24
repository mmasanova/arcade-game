Frogger - Arcade Game
===============================
An arcade game based on the classic Frogger game.

## How to run ##
Clone the repository and open the index.html file in one of the modern browsers that support ES6 syntax (polyfils for other browsers have not yet been included in the game). Such browsers include e.g. Chrome, Safari, Firefox.

Alternatively, play the game [here](https://mmasanova.github.io/arcade-game/).

## How to play the game ##

The aim of the game is to navigate the character across the road to water without colliding with any of the bugs.

Use the arrows to navigate the character.

Collect diamonds by navigating to the square where they appear to gain extra points.

### Levels ###

The game has three levels. With each level the difficulty increases. The level is displayed in top right corner of the game window.

### Points ###

Player receives 500 points when they successfully complete the level by crossing the water.
For any collision the player loses 150 points.
Collecting a diamond adds 100 extra points.

The points are displayed at the top of the screen.

### Obstacles ###

In level 2 and 3 player encounters rocks, which are obstacles that prevent player from using the square that they occupy.

### Winning ###

In order to win all three levels need to be completed. On completion of all levels the character makes some happy jumps and the player sees a popup informing them of winning. The popup informs about the player's final points' score. Once the player presses 'OK' on the popup the game is reset and starts again from level 1.

### Change Character ###

The button on the top left with title 'Change Character' can be used to change the look of the main character. There are 5 different options. To change the character, click the button and you will be presented with a popup. Use the arrows on the sides of the character to navigate to previous and next option. When you are happy with the look of your character press 'OK' and the selected character will appear as the main character.

## Future Enhancements ##

Add Babel for ES6 support accross more browsers
Refactor the code into single IFFE or modules

## Dependencies ##
ES6 https://developer.mozilla.org/en-US/docs/Web/JavaScript/New_in_JavaScript/ECMAScript_2015_support_in_Mozilla
