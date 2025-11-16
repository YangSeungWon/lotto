#!/usr/bin/env node

const https = require('https');
const fs = require('fs');
const path = require('path');

const API_URL = 'https://www.dhlottery.co.kr/common.do?method=getLottoNumber&drwNo=';

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

async function fetchAllData() {
  console.log('Fetching lottery data from 동행복권...');

  const draws = [];
  let round = 1;
  let consecutive_failures = 0;

  while (consecutive_failures < 3) {
    try {
      const draw = await fetchDraw(round);
      if (draw) {
        draws.push(draw);
        consecutive_failures = 0;
        if (round % 100 === 0) {
          console.log(`Fetched round ${round}...`);
        }
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

  // Sort by round descending (latest first)
  draws.sort((a, b) => b.round - a.round);

  const outputPath = path.join(__dirname, '..', 'public', 'data', 'lottery-history.json');
  fs.writeFileSync(outputPath, JSON.stringify(draws, null, 2));

  console.log(`\nSuccess! Fetched ${draws.length} draws.`);
  console.log(`Latest draw: Round ${draws[0].round} on ${draws[0].date}`);
  console.log(`Data saved to: ${outputPath}`);
}

fetchAllData().catch(console.error);
