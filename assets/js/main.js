window.onload = function() {

    var canvas = document.getElementById("animation");
    var context = canvas.getContext("2d");

    var posX = 20,
        posY = canvas.height / 2;

    var particles = {},
        particleIndex = 0,
        settings = {
            density: 20,
            particleSize: 10,
            startingX: canvas.width / 2,
            startingY: canvas.height / 4,
            gravity: 0.5,
            maxLife: 100
        };

    function Particle() {
        this.x = settings.startingX;
        this.y = settings.startingY;

        this.vx = Math.random() * 20 - 10;
        this.vy = Math.random() * 20 - 5;

        particleIndex ++;
        particles[particleIndex] = this;
        this.id = particleIndex;
        this.life = 0;
    }

    Particle.prototype.draw = function() {
        this.x += this.vx;
        this.y += this.vy;
        this.vy += settings.gravity;

        this.life++;

        if (this.life >= this.maxLife) {
            delete particles[this.id];
        }

        context.clearRect(settings.leftWall, settings.groundLevel, canvas.width, canvas.height);
        context.beginPath();
        context.fillStyle="#ffffff";
        context.arc(this.x, this.y, settings.particleSize, 0, Math.PI*2, true);
        context.closePath();
        context.fill();

    }

    setInterval(function() {
        context.fillStyle = "rgba(10,10,10,0.8)";
        context.fillRect(0, 0, canvas.width, canvas.height);

        for (var i = 0; i < settings.density; i++) {
            if (Math.random() > 0.97) {
                new Particle();
            }
        }

        for (var i in particles) {
            particles[i].draw();
        }
    }, 30);

};