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
        particles = [],
        settings = {
            density: 20,
            particleSizeMin: 1,
            particleSizeMax: 3,
        };

    window.onresize = resizeCanvas;
    resizeCanvas();
    createParticles();

    function Particle() {
        this.fill = Math.random() > 0.5 ? particleColorDark : particleColorLight;
        this.size = Math.floor(Math.random() * 3) + 1;

        this.x = Math.round(Math.random() * canvas.width);
        this.y = Math.round(Math.random() * canvas.height);

        this.vx = randomDelta();
        this.vy = randomDelta();

        return this;
    }

    Particle.prototype.draw = function() {
        this.x += this.vx;
        this.y += this.vy;
        this.vx += randomDelta();
        this.vy += randomDelta();

        // check for boundaries
        this.vx = this.x < 0 ? this.vx * -1 : this.x > canvas.width ? this.vx * -1 : this.vx;
        this.vy = this.y < 0 ? this.vy * -1 : this.y > canvas.height ? this.vy * -1 : this.vy;
        this.x = this.x < 0 ? 0 : this.x > canvas.width ? canvas.width : this.x;
        this.y = this.y < 0 ? 0 : this.y > canvas.height ? canvas.height : this.y;

        // clear canvas and draw particles
        context.clearRect(settings.leftWall, settings.groundLevel, canvas.width, canvas.height);
        context.beginPath();
        context.fillStyle = this.fill;
        context.arc(this.x, this.y, this.size, 0, Math.PI*2, true);
        context.closePath();
        context.fill();
    }

    setInterval(function() {
        // clear canvas
        context.fillStyle = bodyBgColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
        // animate particles by drawing
        for (var i in particles) {
            particles[i].draw();
        }
    }, 30);

    function createParticles() {
        for (var i = 0; i < settings.density; i++) {
            particles.push(new Particle());
        }
    }

    function resizeCanvas() {
        canvasWidth = window.innerWidth,
        canvasHeight = window.innerHeight,

        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    };

    function randomDelta() {
        return (Math.random() - Math.random()) / 10;
    }

};