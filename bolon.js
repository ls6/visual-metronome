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
    [62, "bez dzwonków (Agata bum bum bum)"],
    [66, "bez tumb"],
    [68, "bez cong"],
    [70, "quinta coraz głośniej"],
    [74, "Przeszkadzajki: Adam grzechotka"],
    [76, "Ania"],
    [78, "Tosia"],
    [80, "Lilka"],
    [82, "Iza"],
    [84, "Jarek"],
    [86, "manewr Ksawerego - dzyń dzyń dzyń"],
    [90, "manewr Ksawerego - całość"],
    [94, "delegacja conga"],
    [98, "delegacja tumba"],
    [102, "wszyscy, Agata zmienia bas"],
    [118, "odwijamy przeszkadzajki - bez Jarka"],
    [120, "bez Izy"],
    [122, "bez Liki"],
    [124, "bez Tosi"],
    [126, "bez Ani"],
    [128, "Agata bas + dzwonek i WSZYSCY"],
    [144, "bębny się wyciszają do zera"],
    [152, "Adam, cała Agata, cały Ksawery"],
    [160, "Adam, Agata sam bęben, Ksawery sam bęben"],
    [168, "sam Adam"],
    [172, "koniec"]
  ]
};

const flashDuration = 150;
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
  setTimeout(resetFlash, flashDuration);
};

function flash2() {
  elements = document.getElementsByClassName("flashable");
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.backgroundColor = 'aqua';
  };
  setTimeout(resetFlash, flashDuration);
};

function resetFlash() {
  elements = document.getElementsByClassName("flashable");
  for (var i = 0; i < elements.length; i++) {
    elements[i].style.backgroundColor = '';
  };

};

function start() {
  timer = setInterval(tick, interval);
  changeButtonToStop();
};

function stop() {
  clearInterval(timer);
  changeButtonToStart();
};

function changeButtonToStop() {
  button = document.getElementById("play_control");
  button.onclick = function () { stop(); };
  button.innerHTML = "STOP";
  hideResetButton();
  hideChangesDropdown();
};

function changeButtonToStart() {
  button = document.getElementById("play_control");
  button.onclick = function () { start(); };
  button.innerHTML = "START";
  showResetButton();
  showChangesDropdown();
};

function showResetButton() {
  let reset_button = document.getElementById("reset");
  reset_button.style.display = "inline";
};

function hideResetButton() {
  let reset_button = document.getElementById("reset");
  reset_button.style.display = "none";
};

function populateChangesSelector() {
  timeline.schedule.forEach(function (item) {
    const option = document.createElement("option");
    option.textContent = item[0] + ' — ' + item[1];
    document.getElementById("changes").appendChild(option);
  });
};

function changeSelected(val) {
  let selectedBar = val.split(' — ')[0];
  counter = ((selectedBar -1 )* 4) - 1;
  tick()
};

function showChangesDropdown() {
  let reset_button = document.getElementById("changes");
  reset_button.style.display = "inline";
};

function hideChangesDropdown() {
  let reset_button = document.getElementById("changes");
  reset_button.style.display = "none";
};

function reset() {
  interval = (60 / timeline.bpm) * 1000;
  counter = -timeline.meter - 2;
  populateChangesSelector();
  tick();
  updateDisplay(0, -4);
  updatePlayingNow();
  updatePlayingNext(0, 0);
  changeButtonToStart();
  hideResetButton();
};

document.addEventListener("DOMContentLoaded", function (event) {
  reset();
});
