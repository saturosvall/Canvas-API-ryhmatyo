window.addEventListener('load', function () {
    const canvas = this.document.getElementById('canvas1');
    const ctx = canvas.getContext('2d');
    canvas.width = 1280; // **** WE NEED A BETTER BACKGROUND with exact width and height 1280*720
    canvas.height = 720;
    ctx.strokeStyle = 'white'; // Overriding the default black strokeStyle
    ctx.lineWidth = 3; // Overriding the default lineWidth

    // Class to handle the planet boarder and Generated Shield
    class Planet {
        constructor(game) {
            this.game = game;
            this.x = -260;
            this.y = 400;
            this.radius = 440;
            this.borderColor = 'hsla(175, 100%, 75%, 0.356)'; // initial border color
            this.sphereColor = 'hsla(157, 100%, 75%, 0.11)'; // initial sphere color
            // this.shieldBorderColor = 'hsla(241, 48%, 40%, 0.596)'; // initial shield color
            // this.shieldSphereColor = 'hsla(125, 46%, 38%, 0.5)'; // initial shield color
            // this.shieldActive = true;
        }
        draw(context) {
            // drawing the half circle boarder of the planet
            context.save();
            context.beginPath();
            context.arc(this.x, this.y, this.radius, -1, 1, false);
            context.fillStyle = this.sphereColor;
            context.fill();
            // Setting the border color
            context.strokeStyle = this.borderColor;
            context.lineWidth = 8;
            context.stroke();
            context.restore();
            // draw sield if active
            // if (this.shieldActive) this.drawShield(context);
        }
        // drawShield(context) {
        //     // drawing the shield
        //     context.save();
        //     context.beginPath();
        //     context.arc(this.x - 900, this.y, this.radius * 5, -1, 1, false);
        //     context.fillStyle = this.sphereColor;
        //     context.fill();
        //     // Setting the border color
        //     context.strokeStyle = this.borderColor;
        //     context.lineWidth = 8;
        //     context.stroke();
        //     context.restore();
        // }
        // shieldOn() {
        //     this.shieldActive = true;
        // }
        // shieldOff() {
        //     this.shieldActive = false;
        // }
    }

    class Asteroid {
        constructor(game) {
            this.game = game;
            this.radius = 75;
            this.x = this.game.width + this.radius; // -this.radius to start L2R  // this.game.width for start from right to left. -radius so image don't popup
            this.y = Math.random() * this.game.height;
            this.image = document.getElementById('asteroid');
            this.spriteWidth = 150;
            this.spriteHeight = 155;
            this.speed = Math.random() * 1.5 + 0.2;// 6.5 + 2; // random speed from 2 to 7 fps
            this.free = true; // property or flag to mark as active or not
            this.angle = 0;
            this.va = Math.random() * 0.02 - 0.01;
            this.asteroidDescription = '+1/Game Over';

        }
        // Method to draw the object
        draw(context) {
            // Only draw if free space
            if (!this.free) {
                context.save();
                // the white circle asteroid border and description for debug
                if (this.game.debug) {
                    context.beginPath();
                    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    context.stroke();
                    context.fillStyle = 'hsla(240, 2%, 91%, 0.959)';
                    context.font = '25px Bangers';
                    context.fillText(this.asteroidDescription, this.x - this.radius, this.y - this.radius);
                }

                // The asteroid 
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

                // Check for collision between Asteroid and Planet
                if (this.game.checkCircleCollision(this, this.game.planet)) {
                    this.game.planet.borderColor = 'hsla(12, 75%, 45%, 0.315)';
                    this.game.planet.sphereColor = 'hsla(12, 80%, 53%, 0.158)';

                    this.reset();
                    const explosion = this.game.getExplosion();
                    if (explosion) explosion.start(this.x, this.y, -this.speed);
                    this.game.gameOver = true;
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
            this.spriteWidth = 64;
            this.spriteHeight = 64;
            this.speed = Math.random() * 1.5 + 0.2; // random speed from 2 to 7 fps
            this.free = true; // property or flag to mark as active or not

            this.alienDescription = '±10/Collectible'; // Text for debug mode
            this.mouvementAngle = 0; // initiating the mouvemebt angle for alien


        }
        // Method to draw the object
        draw(context) {
            // Only draw if free space
            if (!this.free) {
                context.save();
                // the white circle, alien border and description for debug mode
                if (this.game.debug) {
                    context.beginPath();
                    context.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
                    context.stroke();
                    // Adding the text fill method
                    context.fillStyle = 'hsla(240, 2%, 91%, 0.959)';
                    context.font = '25px Bangers';
                    context.fillText(this.alienDescription, this.x - this.radius * 2, this.y - this.radius);
                };

                // the alien figurine
                context.drawImage(this.image, this.x - this.spriteWidth * 0.5, this.y - this.spriteHeight * 0.5, this.spriteWidth, this.spriteHeight);
                context.restore();
            }
        }
        // Method to update the object
        update() {
            // Applying a mouvement animation
            this.mouvementAngle += 0.1; // how fast up & down
            this.y = this.y + Math.sin(this.mouvementAngle) * 4; // how much up & down
            // update rotation angle
            if (!this.free) {
                this.x -= this.speed; // += to move to the right on the horizontal x axis change to -= to move from left
                // if alien x > game width reset change to <0 for right2left

                // *** check for colision between Planet and Alien ****
                if (this.game.checkCircleCollision(this, this.game.planet)) {
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

    // Will handle the disappearance explosion of aliens
    class DisappearanceExplosion extends Explosion {
        constructor(game) {
            super(game);
            // Custom properties specific for disappearance effect
            this.image = document.getElementById('disappear');
            this.spriteWidth = 79.5;
            this.spriteHeight = 80;
            this.frameY = Math.floor(Math.random() * 4);
            this.maxFrame = 7;
            this.sound = this.game.disappearSounds[Math.floor(Math.random() * this.game.disappearSounds.length)];
        }
        // Overriding start method
        start(x, y, speed) {
            this.sound = this.game.disappearSounds[Math.floor(Math.random() * this.game.disappearSounds.length)];
            // **** Issue to fix too many interferences ****
            this.sound.play();
            super.start(x, y, speed);
        }
    }
    // Will draw score, timer and other information that will display for the player
    class UI {
        constructor(game) {
            this.game = game;
            this.fontSize = 35;
            this.fontFamily = 'Bangers';
            this.color = 'white';
        }
        draw(context) {
            context.save();
            context.fillStyle = this.color;
            context.shadowOffsetX = 2;
            context.shadowOffsetY = 2;
            context.shadowColor = 'black';
            context.font = this.fontSize + 'px ' + this.fontFamily;
            // Score
            context.fillText('Score: ' + this.game.score, 30, 40);

            // Timer
            const formattedTime = (this.game.gameTime * 0.001).toFixed(1); // toFixed method formats a number using fixed point notation (after decimal point)
            context.fillText('Timer: ' + formattedTime, 20, 80);

            // Game over message
            if (this.game.gameOver) {
                context.textAlign = 'center';
                let message1;
                let message2;
                if (this.game.score >= this.game.winningScore) {
                    // Where should the Planet border expands (we could call Planet shield activated when winning the game)
                    this.game.planet.radius += 2;
                    message1 = 'SISU Protocols Succeeded!';
                    message2 = 'The Planet is Safe and the shield is now active!!';
                } else {
                    message1 = 'Mission Failed!';
                    message2 = 'This planet is lost!';
                }
                context.font = '100px ' + this.fontFamily;
                context.fillText(message1, this.game.width * 0.5, this.game.height * 0.5 - 20);
                context.font = '35px ' + this.fontFamily;
                context.fillText(message2, this.game.width * 0.5, this.game.height * 0.5 + 20);
            }
            context.restore();
        }
    }

    class Game {
        constructor(width, height) {
            this.width = width;
            this.height = height;

            this.planet = new Planet(this); // Creating an instence of planet
            this.gameOver = false;
            this.ui = new UI(this);
            this.asteroidPool = [];
            this.maxAsteroids = 15;
            this.asteroidTimer = 0;  // Helper variable to add new asteroid
            this.asteroidInterval = 800; // Helper variable to add new asteroid evey millisecond less is faster for harder levels
            this.createAsteroidPool(); // when a new Game is initiated it initiate asteroidPool elements

            this.alienPool = [];
            this.maxAliens = 5; // Maximum aliens spawn
            this.alienTimer = 0;  // Helper variable to add new alien
            this.alienInterval = 1800; // Helper variable to add new alien evey millisecond more is slower for harder levels
            this.createAlienPool(); // when a new Game is initiated it initiate asteroidPool elements

            this.score = 0;
            this.winningScore = 80; // To set the minimum score to win
            this.gameTime = 0;
            this.timeLimit = 30000; // To set the maximum time for mission success

            // mouse x, y and radius of circle
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

            this.disappear1 = document.getElementById('disappear1');
            this.disappear2 = document.getElementById('disappear2');
            this.disappear3 = document.getElementById('disappear3');
            this.disappearSounds = [this.disappear1, this.disappear2, this.disappear3];
            this.disappearancePool = [];
            this.maxDisappearance = 10;
            this.createDisappearancePool();

            this.debug = false;

            window.addEventListener('keyup', e => {
                if (e.key === 'd') this.debug = !this.debug;
                // console.log(this.debug);
            });

            window.addEventListener('click', e => {
                // Add explosions at a click coordinates with the default mouse click (left)
                // console.log(e); // since canvas isn't full screen we need to use offsetX and offsetY
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;

                if (!this.gameOver) {
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
                            if (this.score < this.winningScore) this.score++; // Add score for destroying an asteroid (could be special score)
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
                            if (this.score < this.winningScore) this.score -= 10; // Add score for mouse to asteroid (could be special score)
                        }
                    })
                }

            });
            window.addEventListener('contextmenu', e => {
                // Handle the right mouse button click
                e.preventDefault();
                this.mouse.x = e.offsetX;
                this.mouse.y = e.offsetY;
                if (!this.gameOver) {
                    // Cycle through alien array
                    this.alienPool.forEach(alien => {
                        // if already out & collide with mouse
                        if (!alien.free && this.checkCircleCollision(alien, this.mouse)) {
                            // Helper temporary variable
                            const disappearance = this.getDisappearance();
                            // setting capture coordinates to alien and motion to a fraction 0.2 of alien speed
                            if (disappearance) disappearance.start(alien.x, alien.y, alien.speed * 0.2);
                            // remove the alien
                            alien.reset();
                            if (this.score < this.winningScore) this.score += 10; // Add special score for capturing an alien
                        }
                    })
                }
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
        createDisappearancePool() {
            for (let i = 0; i < this.maxDisappearance; i++) {
                this.disappearancePool.push(new DisappearanceExplosion(this));
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
        getDisappearance() {
            for (let i = 0; i < this.disappearancePool.length; i++) {
                if (this.disappearancePool[i].free) {
                    return this.disappearancePool[i];
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
            // Drawing the planet
            this.planet.draw(context);

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
            this.disappearancePool.forEach(disappearance => {
                disappearance.draw(context);
                disappearance.update(deltaTime);
            });
            // Drawing the UI
            if (!this.gameOver) this.gameTime += deltaTime;
            if (this.gameTime > this.timeLimit || this.score >= this.winningScore) {
                this.gameOver = true;
                // Stop spawns of Asteroids and Aliens ****
            }

            this.ui.draw(context, this.score, this.gameTime, this.gameOver, this.winningScore, this.width, this.height);
        }
    }

    const game = new Game(canvas.width, canvas.height);

    let lastTime = 0;
    function animate(timeStamp) {
        const deltaTime = timeStamp - lastTime;
        lastTime = timeStamp;
        ctx.clearRect(0, 0, canvas.width, canvas.height); // method to delete old animation frame drawn on canvas since animation is a loop that keeps drawing so we only see the current and becomes moving/animated objects
        game.render(ctx, deltaTime);
        requestAnimationFrame(animate);
    }
    animate(0); // setting the first timeStamp to 0 avoidin the NaN for the first loop
});


// **** WE NEED A BETTER BACKGROUND with exact width and height 1280*720
// Add spaceOrk Class and function (takes three hits and give +10 score)
// For Näyttö maybe a game responsive and playable on any device (android, iPhone, tablet and desktop)
// Cleaning up the code
// The planet border : maybe lives for planet ???
//  Aliens spawn randomly and less frequent than meteorites and steroids
// Adding Player/Robot
// Adding a circle/shield for robot if hitting 40 asteroids for example (form like atmosphere of planet but full circle around thr robot, color golden radian transparent for example)
// Adding sprite sheet for destroyed Robot when lose all lives (maybe the mechanique debree sprite sheet from project 1)
// Adding Play/Pause mode (maybe same technique as debug mode using spaceBar or 'p')

// Creating a debug mode trigger by key 'd' ** done
// Adding description for asteroids and aliens in debug mode ** done
// Adding grab sprite sheet for collecting aliens ** done
// Adding random sounds and sound array for collecting aliens (aliens sounds) ** done
// if one asteroid hits the planet Game over ** done
// Adding an event listener for right mouse button click ** done
// Collecting an alien add special score ** done
// Shouting an alien deduct score or time ** done
// Adding a protective sphere (planet border expands) that activate if gameOver and score > maxScore by changing in draw() method in Planet class ---> context.arc(this.x - 900, this.y, this.radius * 5, -1, 1, false); ** done
// Applying a mouvement animation to aliens ** done
