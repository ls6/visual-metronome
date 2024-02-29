// v3_LS
const timeline = {
  "bpm": 88,
  "length": 178,
  "meter": 4, // as in 4/4
  "schedule": [
    [0, "wszyscy dzwonek na boku bębna"],
    [9, "połowa lewej ręki Agaty"],
    [13, "tumby bum bum bum"],
    [17, "cała lewa ręka Agaty"],
    [21, "congi bum bum bum"],
    [25, "quinta bum bum bum"],
    [29, "manewr Ksawerego - dzyń dzyń dzyń"],
    [33, "manewr Ksawerego - całość"],
    [37, "cała ręka Agaty i WSZYSCY"],
    [45, "PRZERWA, Agata bum bum bum"],
    [46, "WSZYSCY"],
    [63, "bez dzwonków (Agata bum bum bum)"],
    [67, "bez tumb"],
    [71, "bez cong"],
    [73, "quinta coraz głośniej"],
    [79, "Przeszkadzajki: Adam grzechotka"],
    [81, "Ania"],
    [83, "Tosia"],
    [85, "Lilka"],
    [87, "Iza"],
    [89, "Jarek"],
    [91, "manewr Ksawerego - dzyń dzyń dzyń"],
    [95, "manewr Ksawerego - całość"],
    [99, "delegacja conga"],
    [103, "delegacja tumba"],
    [107, "wszyscy, Agata zmienia bas"],
    [123, "odwijamy przeszkadzajki - bez Jarka"],
    [125, "bez Izy"],
    [127, "bez Liki"],
    [129, "bez Tosi"],
    [131, "bez Ani"],
    [132, "Agata bas + dzwonek i WSZYSCY"],
    [149, "bębny się wyciszają do zera"],
    [157, "Adam, cała Agata, cały Ksawery"],
    [165, "Adam, Agata sam bęben, Ksawery sam bęben"],
    [173, "sam Adam"],
    [177, "koniec"]
  ]
};

const flash_duration = 150;
let timer;
let counter;
let nextChange;
let interval;


function tick() {
  let bar
  let beat
  counter += 1;
  if (counter < 0) {
    bar = Math.floor(counter / timeline.meter) + 1;
    beat = (counter % timeline.meter);
  } else {
    bar = Math.floor(counter / timeline.meter) + 1;
    beat = (counter % timeline.meter) + 1;
  }
  //console.log(counter + " " + bar + "." + beat);
  updateDisplay(bar, beat);
};

function findNextChangeIndex(bar) {
  let nextChange = timeline.schedule.findIndex((change) => change[0] > bar);
  return nextChange;
};

function updateDisplay(bar, beat) {
  let index;
  updateCounter(bar, beat);
  if (beat == 1) {
    flash1();
    index = findNextChangeIndex(bar);
    //console.log(counter + ' = ' + bar + ':' + beat + '->' + index);
    if (index == -1) {
      clearInterval(timer);
    }
    else {
      updatePlayingNow(index - 1);
      updatePlayingNext(bar, index);
    }
  } else {
    flash2();
  };
};

function updateCounter(bar, beat) {
  document.getElementById("count").innerHTML = bar + "." + beat;
};

function updatePlayingNow(index) {
  let text;
  if (arguments.length === 0) {
    text = '';
  } else {
    text = timeline.schedule[index][1];
  };
  document.getElementById("change").innerHTML = text;
};

function updatePlayingNext(bar, index) {
  document.getElementById("nextWhat").innerHTML = timeline.schedule[index][1];
  document.getElementById("nextWhen").innerHTML = " za " + (timeline.schedule[index][0] - bar) + " ";
};

function flash1() {
  elements = document.getElementsByClassName("flashable");
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.backgroundColor = 'blue';
  };
  setTimeout(resetFlash, flash_duration);
};

function flash2() {
  elements = document.getElementsByClassName("flashable");
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.backgroundColor = 'aqua';
  };
  setTimeout(resetFlash, flash_duration);
};

function resetFlash() {
  elements = document.getElementsByClassName("flashable");
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.backgroundColor = '';
  };

};

function start() {
  timer = setInterval(tick, interval);
  change_button_to_stop();
};

function stop() {
  clearInterval(timer);
  change_button_to_start();
};

function change_button_to_stop() {
  button = document.getElementById("play_control");
  button.onclick = function () { stop(); };
  button.innerHTML = "STOP";
  hide_reset_button();
};

function change_button_to_start() {
  button = document.getElementById("play_control");
  button.onclick = function () { start(); };
  button.innerHTML = "START";
  show_reset_button();
};

function show_reset_button() {
  let reset_button = document.getElementById("reset");
  reset_button.style.display = "inline";
};

function hide_reset_button() {
  let reset_button = document.getElementById("reset");
  reset_button.style.display = "none";
};

function reset() {
  interval = (60 / timeline.bpm) * 1000;
  counter = -timeline.meter - 2;
  tick();
  updateDisplay(0, -4);
  updatePlayingNow();
  updatePlayingNext(0, 0);
  change_button_to_start();
  hide_reset_button();
};

document.addEventListener("DOMContentLoaded", function (event) {
  reset();
});
