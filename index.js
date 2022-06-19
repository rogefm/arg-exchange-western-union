const scrapingbee = require('scrapingbee');
const { configs } = require('./config');
const fetch = require('node-fetch');

async function get(url) {
  var client = new scrapingbee.ScrapingBeeClient(configs.apiKey);
  var response = await client.get({
    url: url,
    params: {
      extract_rules: {
        exchange: {
          selector:
            '#body-component > section.container-fuild.container-fuild_mb-fix.bk-action-light > div > div > div > div.row.calculator > div.col.col-16.col-M-8.pad-xs-tp > div > p > strong > span',
          type: 'item',
        },
      },
      js_scenario: {
        instructions: [
          { wait: 1000 },
          {
            wait_for:
              '#body-component > section.container-fuild.container-fuild_mb-fix.bk-action-light > div > div > div > div.row.calculator > div.col.col-16.col-M-8.pad-xs-tp > div > p > strong > span',
          },
        ],
      },
    },
  });
  return response;
}

const chatIds = configs.telegramChatIds.split(',');

(async function main() {
  try {
    const response = await get('https://www.westernunion.com/br/es/currency-converter/brl-to-ars-rate.html');
    const decoder = new TextDecoder();
    const text = JSON.parse(decoder.decode(response.data));

    chatIds.forEach((chatId) => {
      fetch(`https://api.telegram.org/bot${configs.telegramBotApiKey}/sendMessage`, {
        method: 'POST',
        body: JSON.stringify({
          chat_id: chatId,
          text: `Olá! hoje a cotação de 1 real para pesos argentino está ${text.exchange}`,
        }),
        headers: { 'Content-Type': 'application/json' },
      })
        .then((res) => res.json())
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    });
  } catch {
    chatIds.forEach((chatId) => {
      fetch(`https://api.telegram.org/bot${configs.telegramBotApiKey}/sendMessage`, {
        method: 'POST',
        body: JSON.stringify({
          chat_id: chatId,
          text: `Olá! hoje a cotação de 1 real para pesos argentino está ${text.exchange}`,
        }),
        headers: { 'Content-Type': 'application/json' },
      })
        .then((res) => res.json())
        .then((res) => console.log(res))
        .catch((err) => console.log(err));
    });
  }
})();
