import puppeteer from 'puppeteer';
import { creds } from './creds.mjs';
import { dstr } from './decode.mjs';

const browser = await puppeteer.launch({
  headless: false,
  devtools: true,
  args: ['--window-size=1920,1080'],
  defaultViewport: {
    width: 1920,
    height: 1080,
  },
});

const page = (await browser.pages())[0];
await page.goto('https://membean.com/');
await page
  .waitForXPath('/html/body/header/nav/div[2]/ul[2]/li[2]/a')
  .then((el) => el.click());
await page
  .waitForXPath('/html/body/div/div[2]/div/main/section/ul/li/a')
  .then((e) => e.click());

// now on google login page
await page.waitForSelector('#identifierId');
await page.type('#identifierId', creds.username);
await page.click('#identifierNext');
await page.waitForSelector('#password');
await page.waitForTimeout(1000);
await page.type('#password', creds.password);
await page.click('#passwordNext');

// back on membean
(await page.waitForSelector('#startTrainingBtn')).click();

// loop
while (true) {
  await play();
  await page.waitForTimeout(random(5000, 7500));
}

async function play() {
  const growl = await (
    await (await page.$('#user-growl'))?.getProperty('innerHTML')
  )?.jsonValue();
  if (growl === 'Study' || growl === 'Restudy') {
    const options = await page.$$('#choice-section li');
    for (let i = 0; i < options.length; i++) {
      await options[i].hover();
      await waitForTime(random(500, 1000));
    }
    (await page.$('.answer'))?.click();
    await waitForTime(random(5000, 15000));
    (await page.$('#next-btn'))?.click();
    return;
  } else if (growl === 'Answer') {
    await waitForTime(random(3000, 7500));
    const data = dstr(
      await page.$eval('#google-analytics-mb', (el) => el.dataset.value)
    );
    const data1 = data.substr(10);
    const correct_answer_idx = data1.substr(0, data1.length - 10);
    const options = await page.$$('.choice');
    await options[correct_answer_idx].click();
    return;
  }

  const wordspell = await page.$('#wordspell');
  if (!!wordspell) {
    const word = (
      await page.$eval('#pronounce-sound', (el) => el.getAttribute('path'))
    )?.replace('audio/words/amy-', '');
    await waitForTime(random(3000, 7500));
    word && (await page.type('#choice', word));
    page.waitForTimeout(3000);
    return;
  }
}

function random(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function waitForTime(time) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve();
    }, time);
  });
}
