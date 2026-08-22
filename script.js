
const data = {
  a: ["🍎","Apple","#FF6B5E"], b: ["⚽","Ball","#57C7E3"],
  c: ["🐱","Cat","#FFC93C"],   d: ["🐶","Dog","#3FB68B"],
  e: ["🥚","Egg","#B08BFF"],   f: ["🐟","Fish","#FF9F5A"],
  g: ["🍇","Grapes","#7CD4A8"],h: ["🐔","Hen","#FF8FA3"],
  i: ["🧊","Ice","#6FD6E0"],   j: ["🍯","Jug","#FFCE73"],
  k: ["🪁","Kite","#79C7FF"],  l: ["🦁","Lion","#FFB84D"],
  m: ["🥭","Mango","#FF7A5C"], n: ["🕸️","Net","#8C9EFF"],
  o: ["🦉","Owl","#B08BFF"],   p: ["🖊️","Pen","#57C7E3"],
  q: ["👑","Queen","#FF6B9D"], r: ["🐀","Rat","#9AA5B1"],
  s: ["☀️","Sun","#FFC93C"],   t: ["🔝","Top","#FF6B5E"],
  u: ["☂️","Umbrella","#3FB68B"], v: ["🚐","Van","#57C7E3"],
  w: ["⌚","Watch","#B08BFF"], x: ["🎼","Xylophone","#FF9F5A"],
  y: ["🐐","Yak","#7CD4A8"],   z: ["🦓","Zebra","#2E2450"]
};

const grid = document.getElementById("grid");
const flashcard = document.getElementById("flashcard");
const t1 = document.getElementById("t1");
const listenBtn = document.getElementById("listenBtn");
const trailFill = document.getElementById("trailFill");
const trailCount = document.getElementById("trailCount");

let learned = new Set();
let currentLetter = null;

// Build letter grid
Object.keys(data).forEach(ch => {
  const btn = document.createElement("button");
  btn.className = "letter-btn";
  btn.textContent = ch.toUpperCase();
  btn.style.background = data[ch][2];
  btn.id = "btn-" + ch;
  btn.addEventListener("click", () => showLetter(ch));
  grid.appendChild(btn);
});

const celebrateOverlay = document.getElementById("celebrateOverlay");
const balloonLayer = document.getElementById("balloonLayer");
const balloonColors = ["#FF6B5E","#57C7E3","#FFC93C","#3FB68B","#B08BFF","#FF8FA3","#79C7FF"];
let celebrated = false;

function launchBalloons(){
  const count = 24;
  for(let i = 0; i < count; i++){
    setTimeout(() => {
      const b = document.createElement("div");
      b.className = "balloon";
      const color = balloonColors[Math.floor(Math.random() * balloonColors.length)];
      b.style.background = color;
      b.style.left = Math.random() * 96 + "%";
      const duration = 3.2 + Math.random() * 2;
      const scale = 0.7 + Math.random() * 0.6;
      b.style.transform = `scale(${scale})`;
      b.style.animationDuration = duration + "s";
      balloonLayer.appendChild(b);
      setTimeout(() => b.remove(), duration * 1000 + 200);
    }, i * 120);
  }
}

function showCelebration(){
  celebrateOverlay.classList.add("show");
  launchBalloons();
}

document.getElementById("closeCelebrate").addEventListener("click", () => {
  celebrateOverlay.classList.remove("show");
});

function updateProgress(){
  trailFill.style.width = (learned.size / 26 * 100) + "%";
  trailCount.textContent = learned.size + " / 26";

  if(learned.size === 26 && !celebrated){
    celebrated = true;
    setTimeout(showCelebration, 500);
  }
}

function speak(text){
  if(!("speechSynthesis" in window)) return;
  window.speechSynthesis.cancel();
  const utter = new SpeechSynthesisUtterance(text);
  utter.rate = 0.85;
  utter.pitch = 1.1;
  window.speechSynthesis.speak(utter);
}

function showLetter(ch){
  if(!data[ch]){
    flashcard.innerHTML = '<div class="error-text">❌ Please enter a letter from A to Z</div>';
    listenBtn.disabled = true;
    return;
  }

  document.querySelectorAll(".letter-btn").forEach(b => b.classList.remove("active"));
  document.getElementById("btn-" + ch).classList.add("active");
  document.getElementById("btn-" + ch).classList.add("done");

  const [emoji, word, color] = data[ch];
  currentLetter = ch;
  learned.add(ch);
  updateProgress();

  flashcard.classList.remove("pop");
  void flashcard.offsetWidth; // restart animation
  flashcard.innerHTML = `
    <div class="emoji-badge" style="background:${color}22;">${emoji}</div>
    <div class="letter-word"><span class="big">${ch.toUpperCase()}</span> for ${word}</div>
  `;
  flashcard.classList.add("pop");

  listenBtn.disabled = false;
  speak(`${ch.toUpperCase()}, for ${word}`);

  t1.value = ch.toUpperCase();
}

document.getElementById("learnBtn").addEventListener("click", () => {
  const ch = t1.value.trim().toLowerCase();
  showLetter(ch);
});

t1.addEventListener("keypress", (e) => {
  if(e.key === "Enter"){
    const ch = t1.value.trim().toLowerCase();
    showLetter(ch);
  }
});

listenBtn.addEventListener("click", () => {
  if(currentLetter){
    const [, word] = data[currentLetter];
    speak(`${currentLetter.toUpperCase()}, for ${word}`);
  }
});