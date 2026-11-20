// ---------- 1. cat and mouse ----------
(function(){
var mouse = document.getElementById("mouse");
var head = document.getElementById("chead");
var pupils = document.querySelectorAll(".cpupil");
var a = 0;
var cx = 300, cy = 295, rx = 235, ry = 110;   // the mouse's oval path

function move() {
  a += 0.022;
  var x = cx + rx * Math.cos(a);
  var y = cy + ry * Math.sin(a);

  // face the way the mouse is running
  var turn = Math.atan2(ry * Math.cos(a), -rx * Math.sin(a));
  mouse.style.left = (x - 22) + "px";
  mouse.style.top = (y - 12) + "px";
  mouse.style.transform = "rotate(" + turn + "rad)";
  mouse.style.zIndex = y < 270 ? 1 : 10;   // behind the cat at the back

  // cat head and eyes follow the mouse
  var dx = x - 300, dy = y - 195;
  var d = Math.sqrt(dx * dx + dy * dy) || 1;
  var px = dx / d, py = dy / d;
  head.style.transform = "translate(" + px * 10 + "px," + py * 5 + "px)";
  for (var i = 0; i < pupils.length; i++) {
    pupils[i].style.transform = "translate(" + px * 5 + "px," + py * 6 + "px)";
  }
  requestAnimationFrame(move);
}
move();
})();

// ---------- 2. rotating car ----------
(function(){
var car = document.getElementById("car");
var arm = document.getElementById("arm");
var slider = document.getElementById("speed");
var deg = document.getElementById("deg");
var flip = document.getElementById("flip");
var a = 0, dir = 1;
var cx = 300, cy = 225, radius = 160;

flip.onclick = function () { dir = -dir; };

function drive() {
  a += dir * Number(slider.value) * 0.01;
  var x = cx + radius * Math.cos(a);
  var y = cy + radius * Math.sin(a);

  // the arm joins the axis to the car and turns with it
  arm.style.transform = "rotate(" + a + "rad)";
  // the car faces the way it is going
  var turn = dir > 0 ? a + Math.PI / 2 : a - Math.PI / 2;
  car.style.transform = "translate(" + (x - 32) + "px," + (y - 15) + "px) rotate(" + turn + "rad)";

  var d = Math.round(a * 180 / Math.PI) % 360;
  deg.textContent = (d < 0 ? d + 360 : d) + "°";
  requestAnimationFrame(drive);
}
drive();
})();

// ---------- 3. the storm ----------
(function(){
var stage = document.getElementById("stage");
var me = document.getElementById("me");
var foe = document.getElementById("foe");
var bubble = document.getElementById("bubble");
var flash = document.getElementById("flash");
var dawn = document.getElementById("dawn");
var replay = document.getElementById("replay");

var lines = [
  { who: "foe", text: "Stop. You have one leg. This cliff is no place for you." },
  { who: "me",  text: "I know exactly what I have." },
  { who: "foe", text: "Then you know it is not enough. You will fall." },
  { who: "me",  text: "Then let the storm see me fall standing.", fx: "flash" },
  { who: "foe", text: "Nobody is coming to carry you. Nobody!" },
  { who: "me",  text: "I never asked to be carried.", fx: "shake" },
  { who: "foe", text: "Why do you not give up?" },
  { who: "me",  text: "Because I decide where my story ends.", fx: "flash" },
  { who: "foe", text: "...", fx: "bow" },
  { who: "me",  text: "Now step aside.", fx: "walk" }
];
var i = 0;
var pos = 100;

// rain
for (var r = 0; r < 80; r++) {
  var drop = document.createElement("div");
  drop.className = "drop";
  drop.style.left = Math.random() * 700 + "px";
  drop.style.animationDuration = (0.5 + Math.random() * 0.5) + "s";
  drop.style.animationDelay = (-Math.random()) + "s";
  stage.appendChild(drop);
}

function moveTo(x, seconds) {
  pos = x;
  me.style.transition = "left " + seconds + "s linear";
  me.style.left = x + "px";
  me.classList.add("hop");
  setTimeout(function () { me.classList.remove("hop"); }, seconds * 1000);
}

function effect(fx) {
  if (fx == "flash") { flash.classList.remove("on"); void flash.offsetWidth; flash.classList.add("on"); }
  if (fx == "shake") { stage.classList.remove("shake"); void stage.offsetWidth; stage.classList.add("shake"); }
  if (fx == "bow") { foe.classList.add("bow"); }
  if (fx == "walk") { dawn.classList.add("on"); }   // the storm ends, the sun comes up
}

function showLine() {
  if (i >= lines.length) {
    setTimeout(function () { replay.style.display = "inline-block"; }, 3000);
    return;
  }
  var line = lines[i];
  bubble.className = line.who;
  bubble.textContent = "";
  effect(line.fx);

  if (line.who == "me") {
    if (line.fx == "walk") moveTo(400, 3);
    else moveTo(pos + 30, 1.2);
    bubble.style.left = Math.max(10, Math.min(pos - 60, 410)) + "px";
  } else {
    bubble.style.left = "";
  }

  var speaker = line.who == "me" ? me : foe;
  speaker.classList.add("talk");
  var n = 0;
  var timer = setInterval(function () {
    n++;
    bubble.textContent = line.text.slice(0, n);   // one letter at a time
    if (n >= line.text.length) {
      clearInterval(timer);
      speaker.classList.remove("talk");
      setTimeout(function () { i++; showLine(); }, 1800);
    }
  }, 45);
}

replay.onclick = function () {
  replay.style.display = "none";
  i = 0;
  pos = 100;
  me.style.transition = "none";
  me.style.left = "100px";
  foe.classList.remove("bow");
  dawn.classList.remove("on");
  showLine();
};

showLine();
})();