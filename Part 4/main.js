// setup canvas

const canvas = document.querySelector("canvas");
const ctx = canvas.getContext("2d");

const width = (canvas.width = window.innerWidth);
const height = (canvas.height = window.innerHeight);

// function to generate random number

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// function to generate random color

function randomRGB() {
  return `rgb(${random(0, 255)},${random(0, 255)},${random(0, 255)})`;
}

let score = 25;  // Initial number of balls
const scoreElement = document.getElementById("score");

function updateScore() {
  scoreElement.textContent = score;
}

class Shape{
  constructor(x,y,velX,velY){
    this.x = x;
    this.y = y;
    this.velX = velX;
    this.velY = velY;
  }
}
class EvilCircle extends Shape{
  constructor(x,y){
    super(x,y,20,20);
    this.color = 'white';
    this.size = 10;
    window.addEventListener("keydown", (e) => {
      switch (e.key) {
        case "a":
          this.x -= this.velX;
          break;
        case "d":
          this.x += this.velX;
          break;
        case "w":
          this.y -= this.velY;
          break;
        case "s":
          this.y += this.velY;
          break;
      }
    });
    
  }
  draw() {
    ctx.beginPath();
    ctx.lineWidth = 3;
    ctx.strokeStyle = this.color;
    ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
    ctx.stroke();
  }
  checkBounds() {
    if ((this.x + this.size) >= width) {
      this.x = width - this.size;
    }
    
    if ((this.x - this.size) <= 0) {
      this.x = this.size;
    }
  
    if ((this.y + this.size) >= height) {
      this.y = height - this.size;
    }
    
    if ((this.y - this.size) <= 0) {
      this.y = this.size;
    }
  }
  collisionDetect() {
    for (const ball of balls) {

      if (ball.exists) {
        const dx = this.x - ball.x;
        const dy = this.y - ball.y;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance < this.size + ball.size) {
      
          ball.exists = false;
          score--;  
        }
      }
    }
  }
}
class Ball extends Shape {
    constructor(x, y, velX, velY, color, size) {
      super(x,y,velX,velY)
      this.color = color;
      this.size = size;
      this.exists = true;
    }

    draw() {
        ctx.beginPath();
        ctx.fillStyle = this.color;
        ctx.arc(this.x, this.y, this.size, 0, 2 * Math.PI);
        ctx.fill();
    }

    update() {
      if ((this.x + this.size) >= width) {
        this.velX = -(this.velX);
      }
      
      if ((this.x - this.size) <= 0) {
        this.velX = -(this.velX);
      }
    
      if ((this.y + this.size) >= height) {
        this.velY = -(this.velY);
      }
      
      if ((this.y - this.size) <= 0) {
        this.velY = -(this.velY);
      }
      
      this.x += this.velX;
      this.y += this.velY;
    }
    
    
    collisionDetect() {
      for (const ball of balls) {
        if (!(this === ball) && ball.exists) {
          const dx = this.x - ball.x;
          const dy = this.y - ball.y;
          const distance = Math.sqrt(dx * dx + dy * dy);
    
          if (distance < this.size + ball.size) {
            ball.color = this.color = randomRGB();
          }
        }
      }
    }
     
  }
  



const balls = [];

while (balls.length < 25) {
  const size = random(10, 20);
  const ball = new Ball(
    // ball position always drawn at least one ball width
    // away from the edge of the canvas, to avoid drawing errors
    random(0 + size, width - size),
    random(0 + size, height - size),
    random(-7, 7),
    random(-7, 7),
    randomRGB(),
    size,
  );

  balls.push(ball);
}
const evilCirlce = new EvilCircle(
  random(0 + 10, width - 10),
  random(0 + 10, height - 10)
)
function loop() {
  ctx.fillStyle = "rgb(0 0 0 / 25%)";
  ctx.fillRect(0, 0, width, height);


  for (const ball of balls) {
    if(ball.exists == true){
      ball.draw();
      ball.update();
      ball.collisionDetect();
    }
  }
  evilCirlce.draw();
  evilCirlce.checkBounds();
  evilCirlce.collisionDetect();

  updateScore();

  requestAnimationFrame(loop);
}
loop();


  