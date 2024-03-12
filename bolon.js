const timeline = {
  "bpm": 88,
  "length": 178,
  "meter": 4, // as in 4/4
};

const flashDuration = 150;
let timer;
let counter;
let nextChange;
let interval;
let remote_schedule;


function downloadSchedule() {
  Papa.parse("bolon.csv", {
    download: true,
    dynamicTyping: true,
    complete: response => { remote_schedule = response.data; reset() }
  });
};

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
  let nextChange = remote_schedule.findIndex((change) => change[0] > bar);
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
      if (index > 0) {
        updatePlayingNow(index - 1);
      };
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
    text = remote_schedule[index][1];
  };
  document.getElementById("change").innerHTML = text;
};

function updatePlayingNext(bar, index) {
  document.getElementById("nextWhat").innerHTML = remote_schedule[index][1];
  document.getElementById("nextWhen").innerHTML = " za " + (remote_schedule[index][0] - bar) + " ";
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
  remote_schedule.forEach(function (item) {
    const option = document.createElement("option");
    option.textContent = item[0] + ' — ' + item[1];
    document.getElementById("changes").appendChild(option);
  });
};

function changeSelected(val) {
  let selectedBar = val.split(' — ')[0];
  counter = ((selectedBar - 1) * 4) - 1;
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
  counter = -1;
  populateChangesSelector();
  //tick();
  updateDisplay(0, 0);
  updatePlayingNow(0);
  updatePlayingNext(0, 1);
  changeButtonToStart();
  hideResetButton();
};

document.addEventListener("DOMContentLoaded", function (event) {
  downloadSchedule();
});
