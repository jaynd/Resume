const NUMBER_OF_INSTANCE = 30,
    MIN_RADIUS = 15;
rgbColor = [
    "rgba(0,0,255,0.5)",
    "rgba(180,0,255,0.5)",
    "rgba(254,160,255)",
    "rgba(255,178,215)",
    "rgba(203,178,255)"];
var circleArray = [],
    canvas,
    c,
    myReq,
    header,
    offsetLeft,
    mousePosition = {
        x: undefined,
        y: undefined,
    };

function init() {
    canvas = document.getElementById('canvas');
    offsetLeft = canvas.getBoundingClientRect().left;
    c = canvas.getContext('2d');
    header = document.getElementById('header');
    canvas.width = w = header.offsetWidth;
    canvas.height = h = header.offsetHeight;

    // delete all the instances
    if (circleArray.length > 0) {
        for (var i = 0; i < NUMBER_OF_INSTANCE; i++) {
            delete circleArray[i];
        }
    }
    // create new instances and push on to the array
    circleArray = [];
    for (let i = 0; i < NUMBER_OF_INSTANCE; i++) {
        let radius = Math.max(Math.random() * NUMBER_OF_INSTANCE, MIN_RADIUS);
        let x = Math.random() * (w - radius * 2) + radius;
        let y = Math.random() * (h - radius * 2) + radius;
        let dx = Math.random() * 1;
        let dy = Math.random() * 1;

        circleArray.push(new Circle(x, y, dx, dy, radius));
    }

    circleArray.push(new Cloud(w / 4 * 3, h / 4 * 2));
    circleArray.push(new Cloud(w / 4, h / 4 * 3));
    circleArray.push(new Cloud(w / 4 * 2, h / 4));

}

// circle class
function Circle(x, y, dx, dy, radius) {
    this.x = x;
    this.y = y;
    this.radius = radius;
    this.dx = Math.floor(dx * 10) % 2 === 0 ? dx : -dx;
    this.dy = Math.floor(dy * 10) % 2 === 0 ? dy : -dy;
    this.rgb = rgbColor[Math.floor(Math.random() * 5)];

    this.draw = function () {
        var factor = 1;

        c.fillStyle = this.rgb;
        c.strokeStyle = this.rgb;

        c.beginPath();
        c.arc(this.x, this.y, this.radius * factor, 0, Math.PI * 2, true);
        c.stroke();
        c.closePath();
    }

    this.update = function () {

        if (this.x + this.radius > canvas.offsetWidth || this.x - this.radius < 0) {
            this.dx = -this.dx;
        }

        if (this.y + this.radius > canvas.offsetHeight || this.y - this.radius < 0) {
            this.dy = -this.dy;
        }

        this.x += this.dx;
        this.y += this.dy;

        // interact
        if (mousePosition.x - offsetLeft - this.x < 50 && mousePosition.x - offsetLeft - this.x > -50
            && mousePosition.y - this.y < 50 && mousePosition.y - this.y > -50) {

            this.radius += 1;
        } else if (this.radius > 30) {
            this.radius -= 1;
        }

        this.draw();

    }
}

// Cloud class
function Cloud(x, y) {
    this.x = x;
    this.y = y;

    this.draw = function () {
        c.beginPath();
        c.arc(x, y, 20, Math.PI * 0.5, Math.PI * 1.5);
        c.arc(x + 25, y - 20, 25, Math.PI * 1, Math.PI * 1.85);
        c.arc(x + 50, y - 15, 20, Math.PI * 1.37, Math.PI * 1.91);
        c.arc(x + 70, y, 20, Math.PI * 1.5, Math.PI * 0.5);
        c.moveTo(x + 70, y + 20);
        c.lineTo(x, y + 20);
        c.strokeStyle = '#FFFFFF';
        c.stroke();
        c.fillStyle = "rgba(255, 255, 225, 0.5)";
        c.fill()
    }

    this.update = function () {
        this.draw();
    }
}



function animate() {
    myReq = requestAnimationFrame(animate);
    c.clearRect(0, 0, canvas.offsetWidth, canvas.offsetHeight);

    for (var i = 0; i < circleArray.length; i++) {
        circleArray[i].update();
    }

}

//*********************************************************************
//Events 

function animateCall() {
    if (myReq) {
        cancelAnimationFrame(myReq);
    }
    init();
    animate();
}

window.addEventListener('mousemove', function (event) {

    mousePosition.x = event.x;
    mousePosition.y = event.y;
})


window.addEventListener("load", function (event) {
    animateCall();
});

window.addEventListener("resize", function (event) {
    animateCall();
});