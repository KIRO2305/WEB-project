const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

// Параметры игры
const ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 2;
let dy = -2;
const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

// Массив для кирпичей
const brickRowCount = 3;
const brickColumnCount = 5;
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;
let bricks = [];

// Инициализация массива кирпичей
for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 }; // 1 - кирпич есть
  }
}

// Функция рисования мяча
function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Функция рисования платформы
function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#0095DD";
  ctx.fill();
  ctx.closePath();
}

// Функция рисования кирпичей
function drawBricks() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status == 1) {
        const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
        const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
        bricks[c][r].x = brickX;
        bricks[c][r].y = brickY;

        ctx.beginPath();
        ctx.rect(brickX, brickY, brickWidth, brickHeight);
        ctx.fillStyle = "#0095DD";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

// Функция для столкновения мяча с кирпичами
function collisionDetection() {
  let bricksLeft = 0;
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status == 1) {
        bricksLeft++;
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0; // Удаляем кирпич
        }
      }
    }
  }

  // Если все кирпичи разрушены, показываем сообщение "You Win"
  if (bricksLeft === 0) {
    showWinScreen();
  }
}

function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height); // Очистка canvas
  drawBall();
  drawPaddle();
  drawBricks();
  collisionDetection(); // Проверка столкновения с кирпичами

  // Движение мяча
  x += dx;
  y += dy;

  // Отскок от стен
  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) {
    dx = -dx;
  }
  if (y + dy < ballRadius) {
    dy = -dy;
  } else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      showGameOverScreen(); // Показать экран Game Over
    }
  }

  // Управление платформой
  if (rightPressed) {
    paddleX += 7;
    if (paddleX + paddleWidth > canvas.width) {
      paddleX = canvas.width - paddleWidth;
    }
  } else if (leftPressed) {
    paddleX -= 7;
    if (paddleX < 0) {
      paddleX = 0;
    }
  }
}

document.addEventListener("keydown", keyDownHandler, false);
document.addEventListener("keyup", keyUpHandler, false);

function keyDownHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = true;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = true;
  }
}

function keyUpHandler(e) {
  if (e.key == "Right" || e.key == "ArrowRight") {
    rightPressed = false;
  } else if (e.key == "Left" || e.key == "ArrowLeft") {
    leftPressed = false;
  }
}

// Экран приветствия
function showWelcomeScreen() {
  document.getElementById('welcomeScreen').style.display = 'flex';
  document.getElementById('gameCanvas').style.display = 'none'; // Скрыть canvas
  document.getElementById('gameControls').style.display = 'none'; // Скрыть кнопки управления
}

function startGame() {
  document.getElementById('welcomeScreen').style.display = 'none'; // Скрыть экран приветствия
  document.getElementById('gameCanvas').style.display = 'block'; // Показать canvas
  document.getElementById('gameControls').style.display = 'none'; // Убираем кнопки управления
  interval = setInterval(draw, 10);
}

// Экран Game Over
function showGameOverScreen() {
  clearInterval(interval); // Остановить игру
  document.getElementById('gameOverScreen').style.display = 'flex';
  document.getElementById('gameCanvas').style.display = 'none';
}

function restartGame() {
  // Убираем экран "You Win" и "Game Over"
  document.getElementById('gameOverScreen').style.display = 'none';
  document.getElementById('winScreen').style.display = 'none';
  document.getElementById('gameCanvas').style.display = 'block'; // Показываем canvas снова

  // Сбросить параметры игры
  resetGameParameters();

  // Перезапуск игры: создаём новый интервал для игрового цикла
  interval = setInterval(draw, 10); // Начинаем игру заново
}


function goHome() {
  // Вернуться на экран приветствия
  document.getElementById('gameOverScreen').style.display = 'none';
  document.getElementById('winScreen').style.display = 'none';
  showWelcomeScreen();
}

function resetGameParameters() {
  // Сброс параметров игры
  x = canvas.width / 2;
  y = canvas.height - 30;
  dx = 2;
  dy = -2;
  paddleX = (canvas.width - paddleWidth) / 2;

  // Сбросить кирпичи
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      bricks[c][r].status = 1;
    }
  }
}

function showWinScreen() {
  // Остановить игру и показать сообщение "You Win"
  clearInterval(interval);
  document.getElementById('gameCanvas').style.display = 'none';

  // Создание сообщения "You Win"
  const winMessage = document.createElement('div');
  winMessage.id = 'winMessage'; // Установим id для стилей
  winMessage.style.fontSize = '24px';
  winMessage.style.fontWeight = 'bold';
  winMessage.style.color = 'Red';
  winMessage.innerHTML = 'You Win';
  winMessage.style.position = 'absolute';
  winMessage.style.top = '50%';
  winMessage.style.left = '50%';
  winMessage.style.transform = 'translate(-50%, -50%)'; // Центрирование сообщения

 

  // Создаем контейнер для сообщения и кнопки
  const winScreen = document.createElement('div');
  winScreen.id = 'winScreen'; // Установим id для стилей
  winScreen.appendChild(winMessage);
  winScreen.appendChild(restartButton);

  document.body.appendChild(winScreen);

  // Удалим сообщение через 2 секунды
  setTimeout(() => {
    winScreen.remove();
  }, 2000);
}

// Показать экран приветствия при загрузке страницы
showWelcomeScreen();
