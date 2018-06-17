// Enemies our player must avoid
class Enemy {
    // Variables applied to each of our instances go here,
    // we've provided one for you to get started

    constructor() {
        // The image/sprite for our enemies, this uses
        // a helper we've provided to easily load images
        this.sprite = 'images/enemy-bug.png';
        this.width = 99;
        this.padding = 1;
        this.setSpeed();
        this.setPosition(true);
    }

    // Update the enemy's position, required method for game
    // Parameter: dt, a time delta between ticks
    update(dt) {
        // You should multiply any movement by the dt parameter
        // which will ensure the game runs at the same speed for
        // all computers.
        this.x = this.x + (this.speed * dt);

        if (this.x > ctx.canvas.clientWidth) this.reset();
    }

    // Draw the enemy on the screen, required method for game
    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
        this.detectCollision();
    }

    /**
    * @description Resets enemy's position and speed
    */
    reset() {
        this.setSpeed();
        this.setPosition();
    }

    /**
    * @description Sets enemy's speed to a new random speed
    */
    setSpeed() {
        this.speed = Math.floor(Math.random() * 301) + 150;
    }

    /**
    * @description Sets enemy's position to a new random unique position
    * @param {boolean} setInitialPosition - enemy is being initialised, the x position needs to be random and unique
    */
    setPosition(setInitialPosition = false) {
        let positionFound = false;
        let position;

        while (!positionFound) {
            let x;
            const row = Math.floor(Math.random() * 3) + 1;
            const y = (row * gameProperties.CELL_HEIGHT) - gameProperties.SPRITE_PADDING;

            if (setInitialPosition) {
                const col = Math.floor(Math.random() * 4);
                x = col * gameProperties.CELL_WIDTH;
            } else {
                x = -gameProperties.CELL_WIDTH;
            }

            const existingPosition = allEnemies.find((enemy) => enemy.x === x && enemy.y === y);

            if (existingPosition === undefined) {
                this.x = x;
                this.y = y;
                positionFound = true;
            }
        }
    }

    /**
    * @description Detects collisions between enemies and player
    */
    detectCollision() {
        const OVERLAP_TOLERANCE = 4;
        const minX = player.x + player.padding + OVERLAP_TOLERANCE;
        const maxX = player.x + player.padding + player.width - OVERLAP_TOLERANCE;
        const thisRight = this.x + this.padding + this.width;
        const thisLeft = this.x;

        if (this.y === player.y) {
            let collision = false;

            // enemy's nose touched player
            if (thisRight >= minX && thisRight <= maxX) {
                collision = true;
            }

            // enemy's tail touched player
            if (thisLeft <= maxX && thisLeft >= minX) {
                collision = true;
            }

            if (collision) {
                // let animation finish and reset player
                setTimeout(function() {
                    player.reset();
                }, 60);
            }
        }
    }
};

// Now write your own player class
// This class requires an update(), render() and
// a handleInput() method.

// Main Player
class Player {
    constructor() {
        this.sprite = 'images/char-boy.png'
        this.width = 65;
        this.padding = 18;
        this.reset();
        this.won = false
        this.jumpMinY;
        this.jumpMaxY;
        this.direction = 'up'
    }

    update(dt) {
        if (this.won) this.jump(dt);
    }

    jump(dt) {
        if (this.jumpMinY === undefined) {
            this.jumpMinY = this.y;
            this.jumpMaxY = this.y + 10;
        }

        if (player.y < this.jumpMaxY && this.direction === 'up') {
            player.y = player.y + (70 * dt);
        } else {
            this.direction = 'down';
        }


        if (this.direction === 'down' && player.y > this.jumpMinY) {
            player.y = player.y - (70 * dt);
        } else {
            this.direction = 'up';
        }
    }

    render() {
        ctx.drawImage(Resources.get(this.sprite), this.x, this.y);
    }

    handleInput(direction) {
        if (gameProperties.popupVisible) return;

        let newY = this.y;
        let newX = this.x;
        const maxY = 5 * gameProperties.CELL_HEIGHT - gameProperties.SPRITE_PADDING;
        const maxX = 4 * gameProperties.CELL_WIDTH;

        switch (direction) {
            case 'up':
                newY -= gameProperties.CELL_HEIGHT;
                break;

            case 'down':
                newY += gameProperties.CELL_HEIGHT;
                break;

            case 'left':
                newX -= gameProperties.CELL_WIDTH;
                break;

            case 'right':
                newX += gameProperties.CELL_WIDTH;
                break;

            default:
                break;
        }

        if (newY < -gameProperties.SPRITE_PADDING) newY = -gameProperties.SPRITE_PADDING;
        if (newY > maxY) newY = maxY;
        if (newX < 0) newX = 0;
        if (newX > maxX) newX = maxX;

        this.y = newY;
        this.x = newX;
        this.checkWin();
    }

    checkWin() {
        if (this.y < 0) {
            this.won = true;

            setTimeout(function() {
                const content = document.createElement('text');
                content.innerText = 'Congratulations you won!';

                const popup = new Popup({ 
                    title: 'You Won!', 
                    content: content,
                    closeCallback: function() {
                        player.reset();
                    }
                });
                popup.display();
            }, 100);
        }
    }

    reset() {
        this.x = 2 * gameProperties.CELL_WIDTH;
        this.y = 5 * gameProperties.CELL_HEIGHT - gameProperties.SPRITE_PADDING;
        this.won = false;
    }

    setCharacter(sprite = 'images/char-boy.png') {
        this.sprite = sprite;
    }
}

class Popup {
    constructor({width = 300, height = 'auto', id = 'popup', title = 'Title', content = '', closeCallback} = {}) {
        this.id = id;
        this.width = width + 'px';
        this.height = height + 'px';
        this.title = title;
        this.content = content;
        this.closeCallback = closeCallback
    }

    display() {
        const thisPopup = this;
        const popupWrapper = document.createElement('div');
        popupWrapper.id = 'popup-wrapper';
        popupWrapper.className = 'popup-wrapper';
        popupWrapper.style.zIndex = 0;
        // popupWrapper.onclick = function() {
        //     thisPopup.close();
        // }

        const popup = document.createElement('div');
        popup.id = this.id;
        popup.style.width = this.width;
        popup.style.height = this.height;
        popup.style.zIndex = 1;
        popup.className = 'popup';

        const title = document.createElement('h3');
        title.innerText = this.title;
        popup.append(title);

        const ok = document.createElement('button');
        ok.innerText = 'OK';
        ok.id = 'set-player-sprite';
        ok.className = 'btn btn-raised';
        ok.addEventListener('click', function() {
            if (typeof thisPopup.closeCallback === 'function') thisPopup.closeCallback();
            thisPopup.close();
        });

        console.log(this.content, '....');

        popup.append(this.content);
        popup.append(ok);
        popupWrapper.append(popup);
        document.body.append(popupWrapper);
        gameProperties.popupVisible = true;
    }

    close() {
        document.getElementById(this.id).remove();
        document.getElementById('popup-wrapper').remove();
        gameProperties.popupVisible = false;
    }
}

class CharacterSwitch {
    constructor() {
        this.sprites = [
            'images/char-boy.png',
            'images/char-cat-girl.png',
            'images/char-horn-girl.png',
            'images/char-pink-girl.png',
            'images/char-princess-girl.png'
        ];

        const documentFragment = document.createDocumentFragment();
        const thisSwitch = this;

        const prev = document.createElement('button');
        prev.innerText = '<';
        prev.className = 'character-switch-control';
        prev.addEventListener('click', function(event) {
            thisSwitch.switchCharacter(true);
            event.stopPropagation();
        });

        const container = document.createElement('div');
        container.id = 'character-container';
        container.style.display = 'inline';

        const img = Resources.get(this.sprites[0]);
        img.style = 'margin-top: -3em;';
        container.append(img);

        const next = document.createElement('button');
        next.innerText = '>';
        next.className = 'character-switch-control';
        next.addEventListener('click', function(event) {
            thisSwitch.switchCharacter();
            event.stopPropagation();
        });

        documentFragment.append(prev);
        documentFragment.append(container);
        documentFragment.append(next);

        this.documentFragment = documentFragment;
        this.container = container;
        this.imageIndex = 0;
    }

    switchCharacter(previous) {
        if (previous) {
            this.imageIndex -= 1;
        } else {
            this.imageIndex += 1;
        }

        if (this.imageIndex === this.sprites.length) this.imageIndex = 0;
        if (this.imageIndex === -1) this.imageIndex = this.sprites.length - 1;

        let newImg = Resources.get(this.sprites[this.imageIndex]);
        newImg.style = 'margin-top: -3em;';
        const img = this.container.getElementsByTagName('img')[0];
        img.remove();
        this.container.append(newImg);
    }
}

// Now instantiate your objects.
// Place all enemy objects in an array called allEnemies
// Place the player object in a variable called player

const gameProperties = (function() {
    const properties = {
        CELL_WIDTH: 101,
        CELL_HEIGHT: 83,
        SPRITE_PADDING: 20,
        popupVisible: false
    };

    return properties;
})();

let allEnemies = [];
const player = new Player();

for (let enemyX = 0; enemyX < 3; enemyX++) {
    const enemy = new Enemy();
    allEnemies.push(enemy);
}

const header = document.createElement('div');
header.id = 'header';

const btn = document.createElement('button');
btn.id = 'changeCharacter';
btn.innerText = 'Change Character';
btn.className = 'btn btn-raised';
btn.addEventListener('click', function() {
    const characterSwitch = new CharacterSwitch();
    const popup = new Popup({ 
        title: 'Change Character', 
        content: characterSwitch.documentFragment,
        closeCallback: function() {
            player.setCharacter(characterSwitch.sprites[characterSwitch.imageIndex]);
        }
    });
    popup.display();
});

header.append(btn);
document.body.prepend(header);

// This listens for key presses and sends the keys to your
// Player.handleInput() method. You don't need to modify this.
document.addEventListener('keyup', function(e) {
    var allowedKeys = {
        37: 'left',
        38: 'up',
        39: 'right',
        40: 'down'
    };

    player.handleInput(allowedKeys[e.keyCode]);
});
