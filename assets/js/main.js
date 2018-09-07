window.onload = function() {

    var styles = getComputedStyle(document.documentElement),
        bodyBgColor = String(styles.getPropertyValue('--body-bg-color')).trim(),
        lineColorLight = String(styles.getPropertyValue('--line-color-light')).trim(),
        lineColorDark = String(styles.getPropertyValue('--line-color-dark')).trim(),
        particleColorLight = String(styles.getPropertyValue('--particle-color-light')).trim(),
        particleColorDark = String(styles.getPropertyValue('--particle-color-dark')).trim(),
        canvas = document.getElementById("animation"),
        canvasWidth = window.innerWidth,
        canvasHeight = window.innerHeight,
        context = canvas.getContext("2d"),
        particles = {},
        particleIndex = 0,
        settings = {
            density: 20,
            particleSizeMin: 1,
            particleSizeMax: 3,
        };

    window.onresize = resizeCanvas;
    resizeCanvas();

    function resizeCanvas() {
        canvasWidth = window.innerWidth,
        canvasHeight = window.innerHeight,

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    };

    function Particle() {
        this.size = Math.floor(Math.random() * 3) + 1  ;
        this.x = canvasWidth / 2;
        this.y = canvasHeight / 2;

        this.vx = Math.round(Math.random() * 3) - 1;
        this.vy = Math.round(Math.random() * 3) - 1;

        particleIndex ++;
        particles[particleIndex] = this;
        this.id = particleIndex;
        this.life = 0;
    }

    Particle.prototype.draw = function() {
        this.x += this.vx;
        this.y += this.vy;
        //this.vx += Math.round(1*Math.random()-1);
        //this.vy += Math.round(1*Math.random()-1);

        // clear canvas and draw particles
        context.clearRect(settings.leftWall, settings.groundLevel, canvas.width, canvas.height);
        context.beginPath();
        context.fillStyle=particleColorDark;
        context.arc(this.x, this.y, this.size, 0, Math.PI*2, true);
        context.closePath();
        context.fill();

    }

    setInterval(function() {
        context.fillStyle = bodyBgColor;
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