#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_URL = 'https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=';
const OUTPUT_PATH = path.join(__dirname, '..', 'public', 'data', 'lottery-history.json');

async function fetchDraw(round) {
  return new Promise((resolve, reject) => {
    https.get(API_URL + round, (res) => {
      let data = '';
      res.on('data', (chunk) => (data += chunk));
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          if (json.returnValue === 'success') {
            resolve({
              round: json.drwNo,
              date: json.drwNoDate,
              numbers: [
                json.drwtNo1,
                json.drwtNo2,
                json.drwtNo3,
                json.drwtNo4,
                json.drwtNo5,
                json.drwtNo6,
              ].sort((a, b) => a - b),
              bonusNumber: json.bnusNo,
              firstPrizeAmount: json.firstWinamnt,
              firstPrizeWinners: json.firstPrzwnerCo,
            });
          } else {
            resolve(null);
          }
        } catch (err) {
          reject(err);
        }
      });
    }).on('error', reject);
  });
}

function loadExistingData() {
  try {
    if (fs.existsSync(OUTPUT_PATH)) {
      const data = JSON.parse(fs.readFileSync(OUTPUT_PATH, 'utf-8'));
      return data;
    }
  } catch (err) {
    console.log('Could not load existing data, starting fresh.');
  }
  return [];
}

async function fetchAllData() {
  console.log('Fetching lottery data from 동행복권...');

  // Load existing data
  const existingDraws = loadExistingData();
  const latestRound = existingDraws.length > 0 ? existingDraws[0].round : 0;

  if (latestRound > 0) {
    console.log(`Existing data: ${existingDraws.length} draws (latest: round ${latestRound})`);
  }

  // Fetch new draws only
  const newDraws = [];
  let round = latestRound + 1;
  let consecutive_failures = 0;

  while (consecutive_failures < 3) {
    try {
      const draw = await fetchDraw(round);
      if (draw) {
        newDraws.push(draw);
        consecutive_failures = 0;
        console.log(`Fetched new round ${round}: ${draw.date}`);
      } else {
        consecutive_failures++;
      }
      round++;
      // Small delay to be respectful to the API
      await new Promise(resolve => setTimeout(resolve, 50));
    } catch (err) {
      console.error(`Error fetching round ${round}:`, err.message);
      consecutive_failures++;
      round++;
    }
  }

  if (newDraws.length === 0) {
    console.log('\nNo new draws found. Data is up to date!');
    console.log(`Latest draw: Round ${latestRound}`);
    return;
  }

  // Merge new draws with existing (new draws first, then existing)
  const allDraws = [...newDraws.sort((a, b) => b.round - a.round), ...existingDraws];

  fs.writeFileSync(OUTPUT_PATH, JSON.stringify(allDraws, null, 2));

  console.log(`\nSuccess! Fetched ${newDraws.length} new draw(s).`);
  console.log(`Total draws: ${allDraws.length}`);
  console.log(`Latest draw: Round ${allDraws[0].round} on ${allDraws[0].date}`);
  console.log(`Data saved to: ${OUTPUT_PATH}`);
}

fetchAllData().catch(console.error);
