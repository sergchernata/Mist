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
            density: 30,
            particleSizeMin: 1,
            particleSizeMax: 3,
        },
        shapeSettings = {
            ampPercentDrift: 20,
        },
        shapes = [],
        mouseX = 0,
        mouseY = 0,
        rotationDelta = 0;

    window.onresize = resizeCanvas;
    document.onmousemove = handleMouseMove;

    resizeCanvas();
    createParticles();
    createShapes();

    setInterval(function() {
        // clear canvas
        context.clearRect(0, 0, canvas.width, canvas.height);
        context.fillStyle = bodyBgColor;
        context.fillRect(0, 0, canvas.width, canvas.height);

        // animate shape
        for (var i in shapes) {
            shapes[i].draw(rotationDelta, i);
        }

        // animate particles
        for (var i in particles) {
            particles[i].draw();
        }

        rotationDelta = rotationDelta == 1 ? 0 : rotationDelta + 0.001;

    }, 30);

    function Particle() {
        this.fill = Math.random() > 0.5 ? particleColorDark : particleColorLight;
        this.size = Math.floor(Math.random() * 3) + 1;

        this.x = Math.round(Math.random() * canvas.width);
        this.y = Math.round(Math.random() * canvas.height);

        this.angle = randomAngle();

        return this;
    }

    Particle.prototype.draw = function() {
        this.angle += randomAngle();
        this.x += (Math.random() * Math.cos(this.angle)) / 2;
        this.y += (Math.random() * Math.sin(this.angle)) / 2;

        // check for boundaries
        this.vx = this.x < 0 ? this.vx * -1 : this.x > canvas.width ? this.vx * -1 : this.vx;
        this.vy = this.y < 0 ? this.vy * -1 : this.y > canvas.height ? this.vy * -1 : this.vy;
        this.x = this.x < 0 ? 0 : this.x > canvas.width ? canvas.width : this.x;
        this.y = this.y < 0 ? 0 : this.y > canvas.height ? canvas.height : this.y;

        // clear canvas and draw particles
        context.beginPath();
        context.fillStyle = this.fill;
        context.arc(this.x, this.y, this.size, 0, Math.PI*2, true);
        context.closePath();
        context.fill();
    }

    function Shape(lineColor,radius,amp,sineCount){
        this.x = 0;
        this.y = 100;
        this.radius = radius;
        this.amp = amp;
        this.ampBase = amp;
        this.sineCount = sineCount;
        this.lineColor = lineColor;
    }

    Shape.prototype.draw = function(rotation, index) {
        context.beginPath();
        for(let i = 0; i < 360; i++){
            let angle = i*Math.PI/180;
            let ownRotation = rotation + index * 0.5;
            let diff = (this.ampBase - (this.ampBase / 100) * shapeSettings.ampPercentDrift) / 2;
            let center = canvas.width / 2;
            let delta = (center - mouseX) / (center / diff);
            let pt=sineCircleXYatAngle(this.x,this.y,this.radius,this.amp,delta,angle,this.sineCount,ownRotation);
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
        for (let i = 0; i < 5; i++) {
            shapes.push(new Shape("rgba(181, 197, 203, " + (1-(i*0.2)) + ")", 400+i*80, 12, 30));
        }
        for (let i = 0; i < 5; i++) {
            shapes.push(new Shape("rgba(255, 255, 255, " + (1-(i*0.2)) + ")", 400+i*80, 8, 20));
        }
    }

    function resizeCanvas() {
        canvasWidth = window.innerWidth,
        canvasHeight = window.innerHeight,
        canvas.width = canvasWidth;
        canvas.height = canvasHeight;
    };

    function sineCircleXYatAngle(cx,cy,radius,amplitude,delta,angle,sineCount,rotation){
        let x = cx+(radius+(amplitude+delta)*Math.sin(sineCount*angle))*Math.cos(angle+rotation);
        let y = cy+(radius+(amplitude+delta)*Math.sin(sineCount*angle))*Math.sin(angle+rotation);
        return({x:x,y:y});
    }

    function handleMouseMove(event) {
        mouseX = event.clientX;
        mouseY = event.clientY;
    }

    function randomAngle() {
        return 360 * Math.random();
    }

    function randomDelta() {
        return (Math.random() - Math.random()) / 10;
    }

};