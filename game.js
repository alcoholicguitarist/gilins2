// Beginner-friendly 2D side-scrolling platformer prototype.
// No external libraries are used. Everything is drawn on the HTML canvas.

const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");
const message = document.getElementById("message");

const world = {
  width: 3200,
  height: canvas.height,
  gravity: 0.75,
  floorY: 500
};

const keys = {
  left: false,
  right: false,
  jump: false,
  attack: false
};

const camera = {
  x: 0
};

const player = {
  x: 80,
  y: 390,
  width: 38,
  height: 54,
  vx: 0,
  vy: 0,
  speed: 4.2,
  jumpPower: 14,
  onGround: false,
  facing: 1,
  coins: 0,
  lives: 3,
  attackTimer: 0,
  invincibleTimer: 0
};

const platforms = [
  { x: 0, y: 500, width: 700, height: 40 },
  { x: 780, y: 450, width: 250, height: 32 },
  { x: 1120, y: 390, width: 220, height: 32 },
  { x: 1450, y: 500, width: 650, height: 40 },
  { x: 2180, y: 430, width: 260, height: 32 },
  { x: 2520, y: 360, width: 220, height: 32 },
  { x: 2820, y: 500, width: 380, height: 40 }
];

const coins = [
  { x: 210, y: 430, collected: false },
  { x: 840, y: 390, collected: false },
  { x: 1190, y: 330, collected: false },
  { x: 1570, y: 430, collected: false },
  { x: 2310, y: 370, collected: false },
  { x: 2595, y: 300, collected: false }
];

const spikes = [
  { x: 560, y: 470, width: 40, height: 30 },
  { x: 1740, y: 470, width: 40, height: 30 },
  { x: 2940, y: 470, width: 40, height: 30 }
];

const enemies = [
  { x: 910, y: 408, width: 36, height: 42, vx: 1.2, minX: 800, maxX: 1000, alive: true },
  { x: 1870, y: 458, width: 36, height: 42, vx: 1.5, minX: 1500, maxX: 2050, alive: true },
  { x: 2870, y: 458, width: 36, height: 42, vx: 1.3, minX: 2830, maxX: 3130, alive: true }
];

const goal = {
  x: 3100,
  y: 390,
  width: 44,
  height: 110
};

let gameWon = false;

function rectsOverlap(a, b) {
  return (
    a.x < b.x + b.width &&
    a.x + a.width > b.x &&
    a.y < b.y + b.height &&
    a.y + a.height > b.y
  );
}

function resetPlayer() {
  player.x = 80;
  player.y = 390;
  player.vx = 0;
  player.vy = 0;
  player.invincibleTimer = 90;
}

function hurtPlayer() {
  if (player.invincibleTimer > 0 || gameWon) {
    return;
  }

  player.lives -= 1;
  message.textContent = `Ouch! Lives left: ${player.lives}`;

  if (player.lives <= 0) {
    player.lives = 3;
    player.coins = 0;
    coins.forEach((coin) => (coin.collected = false));
    enemies.forEach((enemy) => (enemy.alive = true));
    message.textContent = "Game reset. Try again!";
  }

  resetPlayer();
}

function attackBox() {
  return {
    x: player.facing === 1 ? player.x + player.width : player.x - 34,
    y: player.y + 12,
    width: 34,
    height: 24
  };
}

function updatePlayer() {
  player.vx = 0;

  if (keys.left) {
    player.vx = -player.speed;
    player.facing = -1;
  }

  if (keys.right) {
    player.vx = player.speed;
    player.facing = 1;
  }

  if (keys.jump && player.onGround) {
    player.vy = -player.jumpPower;
    player.onGround = false;
  }

  if (keys.attack && player.attackTimer <= 0) {
    player.attackTimer = 18;
  }

  player.x += player.vx;
  player.x = Math.max(0, Math.min(player.x, world.width - player.width));

  player.vy += world.gravity;
  player.y += player.vy;
  player.onGround = false;

  platforms.forEach((platform) => {
    if (rectsOverlap(player, platform)) {
      const previousBottom = player.y + player.height - player.vy;

      if (previousBottom <= platform.y) {
        player.y = platform.y - player.height;
        player.vy = 0;
        player.onGround = true;
      }
    }
  });

  if (player.y > world.height + 120) {
    hurtPlayer();
  }

  if (player.attackTimer > 0) {
    player.attackTimer -= 1;
  }

  if (player.invincibleTimer > 0) {
    player.invincibleTimer -= 1;
  }
}

function updateEnemies() {
  enemies.forEach((enemy) => {
    if (!enemy.alive) {
      return;
    }

    enemy.x += enemy.vx;

    if (enemy.x <= enemy.minX || enemy.x + enemy.width >= enemy.maxX) {
      enemy.vx *= -1;
    }

    if (player.attackTimer > 0 && rectsOverlap(attackBox(), enemy)) {
      enemy.alive = false;
      message.textContent = "Enemy defeated!";
      return;
    }

    if (rectsOverlap(player, enemy)) {
      const playerWasAbove = player.y + player.height - player.vy <= enemy.y + 8;

      if (playerWasAbove && player.vy > 0) {
        enemy.alive = false;
        player.vy = -9;
        message.textContent = "Stomp!";
      } else {
        hurtPlayer();
      }
    }
  });
}

function updateCollectiblesAndHazards() {
  coins.forEach((coin) => {
    const coinRect = { x: coin.x - 12, y: coin.y - 12, width: 24, height: 24 };

    if (!coin.collected && rectsOverlap(player, coinRect)) {
      coin.collected = true;
      player.coins += 1;
      message.textContent = `Coin collected! Coins: ${player.coins}`;
    }
  });

  spikes.forEach((spike) => {
    if (rectsOverlap(player, spike)) {
      hurtPlayer();
    }
  });

  if (rectsOverlap(player, goal)) {
    gameWon = true;
    message.textContent = `You reached the flag with ${player.coins} coins! Refresh to play again.`;
  }
}

function updateCamera() {
  camera.x = player.x - canvas.width * 0.4;
  camera.x = Math.max(0, Math.min(camera.x, world.width - canvas.width));
}

function update() {
  if (!gameWon) {
    updatePlayer();
    updateEnemies();
    updateCollectiblesAndHazards();
    updateCamera();
  }
}

function drawSky() {
  ctx.fillStyle = "#87ceeb";
  ctx.fillRect(0, 0, canvas.width, canvas.height);

  ctx.fillStyle = "rgba(255, 255, 255, 0.8)";
  for (let i = 0; i < 6; i += 1) {
    const cloudX = (i * 280 - camera.x * 0.35) % (canvas.width + 240);
    ctx.beginPath();
    ctx.arc(cloudX, 80 + (i % 2) * 42, 24, 0, Math.PI * 2);
    ctx.arc(cloudX + 26, 70 + (i % 2) * 42, 30, 0, Math.PI * 2);
    ctx.arc(cloudX + 58, 82 + (i % 2) * 42, 22, 0, Math.PI * 2);
    ctx.fill();
  }
}

function drawWorldObject(drawFunction) {
  ctx.save();
  ctx.translate(-camera.x, 0);
  drawFunction();
  ctx.restore();
}

function drawPlatforms() {
  platforms.forEach((platform) => {
    ctx.fillStyle = "#6b4f2a";
    ctx.fillRect(platform.x, platform.y, platform.width, platform.height);
    ctx.fillStyle = "#22c55e";
    ctx.fillRect(platform.x, platform.y, platform.width, 10);
  });
}

function drawCoins() {
  coins.forEach((coin) => {
    if (coin.collected) {
      return;
    }

    ctx.fillStyle = "#facc15";
    ctx.beginPath();
    ctx.arc(coin.x, coin.y, 13, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#ca8a04";
    ctx.lineWidth = 3;
    ctx.stroke();
  });
}

function drawSpikes() {
  spikes.forEach((spike) => {
    ctx.fillStyle = "#e2e8f0";
    ctx.beginPath();
    ctx.moveTo(spike.x, spike.y + spike.height);
    ctx.lineTo(spike.x + spike.width / 2, spike.y);
    ctx.lineTo(spike.x + spike.width, spike.y + spike.height);
    ctx.closePath();
    ctx.fill();
    ctx.strokeStyle = "#64748b";
    ctx.stroke();
  });
}

function drawEnemies() {
  enemies.forEach((enemy) => {
    if (!enemy.alive) {
      return;
    }

    ctx.fillStyle = "#9333ea";
    ctx.fillRect(enemy.x, enemy.y, enemy.width, enemy.height);
    ctx.fillStyle = "#f8fafc";
    ctx.fillRect(enemy.x + 8, enemy.y + 10, 7, 7);
    ctx.fillRect(enemy.x + 22, enemy.y + 10, 7, 7);
  });
}

function drawGoal() {
  ctx.fillStyle = "#78350f";
  ctx.fillRect(goal.x, goal.y, 8, goal.height);
  ctx.fillStyle = "#ef4444";
  ctx.beginPath();
  ctx.moveTo(goal.x + 8, goal.y + 10);
  ctx.lineTo(goal.x + 74, goal.y + 30);
  ctx.lineTo(goal.x + 8, goal.y + 52);
  ctx.closePath();
  ctx.fill();
}

function drawPlayer() {
  const flicker = player.invincibleTimer > 0 && Math.floor(player.invincibleTimer / 6) % 2 === 0;

  if (flicker) {
    return;
  }

  ctx.fillStyle = "#2563eb";
  ctx.fillRect(player.x, player.y, player.width, player.height);
  ctx.fillStyle = "#fbbf24";
  ctx.fillRect(player.x + 8, player.y + 8, 22, 18);

  ctx.fillStyle = "#0f172a";
  const eyeX = player.facing === 1 ? player.x + 25 : player.x + 9;
  ctx.fillRect(eyeX, player.y + 14, 5, 5);

  if (player.attackTimer > 0) {
    const box = attackBox();
    ctx.fillStyle = "rgba(239, 68, 68, 0.45)";
    ctx.fillRect(box.x, box.y, box.width, box.height);
  }
}

function drawHud() {
  ctx.fillStyle = "rgba(15, 23, 42, 0.75)";
  ctx.fillRect(12, 12, 210, 70);
  ctx.fillStyle = "#f8fafc";
  ctx.font = "20px Arial";
  ctx.fillText(`Coins: ${player.coins}/${coins.length}`, 26, 40);
  ctx.fillText(`Lives: ${player.lives}`, 26, 68);
}

function draw() {
  drawSky();

  drawWorldObject(() => {
    drawPlatforms();
    drawCoins();
    drawSpikes();
    drawEnemies();
    drawGoal();
    drawPlayer();
  });

  drawHud();
}

function gameLoop() {
  update();
  draw();
  requestAnimationFrame(gameLoop);
}

function setButtonState(button, isPressed) {
  button.classList.toggle("pressed", isPressed);
}

function connectTouchButton(buttonId, keyName) {
  const button = document.getElementById(buttonId);

  const press = (event) => {
    event.preventDefault();
    keys[keyName] = true;
    setButtonState(button, true);
  };

  const release = (event) => {
    event.preventDefault();
    keys[keyName] = false;
    setButtonState(button, false);
  };

  button.addEventListener("pointerdown", press);
  button.addEventListener("pointerup", release);
  button.addEventListener("pointercancel", release);
  button.addEventListener("pointerleave", release);
}

window.addEventListener("keydown", (event) => {
  if (["ArrowLeft", "a", "A"].includes(event.key)) keys.left = true;
  if (["ArrowRight", "d", "D"].includes(event.key)) keys.right = true;
  if (["ArrowUp", "w", "W", " "].includes(event.key)) keys.jump = true;
  if (["j", "J", "x", "X"].includes(event.key)) keys.attack = true;
});

window.addEventListener("keyup", (event) => {
  if (["ArrowLeft", "a", "A"].includes(event.key)) keys.left = false;
  if (["ArrowRight", "d", "D"].includes(event.key)) keys.right = false;
  if (["ArrowUp", "w", "W", " "].includes(event.key)) keys.jump = false;
  if (["j", "J", "x", "X"].includes(event.key)) keys.attack = false;
});

connectTouchButton("leftButton", "left");
connectTouchButton("rightButton", "right");
connectTouchButton("jumpButton", "jump");
connectTouchButton("attackButton", "attack");

gameLoop();
