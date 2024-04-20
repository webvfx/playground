// Amount of particles created per click
const PARTICLE_COUNT = 100;
// Array of active Particle instances
const ACTIVE_PARTICLES = [];
// Amount of frames particles should live
const PARTICLE_LIFESPAN_FRAMES = 200;

const GRAVITY = 0.06;
const AIR_RESISTANCE = 0.02;

const CONFETTI_COLOR_PRESETS = [
  "255, 99, 71", // Tomato (Red)
  "70, 130, 180", // Steel Blue (Blue)
  "255, 215, 0", // Gold (Yellow)
  "255, 192, 203", // Pink (Pastel Pink)
  "173, 216, 230", // Light Blue (Pastel Blue)
  "255, 218, 185", // Peach (Pastel Orange)
  "240, 128, 128", // Light Coral (Pastel Red)
  // Add more colors as needed
];

const FIRING_SPREAD = 20;

const canvas = document.querySelector("canvas");
const context = canvas.getContext("2d");

// set canvas size
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

// add resize handler
window.addEventListener("resize", () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
});

class Particle {
  constructor(options) {
    this.x = options.x;
    this.y = options.y;
    this.lifespan = 0;
    this.color = CONFETTI_COLOR_PRESETS[Math.floor(Math.random() * CONFETTI_COLOR_PRESETS.length)];

    const radFiringSpread = FIRING_SPREAD * (Math.PI / 180);
    const randomAngle = -(Math.random() * radFiringSpread) * (Math.random() < 0.5 ? -1 : 1);

    this.vy = -(Math.random() * 12 + 9);
    this.vx = Math.tan(randomAngle) * Math.abs(this.vy);

    this.shape = Math.random() < 0.5 ? "rectangle" : "circle";

    this.rotationAngle = Math.random() * Math.PI * 2;
    this.rotationSpeed = Math.random() > 0.5 ? 0.02 : -0.02;

    // circle
    this.radiusY = 5;
    this.radiusX = Math.floor(Math.random() * 6);

    // rectangle
    this.height = 10;
    this.width = Math.floor(Math.random() * 11);

    this.shrinking = Math.random() < 0.5;
  }

  draw() {
    const progress = this.lifespan / PARTICLE_LIFESPAN_FRAMES;
    const alpha = 1 - progress;
    const fillStyle = `rgba(${this.color},1)`;

    context.beginPath();
    context.save();

    if (this.shape === "rectangle") {
      // Calculate the center point of the rectangle
      const centerX = this.x + this.width / 2;
      const centerY = this.y + this.height / 2;

      // Matrix transformation
      context.translate(centerX, centerY);
      context.rotate(this.rotationAngle);
      context.translate(-centerX, -centerY);

      context.rect(this.x, this.y, this.width, this.height);
    } else {
      // Calculate the center point of the rectangle
      const centerX = this.x + 5;
      const centerY = this.y + 5;

      // Matrix transformation
      context.translate(centerX, centerY);
      context.rotate(this.rotationAngle);
      context.translate(-centerX, -centerY);
      context.ellipse(this.x, this.y, this.radiusX, this.radiusY, 0, 0, 2 * Math.PI);
    }

    context.fillStyle = fillStyle;
    context.fill();

    context.restore();
    context.closePath(); // Close the path (optional)
  }

  update() {
    // Apply gravity
    this.vy += GRAVITY;

    // Apply air resistance
    this.vx *= 1 - AIR_RESISTANCE;
    this.vy *= 1 - AIR_RESISTANCE;

    // Update position based on the velocity
    this.x += this.vx;
    this.y += this.vy;

    // Remove particles past it's lifespan
    if (this.lifespan > PARTICLE_LIFESPAN_FRAMES) {
      const index = ACTIVE_PARTICLES.indexOf(this);
      if (index !== -1) {
        ACTIVE_PARTICLES.splice(index, 1);
        return;
      }
    }

    if (this.shape === "circle") {
      // Adjust the radiusX value based on the shrinking state
      if (this.shrinking) {
        this.radiusX -= 0.2;
      } else {
        this.radiusX += 0.2;
      }

      // Ensure radiusX stays within the bounds
      if (this.radiusX <= 0) {
        this.radiusX = 0;
        this.shrinking = false;
      } else if (this.radiusX >= 5) {
        this.radiusX = 5;
        this.shrinking = true;
      }
    } else {
      if (this.shrinking) {
        this.width -= 0.2;
      } else {
        this.width += 0.2;
      }

      // Ensure width stays within the bounds
      if (this.width <= 0) {
        this.width = 0;
        this.shrinking = false;
      } else if (this.width >= 10) {
        this.width = 10;
        this.shrinking = true;
      }
    }

    this.rotationAngle += this.rotationSpeed; // Apply rotation speed

    // increment the lisfespan of this particle
    this.lifespan++;
    this.draw();
  }
}

const createNewParticles = (event) => {
  const { x, y } = event;

  for (let i = 0; i < PARTICLE_COUNT; i++) {
    const particle = new Particle({ x, y });
    ACTIVE_PARTICLES.push(particle);
  }
};

canvas.addEventListener("mousedown", createNewParticles);

const animationLoop = () => {
  // clear canvas
  context.clearRect(0, 0, innerWidth, innerHeight);

  // draw each particle
  for (let i = 0; i < ACTIVE_PARTICLES.length; i++) {
    ACTIVE_PARTICLES[i].update();
  }

  // Schedule next animation frame by invoking requestAnimationFrame
  requestAnimationFrame(animationLoop);
};

animationLoop();
