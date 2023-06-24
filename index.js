window.addEventListener("load", function () {
  /**@type{HTMLCanvasElement} */
  const canvas = document.getElementById("canvas1");
  const ctx = canvas.getContext("2d");
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  let index;

  let particleArray = [];
  let numOfParticles = 150;
  let pointer = {
    x: canvas.width * 0.5,
    y: canvas.height * 0.5,
    radius: 120,
    pressed: false,
  };
  let grad = ctx.createLinearGradient(0, 0, canvas.width, canvas.height);
  grad.addColorStop(0, "white");
  grad.addColorStop(1, "gold");
  class Sun {
    constructor() {
      this.x = pointer.x;
      this.y = pointer.y;
      this.radius = 50;
      this.image = document.getElementById("sunImg");
    }
    draw() {
      // ctx.beginPath();
      // ctx.fillStyle = `orange`;
      // ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      // ctx.fill();
      // ctx.closePath();

      ctx.drawImage(this.image, this.x - this.radius * 2, this.y - this.radius);
    }
  }
  const sun = new Sun();

  class Particle {
    constructor() {
      this.radius = Math.floor(Math.random() * 5 + 3);
      this.x = Math.floor(
        Math.random() * (canvas.width - this.radius * 2 - this.radius * 2) +
          this.radius * 3
      );
      this.y = Math.floor(
        Math.random() * (canvas.height - this.radius * 2 - this.radius * 2) +
          this.radius * 2
      );
      this.density = Math.random() * 40 + 20;
      this.vx = Math.random() * 5 - 2.5;
      this.vy = Math.random() * 5 - 2.5;
      this.basePosX = this.x;
      this.basePosY = this.y;
      this.maxDistance = 100;
      this.friction = 0.8;
    }
    draw() {
      ctx.beginPath();
      ctx.fillStyle = grad;
      ctx.arc(this.x, this.y, this.radius, 0, Math.PI * 2);
      ctx.fill();
      ctx.closePath();
    }
    update() {
      this.x += this.vx;
      this.y += this.vy;

      //Edges

      if (this.x > canvas.width - this.radius) {
        this.x = canvas.width - this.radius;
        this.vx = this.vx * -1;
      } else if (this.x < this.radius) {
        this.x = this.radius;
        this.vx = this.vx * -1;
      }

      if (this.y > canvas.height - this.radius) {
        this.y = canvas.height - this.radius;
        this.vy = this.vy * -1;
      } else if (this.y < this.radius) {
        this.y = this.radius;
        this.vy = this.vy * -1;
      }
    }
    connectParticles() {
      for (let i = 0; i < particleArray.length; i++) {
        let dx = particleArray[i].x - pointer.x;
        let dy = particleArray[i].y - pointer.y;
        let distance = Math.hypot(dx, dy);
        if (distance > this.maxDistance) {
          let index = i;
          if (index % 2 === 0) {
            ctx.save();
            ctx.globalAlpha = 0.009;
            ctx.beginPath();
            ctx.strokeStyle = grad;
            ctx.moveTo(particleArray[i].x, particleArray[i].y);
            ctx.lineTo(pointer.x, pointer.y);
            ctx.stroke();
            ctx.closePath();
            ctx.restore();
          }
        }
      }
    }
    pushParticles() {
      let dx = this.x - pointer.x;
      let dy = this.y - pointer.y;
      let distance = Math.hypot(dx, dy);
      let angle = Math.atan2(dy, dx);

      if (pointer.pressed && distance > pointer.radius) {
        this.x += Math.cos(angle) * (pointer.radius / distance) * this.friction;
        this.y += Math.sin(angle) * (pointer.radius / distance) * this.friction;
      } else {
        if (this.x !== this.basePosX) {
          let dx = this.x - this.basePosX;
          this.x += dx / 20;
        }
        if (this.y !== this.basePosY) {
          let dy = this.y - this.basePosY;
          this.y += dy / 20;
        }
      }
    }
  }

  function initParticles() {
    for (let i = 0; i < numOfParticles; i++) {
      particleArray.push(new Particle());
    }
  }
  initParticles();

  function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (let i = 0; i < particleArray.length; i++) {
      particleArray[i].connectParticles();
      particleArray[i].draw();
      particleArray[i].update();
    }
    sun.draw();

    requestAnimationFrame(animate);
  }

  animate();

  canvas.addEventListener("pointerdown", (e) => {
    pointer.pressed = true;
  });
  canvas.addEventListener("pointermove", (e) => {
    if (pointer.pressed) {
      pointer.x = e.x;
      pointer.y = e.y;
      sun.x = e.x;
      sun.y = e.y;
      particleArray.forEach((particle) => {
        particle.pushParticles();
      });
    }
  });

  canvas.addEventListener("pointerup", (e) => {
    pointer.pressed = false;
  });

  window.addEventListener("resize", (e) => {
    location.reload();
  });
});
