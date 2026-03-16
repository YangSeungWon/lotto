#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_URL = 'https://www.dhlottery.co.kr/lt645/selectPstLt645InfoNew.do';
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'data', 'lottery-history.json');

function fetchBatch(cursor) {
  const url = `${API_URL}?srchDir=older&srchCursorLtEpsd=${cursor}&_=${Date.now()}`;
  return new Promise((resolve, reject) => {
    const req = https.get(url, { timeout: 15000 }, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const list = json.data?.list || [];
          resolve(list.map(parseDraw));
        } catch {
          resolve([]);
        }
      });
    });
    req.on('error', () => resolve([]));
    req.on('timeout', () => { req.destroy(); resolve([]); });
  });
}

function parseDraw(d) {
  const s = String(d.ltRflYmd);
  return {
    round: d.ltEpsd,
    date: `${s.slice(0, 4)}-${s.slice(4, 6)}-${s.slice(6, 8)}`,
    numbers: [d.tm1WnNo, d.tm2WnNo, d.tm3WnNo, d.tm4WnNo, d.tm5WnNo, d.tm6WnNo].sort((a, b) => a - b),
    bonusNumber: d.bnsWnNo,
    firstPrizeAmount: d.rnk1WnAmt,
    firstPrizeWinners: d.rnk1WnNope,
  };
}

function loadExistingData() {
  try {
    if (fs.existsSync(OUTPUT_PATH)) {
      return JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf-8'));
    }
  } catch {
    console.log('Could not load existing data, starting fresh.');
  }
  return [];
}

// Calculate how many Saturdays (draws) between last data date and today
function estimateMissingRounds(latestDate) {
  const last = new Date(latestDate);
  const now = new Date();
  const diffMs = now - last;
  return Math.floor(diffMs / (7 * 24 * 60 * 60 * 1000));
}

const sleep = (ms) => new Promise((r) => setTimeout(r, ms));

async function fetchAllData() {
  console.log('Fetching lottery data from 동행복권...');

  const existingDraws = loadExistingData();
  const existingRounds = new Set(existingDraws.map((d) => d.round));
  const latestRound = existingDraws.length > 0 ? existingDraws[0].round : 0;
  const latestDate = existingDraws.length > 0 ? existingDraws[0].date : null;

  if (latestRound > 0) {
    console.log(`Existing data: ${existingDraws.length} draws (latest: round ${latestRound}, ${latestDate})`);
  }

  const newDraws = [];

  // Calculate cursor: only request what we actually need
  let cursor;
  if (latestRound > 0 && latestDate) {
    const missing = estimateMissingRounds(latestDate);
    cursor = latestRound + missing;
    console.log(`Estimated ${missing} missing round(s), fetching from cursor ${cursor}`);
  } else {
    // Fresh install: start high and page backwards
    cursor = 9999;
  }

  while (true) {
    const batch = await fetchBatch(cursor);

    if (batch.length === 0) {
      if (latestRound > 0) break;
      // Fresh install: probe downward
      cursor -= 10;
      if (cursor <= 0) break;
      await sleep(2000);
      continue;
    }

    let reachedExisting = false;
    for (const draw of batch) {
      if (existingRounds.has(draw.round)) {
        reachedExisting = true;
        continue;
      }
      newDraws.push(draw);
      console.log(`Fetched round ${draw.round}: ${draw.date}`);
    }

    if (reachedExisting) break;

    const minRound = Math.min(...batch.map((d) => d.round));
    if (minRound <= 1) break;
    cursor = minRound;

    await sleep(2000);
  }

  if (newDraws.length === 0) {
    console.log('\nNo new draws found. Data is up to date!');
    return;
  }

  const allDraws = [...newDraws, ...existingDraws].sort((a, b) => b.round - a.round);
  const seen = new Set();
  const deduped = allDraws.filter((d) => {
    if (seen.has(d.round)) return false;
    seen.add(d.round);
    return true;
  });

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(deduped, null, 2));

  console.log(`\nSuccess! Fetched ${newDraws.length} new draw(s).`);
  console.log(`Total draws: ${deduped.length}`);
  console.log(`Latest draw: Round ${deduped[0].round} on ${deduped[0].date}`);
}

fetchAllData().catch(console.error);
