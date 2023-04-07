const GAME_SPEED = 100;  // the shorter the faster
const GRID_SIZE = 16;

class SnakeGame {
  #canvas;
  #ctx;
  #width;
  #height;
  #snake;
  #dx;
  #dy;
  #foodX;
  #foodY;
  #isChangingDir;

  constructor() {
    this.#canvas = document.querySelector('#gameCanvas');
    this.#ctx = this.#canvas.getContext('2d');
    this.#width = this.#canvas.width;
    this.#height = this.#canvas.height;
    this.#snake = [
      {x : GRID_SIZE * 10, y : GRID_SIZE * 10},
      {x : GRID_SIZE * 10 - 1 * GRID_SIZE, y : GRID_SIZE * 10},
      {x : GRID_SIZE * 10 - 2 * GRID_SIZE, y : GRID_SIZE * 10},
      {x : GRID_SIZE * 10 - 3 * GRID_SIZE, y : GRID_SIZE * 10},
      {x : GRID_SIZE * 10 - 4 * GRID_SIZE, y : GRID_SIZE * 10},
    ]
    this.#dx = GRID_SIZE;
    this.#dy = 0;
    this.#foodX = 0;
    this.#foodY = 0;
    this.#isChangingDir = false;
    this.score = 0;
  }

  initialize() {
    this.#ctx.linewidth = GRID_SIZE;
    this.#ctx.strokeRect(0, 0, 300, 300);
    this.#createFood();
    document.addEventListener('keydown', (event) => {
      this.#changeDirection(event)
    });
  }

  start() {
    if (this.#didEnd()) return;
    setTimeout(() => {
      this.#isChangingDir = false;
      this.#clearCanvas();
      this.#drawFood();
      this.#updateSnake();
      this.#drawSnake();

      this.start();
    }, GAME_SPEED);
  }

  #changeDirection(event) {
    if (this.#isChangingDir) return;
    this.#isChangingDir = true;

    const callback = {
      "ArrowLeft" : () => {if (this.#dx != GRID_SIZE) this.#dx = -GRID_SIZE; this.#dy = 0;},
      "ArrowRight" : () => {if (this.#dx != -GRID_SIZE) this.#dx = GRID_SIZE; this.#dy = 0;},
      "ArrowUp" : () => {this.#dx = 0; if (this.#dy != GRID_SIZE) this.#dy = -GRID_SIZE;},
      "ArrowDown" : () => {this.#dx = 0; if (this.#dy != -GRID_SIZE) this.#dy = GRID_SIZE;},
    }[event.key]
    callback?.()
  }

  #updateSnake() {
    const head = {x: this.#snake[0].x + this.#dx, y: this.#snake[0].y + this.#dy};  // either dx or dy has to be 0
    this.#snake.unshift(head);
    // console.log(this.#foodX, this.#foodY, this.#snake[0].x, this.#snake[0].y);
    if (this.#snake[0].x === this.#foodX && this.#snake[0].y === this.#foodY) {
      ++this.score;
      document.getElementById('score').innerHTML = this.score;
      this.#createFood();
    }else {
      this.#snake.pop();
    }
  }

  #drawSnake() {
    this.#snake.forEach((snakePart) => {
      this.#ctx.fillStyle = 'lightgreen';
      this.#ctx.strokeStyle = 'darkgreen';
      this.#ctx.fillRect(snakePart.x, snakePart.y, GRID_SIZE, GRID_SIZE);
      this.#ctx.strokeRect(snakePart.x, snakePart.y, GRID_SIZE, GRID_SIZE);
    });
  }

  #clearCanvas() {
    this.#ctx.fillStyle = "white";
    this.#ctx.strokeStyle = "black";
    this.#ctx.fillRect(0, 0, this.#width, this.#height);
    this.#ctx.strokeRect(0, 0, this.#width, this.#height);
  }

  #createFood() {
    this.#foodX = Math.floor((Math.random() * (this.#width / GRID_SIZE))) * GRID_SIZE;
    this.#foodY = Math.floor((Math.random() * (this.#height / GRID_SIZE))) * GRID_SIZE;

    // make sure that the food is not created where the snake currently is
    this.#snake.forEach((part) => {
      if (part.x === this.#foodX && part.y === this.#foodY) {
        this.#createFood()
      }
    });
  }

  #drawFood() {
    this.#ctx.fillStyle = 'red';
    this.#ctx.strokeStyle = 'darkred';
    this.#ctx.fillRect(this.#foodX, this.#foodY, GRID_SIZE, GRID_SIZE);
    this.#ctx.strokeRect(this.#foodX, this.#foodY, GRID_SIZE, GRID_SIZE);
  }

  #didEnd() {
    // check if the snake collided with itself
    if ((this.#snake[0].x < 0)
      || (this.#snake[0].x > this.#width - GRID_SIZE)
      || (this.#snake[0].y < 0)
      || (this.#snake[0].y > this.#height - GRID_SIZE)) {
      return true;
    }

    // check if the snake collided with a wall
    for (let i = 4; i < this.#snake.length; ++i) {
      if ((this.#snake[0].x === this.#snake[i].x && this.#snake[0].y === this.#snake[i].y)) {
        return true;
      }
    }

    return false;
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const game = new SnakeGame();
  game.initialize();

  game.start();
});
