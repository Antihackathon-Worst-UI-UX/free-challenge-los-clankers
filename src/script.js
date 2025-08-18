const loginScreen = document.getElementById("loginScreen");
const posterScreen = document.getElementById("posterScreen");
const gameScreen = document.getElementById("gameScreen");
const game = document.getElementById("game");
const msg = document.getElementById("message");
const posterContinue = document.getElementById("posterContinue");
const music = document.getElementById("bgm");
const music_clear = document.getElementById("bgm_clear");

let round = 0;

const loginBtn = document.getElementById("loginBtn");

// When mouse gets close, button slowly exits screen, then show Wanted Poster
loginBtn.addEventListener("mouseover", () => {
    loginBtn.style.transition = "all 0.5s ease-in-out";
    loginBtn.style.transform = "translateY(-100px)"; // Move up
    loginBtn.style.opacity = "0"; // Fade out
  // After it leaves the screen, switch to poster
  setTimeout(() => {
    loginScreen.style.display = "none";
    posterScreen.style.display = "block";
  }, 2200); // a bit longer than transition time
});



loginBtn.addEventListener("click", () => {
  loginScreen.style.display = "none";
  posterScreen.style.display = "block";
});

posterContinue.addEventListener("click", () => {
  posterScreen.style.display = "none";
  gameScreen.style.display = "block";
  startGame();
  music.play().catch(err => console.log("Autoplay blocked:", err));
});

function startGame() {
  round = 0;
  msg.textContent = "";
  nextRound();
}

function nextRound() {
  round++;
  game.innerHTML = "";
  msg.textContent = `Round ${round}`;

  if (round > 10) {
    msg.textContent = "Access Granted!";
    music.pause();
    music_clear.play().catch(err => console.log("Autoplay blocked:", err));
    // Redirect to rickroll
    setTimeout(() => {
      window.location.href = "https://www.youtube.com/watch?v=9vOjPTcwDB8"; // Also "http://www.patience-is-a-virtue.org/" or "https://www.youtube.com/watch?v=b4XpMTUlorc"
    }, 3000);
    return;
  }

  let numButtons = // 4 then 16 then 25
    round == 1 ? 4 : round == 2 ? 16 : 25 + (round - 3) * 8;
  let targetIndex = Math.floor(Math.random() * numButtons);

  for (let i = 0; i < numButtons; i++) {
    let btn = document.createElement("button");
    btn.textContent = i === targetIndex ? "LOGIN" : "LOGOUT";

    if (round <= 3) {
      // Grid
      btn.style.position = "static";
      game.style.display = "grid";
      let size = Math.ceil(Math.sqrt(numButtons));
      game.style.gridTemplateColumns = `repeat(${size}, 1fr)`;
    } else {
      // Random placement
      btn.style.position = "absolute";
      btn.style.left = Math.random() * (game.clientWidth - 50) + "px";
      btn.style.top = Math.random() * (game.clientHeight - 30) + "px";
    }

    if (i === targetIndex) {
      btn.addEventListener("click", nextRound);
    } else {
      btn.addEventListener("click", () => {
        // Redirect back to login screen
        msg.textContent = "Access Denied! Try again.";
        gameScreen.style.display = "none";
        loginScreen.style.display = "block";
        posterScreen.style.display = "none";
        music.pause();
        loginBtn.style.transform = "translateY(0)"; // Reset button position
        loginBtn.style.opacity = "1"; // Reset opacity
      });
    }

    // Moving drift after round 7
    if (round >= 7) {
      moveButton(btn);
    }

    game.appendChild(btn);
  }
}

function moveButton(btn) {
  let x = parseFloat(btn.style.left) || Math.random() * (game.clientWidth - 50);
  let y = parseFloat(btn.style.top) || Math.random() * (game.clientHeight - 30);
  let dx = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 2);
  let dy = (Math.random() < 0.5 ? -1 : 1) * (Math.random() * 2);

  function animate() {
    x += dx;
    y += dy;

    if (x <= 0 || x >= game.clientWidth - btn.offsetWidth) dx *= -1;
    if (y <= 0 || y >= game.clientHeight - btn.offsetHeight) dy *= -1;

    btn.style.left = `${x}px`;
    btn.style.top = `${y}px`;

    requestAnimationFrame(animate);
  }

  animate();
}
