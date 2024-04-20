const confettiConfig = {
    // Amount of particles created per click
    particleCount: 100,
    // Array of active Particle instances
    activeParticles: [],
    // Amount of frames particles should live
    lifespanFrames: 200,
    // Gravity affecting particles
    gravity: 0.06,
    // Air resistance affecting particles
    airResistance: 0.02,
    // Preset colors for confetti in RGB
    confettiColorPresets: [
        "255, 99, 71", // Tomato (Red)
        "70, 130, 180", // Steel Blue (Blue)
        "255, 215, 0", // Gold (Yellow)
        "255, 192, 203", // Pink (Pastel Pink)
        "173, 216, 230", // Light Blue (Pastel Blue)
        "255, 218, 185", // Peach (Pastel Orange)
        "240, 128, 128", // Light Coral (Pastel Red)
    ],
    // Spread or width of the firing cone
    firingSpread: 20,
};
  
const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

// Set up an OffscreenCanvas
const offscreenCanvas = new OffscreenCanvas(canvas.width, canvas.height);
const offscreenContext = offscreenCanvas.getContext("2d");

// set canvas size
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// add resize handler
window.addEventListener("resize", () => {
    canvas.height = window.innerHeight;
    canvas.width = window.innerWidth;
    offscreenCanvas.width = canvas.width;
    offscreenCanvas.height = canvas.height;
});
  
  
export class Particle {
    constructor(options) {
        this.x = options.x;
        this.y = options.y;
        this.lifespan = 0;
        this.color = confettiConfig.confettiColorPresets[Math.floor(Math.random() * confettiConfig.confettiColorPresets.length)];

        const radFiringSpread = confettiConfig.firingSpread * (Math.PI / 180);
        const randomAngle = -(Math.random() * radFiringSpread) * (Math.random() < 0.5 ? -1 : 1);

        this.vy = -(Math.random() * 12 + 9);
        this.vx = Math.tan(randomAngle) * Math.abs(this.vy);

        this.rotationAngle = Math.random() * Math.PI * 2;
        this.rotationSpeed = Math.random() > 0.5 ? 0.02 : -0.02;

        this.shrinking = Math.random() < 0.5;
        this.sizeIncrement = 0.2;
    }

    getFillStyle() {
        const progress = this.lifespan / confettiConfig.lifespanFrames;
        const alpha = 1 - progress;

        return `rgba(${this.color},${alpha})`;
    }

    updatePhysics() {
        // Apply gravity
        this.vy += GRAVITY;

        // Apply air resistance
        this.vx *= 1 - confettiConfig.airResistance;
        this.vy *= 1 - confettiConfig.airResistance;

        // Update position based on the velocity
        this.x += this.vx;
        this.y += this.vy;

        // Apply rotation speed
        this.rotationAngle += this.rotationSpeed;

        // Increase lifespan
        this.lifespan++;
    }

    updateSize(propertyName, maxValue) {
        if (this.shrinking) {
        this[propertyName] -= sizeIncrement;
        } else {
        this[propertyName] += sizeIncrement;
        }

        if (this[propertyName] <= 0) {
        this[propertyName] = 0;
        this.shrinking = false;
        } else if (this[propertyName] >= maxValue) {
        this[propertyName] = maxValue;
        this.shrinking = true;
        }
    }

    draw() {
        throw new Error("draw method must be implemented by subclass.");
    }

    update() {
        throw new Error("update method must be implemented by subclass.");
    }
}

class Circle extends Particle {
    constructor(options) {
        super(options);

        this.radiusY = 5;
        this.radiusX = Math.floor(Math.random() * 6);
    }

    draw() {
        offscreenContext.beginPath();
        offscreenContext.save();

        const centerX = this.x + 5;
        const centerY = this.y + 5;

        // Matrix transformation
        offscreenContext.translate(centerX, centerY);
        offscreenContext.rotate(this.rotationAngle);
        offscreenContext.translate(-centerX, -centerY);
        offscreenContext.ellipse(this.x, this.y, this.radiusX, this.radiusY, 0, 0, 2 * Math.PI);

        offscreenContext.fillStyle = this.getFillStyle();
        offscreenContext.fill();

        offscreenContext.restore();
        offscreenContext.closePath();
    }

    update() {
        this.updatePhysics();
        this.updateSize("radiusX", 5);
        this.draw();
    }
}

class Rectangle extends Particle {
    constructor(options) {
        super(options);

        this.height = 10;
        this.width = Math.floor(Math.random() * 11);
    }

    draw() {
        offscreenContext.beginPath();
        offscreenContext.save();

        const centerX = this.x + this.width / 2;
        const centerY = this.y + this.height / 2;

        offscreenContext.translate(centerX, centerY);
        offscreenContext.rotate(this.rotationAngle);
        offscreenContext.translate(-centerX, -centerY);

        offscreenContext.rect(this.x, this.y, this.width, this.height);

        offscreenContext.fillStyle = this.getFillStyle();
        offscreenContext.fill();

        offscreenContext.restore();
        offscreenContext.closePath();
    }

    update() {
        this.updatePhysics();
        this.updateSize("width", 10);
        this.draw();
    }
}

const createNewParticles = (event) => {
    const { x, y } = event;

    for (let i = 0; i < confettiConfig.particleCount; i++) {
        const particle = new Particle({ x, y });
        confettiConfig.activeParticles.push(particle);
    }
};

canvas.addEventListener("mousedown", createNewParticles);

const animationLoop = () => {
    // Clear the offscreen canvas
    offscreenContext.clearRect(0, 0, canvas.width, canvas.height);
  
    // Update and draw each particle offscreen
    for (let i = 0; i < confettiConfig.activeParticles.length; i++) {
      confettiConfig.activeParticles[i].update();
    }
  
    // Clear the main canvas and draw the offscreen canvas onto it
    context.clearRect(0, 0, canvas.width, canvas.height);
    context.drawImage(offscreenCanvas, 0, 0);
  
    // Schedule the next frame
    requestAnimationFrame(animationLoop);
};

animationLoop();
  