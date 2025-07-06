const fs = require('fs');
const path = require('path');
const https = require('https');
const { URL } = require('url');

const PROMPT_PATH = path.join(__dirname, 'frog_prompt.txt');
const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions';
const OPENROUTER_API_KEY = process.env.OPENROUTER_API_KEY || '';

function getSystemPrompt() {
  return fs.readFileSync(PROMPT_PATH, 'utf-8').trim();
}

/**
 * 与 openrouter 聊天（使用 Node.js 原生 https）
 * @param {string} userMessage 用户输入
 * @returns {Promise<string>} AI 回复
 */
async function chatWithFrog(userMessage) {
  if (!OPENROUTER_API_KEY) {
    console.warn('[openrouter] 未检测到 OPENROUTER_API_KEY 环境变量，AI 回复功能不可用。');
    return '呱';
  }
  const systemPrompt = getSystemPrompt();
  const postData = JSON.stringify({
    model: 'openai/gpt-3.5-turbo',
    messages: [
      { role: 'system', content: systemPrompt },
      { role: 'user', content: userMessage }
    ],
    max_tokens: 80,
    temperature: 0.8
  });

  return new Promise((resolve) => {
    const url = new URL(OPENROUTER_API_URL);
    const options = {
      hostname: url.hostname,
      path: url.pathname,
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${OPENROUTER_API_KEY}`,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const json = JSON.parse(data);
          const choices = json && json.choices;
          let reply = null;
          if (
            choices &&
            choices[0] &&
            choices[0].message &&
            choices[0].message.content
          ) {
            reply = choices[0].message.content.trim();
          }
          resolve(reply || '呱');
        } catch (e) {
          resolve('呱');
        }
      });
    });

    req.on('error', () => resolve('呱'));
    req.write(postData);
    req.end();
  });
}

module.exports = { chatWithFrog };