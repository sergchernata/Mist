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
        particleSettings = {
            density: 20,
            particleSizeMin: 1,
            particleSizeMax: 3,
        },
        shapes = [],
        i = 0;

    window.onresize = resizeCanvas;
    resizeCanvas();
    createParticles();
    createShapes();

    setInterval(function() {
        i++;
        // clear canvas
        context.fillStyle = bodyBgColor;
        context.fillRect(0, 0, canvas.width, canvas.height);
        // animate shape
        for (var i in shapes) {
            shapes[i].draw(i);
        }
        // animate particles
        for (var i in particles) {
            particles[i].draw();
        }
    }, 30);

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
        context.clearRect(particleSettings.leftWall, particleSettings.groundLevel, canvas.width, canvas.height);
        context.beginPath();
        context.fillStyle = this.fill;
        context.arc(this.x, this.y, this.size, 0, Math.PI*2, true);
        context.closePath();
        context.fill();
    }

    function Shape(lineColor,radius,amp,sineCount){
        this.x=0;
        this.y=100;
        this.radius=radius;
        this.amp=amp;
        this.sineCount=sineCount;
        this.lineColor = lineColor;
    }

    Shape.prototype.draw = function(offset) {
        context.beginPath();
        for(let i = 0; i < 360; i++){
            let angle = i*Math.PI/180;
            let pt=sineCircleXYatAngle(this.x,this.y,this.radius,this.amp,angle,this.sineCount);
            context.lineTo(pt.x,pt.y);
        }
        context.closePath();
        context.strokeStyle = this.lineColor;
        context.stroke();
    }

    function createParticles() {
        for (let i = 0; i < particleSettings.density; i++) {
            particles.push(new Particle());
        }
    }

    function createShapes() {
        shapes.push(new Shape(lineColorDark, 400, 12, 30));
        shapes.push(new Shape(lineColorLight, 400, 8, 20));
    }

    function resizeCanvas() {
        canvasWidth = window.innerWidth,
        canvasHeight = window.innerHeight,
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    };

    function sineCircleXYatAngle(cx,cy,radius,amplitude,angle,sineCount){
        let x = cx+(radius+amplitude*Math.sin(sineCount*angle))*Math.cos(angle);
        let y = cy+(radius+amplitude*Math.sin(sineCount*angle))*Math.sin(angle);
        return({x:x,y:y});
    }

    function randomDelta() {
        return (Math.random() - Math.random()) / 10;
    }

};