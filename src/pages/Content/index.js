import { dstr } from './decode.mjs';

let interval;
let working = false;
chrome.storage.sync.get('enabled').then((result) => {
  if (result.enabled) enable();
  console.log("Ok nerds, let's get this shiz!");
});

chrome.storage.onChanged.addListener(function (changes, namespace) {
  for (let [key, { oldValue, newValue }] of Object.entries(changes)) {
    if (key === 'enabled') newValue ? enable() : disable();
    // console.log(
    //   `Storage key "${key}" in namespace "${namespace}" changed.`,
    //   `Old value was "${oldValue}", new value is "${newValue}".`
    // );
  }
});

function enable() {
  interval = setInterval(bot, 1000);
  console.log('Extension enabled');
  styleUp();
}

function disable() {
  clearInterval(interval);
  console.log('Extension disabled');
  styleDown();
}

async function bot() {
  if (working) return;

  // assess type of question
  const growl = document.getElementById('user-growl')?.innerHTML;
  if (!!growl) {
    working = true;
    if (growl === 'Study' || growl === 'Restudy') {
      setTimeout(finishStudy, random(2000, 5000));
    } else if (growl === 'Answer') {
      setTimeout(finishOther, random(5000, 10000));
    }
  }

  const wordspell = document.getElementById('wordspell')?.innerHTML;
  if (!!wordspell) {
    working = true;
    setTimeout(finishWordSpell, random(1000, 5000));
  }
}

function finishStudy() {
  document.getElementsByClassName('answer')?.[0]?.click();
  setTimeout(
    () => document.getElementById('next-btn')?.click(),
    random(2000, 5000)
  );
  setTimeout(() => (working = false), 7500);
}

function finishOther() {
  const data = dstr(
    document.getElementById('google-analytics-mb')?.dataset.value
  );
  const data1 = data.substr(10);
  const correct_answer = data1.substr(0, data1.length - 10);
  if (!isNaN(Number(correct_answer))) {
    const options = document.getElementsByClassName('choice');
    options.item(correct_answer).click();
  } else {
    const input = document.getElementById('choice');
    input.focus();
    input.value = correct_answer.slice(1);
    const ev = document.createEvent('Event');
    ev.initEvent('keypress');
    ev.which = ev.keyCode = 13;
    input.dispatchEvent(ev);
  }
  setTimeout(() => (working = false), 7500);
}

function finishWordSpell() {
  const word = document
    .getElementById('pronounce-sound')
    ?.getAttribute('path')
    ?.replace('audio/words/amy-', '');
  const input = document.getElementById('choice');
  input.focus();
  input.value = word;
  const ev = document.createEvent('Event');
  ev.initEvent('keypress');
  ev.which = ev.keyCode = 13;
  input.dispatchEvent(ev);
  setTimeout(() => (working = false), 7500);
}

function styleUp() {
  const message = document.createElement('div');
  message.id = 'hack-message';
  message.innerHTML = '<p>Membean Hacks enabled</p>';
  document.getElementById('header')?.appendChild(message);
  loadCSS('content.styles');
}

function styleDown() {
  document
    .getElementById('header')
    ?.removeChild(document.getElementById('hack-message'));
  unloadCSS('content.styles');
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function loadCSS(file) {
  var link = document.createElement('link');
  link.href = chrome.runtime.getURL(file + '.css');
  link.id = file;
  link.type = 'text/css';
  link.rel = 'stylesheet';
  document.getElementsByTagName('head')[0].appendChild(link);
}

function unloadCSS(file) {
  var cssNode = document.getElementById(file);
  cssNode && cssNode.parentNode.removeChild(cssNode);
}
