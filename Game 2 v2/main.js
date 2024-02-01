window.addEventListener('load', function () {
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1220;
    canvas.height = 720;
    ctx.strokeStyle = 'white'; // Overriding the default black strokeStyle
    ctx.lineWidth = 3; // Overriding the default lineWidth
    ctx.font = '35px Bangers';
    ctx.fillStyle = 'white';

    class Asteroid {
        constructor(game) {
            this.game = game;
            this.radius = 75;
            this.x = this.game.width + this.radius; // -this.radius to start L2R  // this.game.width for start from right to left. -radius so image don't popup
            this.y = Math.random() * this.game.height;
            this.image = document.getElementById('asteroid');
            this.border = 100; // to be set as planet border
            this.spriteWidth = 150;
            this.spriteHeight = 155;
            this.speed = Math.random() * 1.5 + 2; // random speed from 2 to 7 fps
            this.free = true; // property or flag to mark as active or not
            this.angle = 0;
            this.va = Math.random() * 0.02 - 0.01;

        }
        // Method to draw the object
        draw(context) {
            // Only draw if free space
            if (!this.free) {
                // // the white circle asteroid border
                // context.beginPath();
                // context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                // context.stroke();
                // the steroid
                context.save();
                context.translate(this.x, this.y);
                context.rotate(this.angle);
                context.drawImage(this.image, -this.spriteWidth * 0.5, -this.spriteHeight * 0.5, this.spriteWidth, this.spriteHeight);
                context.restore();
            }
        }
        // Method to update the object
        update() {
            // update rotation angle
            if (!this.free) {
                this.angle += this.va;
                this.x -= this.speed; // to move to the right on the horizontal x axis change to -= to move from left
                // if asteroid x > game width reset change to <0 for right2left
                if (this.x < this.border) {
                    this.reset();
                    const explosion = this.game.getExplosion();
                    if (explosion) explosion.start(this.x, this.y, -this.speed);

                }
            }
        }
        // method to return asteroid to the pool
        reset() {
            this.free = true;
        }
        //  method to start using the asteroid from the pool
        start() {
            this.free = false;
            this.x = this.game.width + this.radius // -this.radius; // this.game.width for start from right to left
            this.y = Math.random() * this.game.height; // maybe -this.radius
        }
    }

    class Alien {
        constructor(game) {
            this.game = game;
            this.radius = 32;
            this.x = this.game.width + this.radius // this.radius for left to right // this.game.width for start from right to left
            this.y = Math.random() * this.game.height;
            this.aliens = ['alien1', 'alien2', 'alien3'];
            this.randomImageId = Math.floor(Math.random() * 3);
            this.image = document.getElementById(this.aliens[this.randomImageId]);
            this.border = 100; // to be set as planet border
            this.spriteWidth = 64;
            this.spriteHeight = 64;
            this.speed = Math.random() * 1.5 + 0.2; // random speed from 2 to 7 fps
            this.free = true; // property or flag to mark as active or not


        }
        // Method to draw the object
        draw(context) {
            // Only draw if free space
            if (!this.free) {
                // // the white circle, alien border
                // context.beginPath();
                // context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                // context.stroke();
                // the alien
                // context.save();
                context.drawImage(this.image, this.x - this.spriteWidth * 0.5, this.y - this.spriteHeight * 0.5, this.spriteWidth, this.spriteHeight);
                // context.restore();
            }
        }
        // Method to update the object
        update() {
            // update rotation angle
            if (!this.free) {
                this.x -= this.speed; // += to move to the right on the horizontal x axis change to -= to move from left
                // if alien x > game width reset change to <0 for right2left
                if (this.x < this.border) {
                    this.reset();
                    // To be changed with sprite sheet for capturing
                    const explosion = this.game.getExplosion();
                    if (explosion) explosion.start(this.x, this.y, -this.speed);

                }
            }
        }
        // method to return alien to the pool
        reset() {
            this.free = true;
        }
        //  method to start using the alien from the pool
        start() {
            this.free = false;
            this.x = this.game.width + this.radius; // -this.radius; // this.game.width for start from right to left
            this.y = Math.random() * this.game.height; // maybe -this.radius
        }
    }

    class Explosion {
        constructor(game) {
            this.game = game;
            this.x = 0;
            this.y = 0;
            this.speed = 0;
            this.image = document.getElementById('explosions');
            this.spriteWidth = 300;
            this.spriteHeight = 300;
            this.free = true;
            this.frameX = 0;
            this.frameY = Math.floor(Math.random() * 3);
            this.maxFrame = 22;
            this.animationTimer = 0;
            this.animationInterval = 1000 / 25; // to control the frame rate per second
            this.sound = this.game.explosionSounds[Math.floor(Math.random() * this.game.explosionSounds.length)]; // Randomizing one of explosionSounds array sounds starting from index 0 to array length
        }
        // method to draw the sprite sheets
        draw(context) {
            if (!this.free) {
                context.drawImage(this.image, this.spriteWidth * this.frameX, this.spriteHeight * this.frameY, this.spriteWidth, this.spriteHeight, this.x - this.spriteWidth * 0.5, this.y - this.spriteWidth * 0.5, this.spriteWidth, this.spriteHeight);
            }
        }
        // Method to cycle through the sprite sheets of the explosion
        update(deltaTime) {
            if (!this.free) {
                // Adjusting the motion of the explosion animation on horizontal coordinates
                this.x += this.speed;
                // setting the periodic event for animation
                if (this.animationTimer > this.animationInterval) {
                    this.frameX++;
                    if (this.frameX > this.maxFrame) this.reset();
                    // reset animationTimer to 0
                    this.animationTimer = 0;
                } else {
                    this.animationTimer += deltaTime;
                }
            }
        }
        // Method to play explosion sound
        play() {
            this.sound.currentTime = 0;
            this.sound.play(); // a built in function for html audio
        }
        // Method to return the object back to the object Pool
        reset() {
            this.free = true;
        }
        // Method that takes the object from the pool
        start(x, y, speed) {
            this.free = false;
            this.x = x;
            this.y = y;
            this.frameX = 0;
            this.speed = speed;
            this.sound = this.game.explosionSounds[Math.floor(Math.random() * this.game.explosionSounds.length)];
            this.play();
        }
    }
    // // Will draw score, timer and other information that will display for the player
    // class UI {
    //     constructor(game) {
    //         this.game = game;
    //         this.fontSize = 25;
    //         this.fontFamily = 'Bangers';
    //         this.color = 'white';
    //     }
    //     draw(context) {
    //         context.save();
    //         context.fillStyle = this.color;
    //         context.shadowOffsetX = 2;
    //         context.shadowOffsetY = 2;
    //         context.shadowColor = 'black';
    //         context.font = this.fontSize + 'px ' + this.fontFamily;
    //         // Score
    //         context.fillText('Score: ' + this.game.score, 20, 40);
    //         // Timer
    //         const formattedTime = (this.game.gameTime * 0.001).toFixed(1); // toFixed method formats a number using fixed point notation (after decimal point)
    //         context.fillText('Timer: ' + formattedTime, 20, 100);
    //         // Game over message
    //         if (this.game.gameOver) {
    //             context.textAlign = 'center';
    //             let message1;
    //             let message2;
    //             if (this.game.score > this.game.winningScore) {
    //                 message1 = 'You Win!';
    //                 message2 = 'Well done!';
    //             } else {
    //                 message1 = 'Mission Failed!';
    //                 message2 = 'This planet is lost!';
    //             }
    //             context.font = '100px ' + this.fontFamily;
    //             context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5 - 20);
    //             context.font = '25px ' + this.fontFamily;
    //             context.fillText(message2, this.game.width * 0.5, this.game.height * 0.5 + 20);
    //         }
    //         // ammo
    //         if (this.game.player.powerUp) context.fillStyle = '#ffffbd';
    //         for (let i = 0; i < this.game.ammo; i++) {
    //             context.fillRect(20 + 5 * i, 50, 3, 20);
    //         }
    //         context.restore();
    //     }
    // }

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;
            this.asteroidPool = [];
            this.maxAsteroids = 10;
            this.asteroidTimer = 0;  // Helper variable to add new asteroid
            this.asteroidInterval = 1000; // Helper variable to add new asteroid evey millisecond less is faster for harder levels
            this.createAsteroidPool(); // when a new Game is initiated it initiate asteroidPool elements

            this.alienPool = [];
            this.maxAliens = 3; // Maximum aliens spawn
            this.alienTimer = 0;  // Helper variable to add new alien
            this.alienInterval = 1800; // Helper variable to add new alien evey millisecond more is slower for harder levels
            this.createAlienPool(); // when a new Game is initiated it initiate asteroidPool elements

            this.score = 0;
            this.maxScore = 10;

            this.mouse = {
                x: 0,
                y: 0,
                radius: 2
            };

            this.explosion1 = document.getElementById('explosion1');
            this.explosion2 = document.getElementById('explosion2');
            this.explosion3 = document.getElementById('explosion3');
            this.explosion4 = document.getElementById('explosion4');
            this.explosion5 = document.getElementById('explosion5');
            this.explosion6 = document.getElementById('explosion6');
            this.explosionSounds = [this.explosion1, this.explosion2, this.explosion3, this.explosion4, this.explosion5, this.explosion6];
            this.explosionPool = [];
            this.maxExplosions = 20;
            this.createExplosionPool();

            window.addEventListener('click', e => {
                // Add explosions at a click coordinates
                // console.log(e); // since canvas isn't full screen we need to use offsetX and offsetY
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;

                // Cycle through asteroid array
                this.asteroidPool.forEach(asteroid => {
                    // if already out & collide with mouse
                    if (!asteroid.free && this.checkCircleCollision(asteroid, this.mouse)) {
                        // Helper temporary variable
                        const explosion = this.getExplosion();
                        // setting explosion coordinates to asteroid and motion to a fraction 0.4 of asteroid speed
                        if (explosion) explosion.start(asteroid.x, asteroid.y, asteroid.speed * 0.4);
                        // remove the asteroid
                        asteroid.reset();
                        if (this.score < this.maxScore) this.score++; // Add score for mouse to asteroid (could be special score)
                    }
                })
                // Cycle through alien array
                this.alienPool.forEach(alien => {
                    // if already out & collide with mouse
                    if (!alien.free && this.checkCircleCollision(alien, this.mouse)) {
                        // Helper temporary variable
                        const explosion = this.getExplosion();
                        // setting explosion coordinates to alien and motion to a fraction 0.2 of alien speed
                        if (explosion) explosion.start(alien.x, alien.y, alien.speed * 0.2);
                        // remove the alien
                        alien.reset();
                        if (this.score < this.maxScore) this.score += 10; // Add score for mouse to asteroid (could be special score)
                    }
                })
            });
        }
        createAsteroidPool() {
            for (let i = 0; i < this.maxAsteroids; i++) {
                this.asteroidPool.push(new Asteroid(this));
            }
        }
        createAlienPool() {
            for (let i = 0; i < this.maxAliens; i++) {
                this.alienPool.push(new Alien(this));
            }
        }
        createExplosionPool() {
            for (let i = 0; i < this.maxExplosions; i++) {
                this.explosionPool.push(new Explosion(this));
            }
        }
        getAsteroid() {
            for (let i = 0; i < this.asteroidPool.length; i++) {
                if (this.asteroidPool[i].free) {
                    return this.asteroidPool[i];
                }
            }
        }
        getAlien() {
            for (let i = 0; i < this.alienPool.length; i++) {
                if (this.alienPool[i].free) {
                    return this.alienPool[i];
                }
            }
        }
        getExplosion() {
            for (let i = 0; i < this.explosionPool.length; i++) {
                if (this.explosionPool[i].free) {
                    return this.explosionPool[i];
                }
            }
        }
        // Method to check collision between circles (mouse pointer and enemy two circle objects a and b)
        checkCircleCollision(a, b) {
            const sumOfRadii = a.radius + b.radius;
            const dx = a.x - b.x;
            const dy = a.y - b.y;
            const distance = Math.hypot(dx, dy);
            return distance < sumOfRadii; // will return true if objects are overlapping else false
        }
        render(context, deltaTime) {
            // create asteroids periodically
            if (this.asteroidTimer > this.asteroidInterval) {
                // Add new asteriod from pool
                const asteroid = this.getAsteroid();
                if (asteroid) asteroid.start();
                this.asteroidTimer = 0;
            } else {
                this.asteroidTimer += deltaTime;
            }
            // create alien periodically
            if (this.alienTimer > this.alienInterval) {
                // Add new alien from pool
                const alien = this.getAlien();
                if (alien) alien.start();
                this.alienTimer = 0;
            } else {
                this.alienTimer += deltaTime;
            }

            this.asteroidPool.forEach(asteroid => {
                asteroid.draw(context);
                asteroid.update();
            });
            this.alienPool.forEach(alien => {
                alien.draw(context);
                alien.update();
            });
            this.explosionPool.forEach(explosion => {
                explosion.draw(context);
                explosion.update(deltaTime);
            });
            context.fillText('Score: ' + this.score, 20, 35);
            if (this.score >= this.maxScore) {
                context.save(); // To apply the change only on winning message
                context.textAlign = 'center';
                context.fillText('You win, final score: ' + this.score, this.width * 0.5, this.height * 0.5)
                context.restore();
            }
        }
    }

    const game = new Game(canvas.width, canvas.height);

    let lastTime = 0;
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        game.render(ctx, deltaTime);
        requestAnimationFrame(animate);
    }
    // animate(0); // setting the first timeStamp to 0 avoidin the NaN for the first loop
});

// Popping issue
// Creating an array to randomly select an alien
//  Aliens spawn randomly and less frequent than meteorites and steroids
// Collecting an alien add special score or Time
// Shouting an alien deduct score or time

// Adding grab sprite sheet for collecting aliens

// Adding sounds and sound array for collecting aliens (get over here, gotcha, where the hell you think you're going, u little ugly thing, come baby you're safe now, aliens sounds)

// Creating a debug mode 