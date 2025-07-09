const express = require('express');
const router = express.Router();
const { chatWithFrog } = require('./openrouter');

/**
 * 死亡判定逻辑
 * @param {Object} state - 宠物当前状态
 * @param {string} action - 当前操作类型
 * @returns {{dead: boolean, reason: string|null}}
 */
function checkFrogDeath(state, action) {
  const now = Date.now();
  let reason = null;
  let dead = false;

  // 1. 每天喂食超3次有概率死亡
  if (action === 'feed' && state.feedCountToday > 3) {
    // 概率：30%
    if (Math.random() < 0.3) {
      dead = true;
      reason = '今天喂食次数过多，蛙撑死了';
    }
  }

  // 2. 一周以上没喂概率会死
  if (state.lastFeedTime && now - state.lastFeedTime > 7 * 24 * 3600 * 1000) {
    if (Math.random() < 0.5) {
      dead = true;
      reason = '一周没喂食，蛙饿死了';
    }
  }

  // 3. 一周以上没换水概率会死
  if (state.lastWaterChange && now - state.lastWaterChange > 7 * 24 * 3600 * 1000) {
    if (Math.random() < 0.5) {
      dead = true;
      reason = '一周没换水，蛙渴死了';
    }
  }

  return { dead, reason };
}

// 喂养接口
router.post('/feed', async (req, res) => {
  const { state, food } = req.body;
  const now = Date.now();
  const foodMap = {
    'grasshopper': '蚱蜢',
    'earthworm': '蚯蚓',
    'mealworm': '面包虫',
    'frogfood': '蛙粮'
  };
  let feedCountToday = state.feedCountToday || 0;
  let feedCountWeek = state.feedCountWeek || 0;
  let lastFeedDate = state.lastFeedTime ? new Date(state.lastFeedTime).toDateString() : null;
  let lastFeedWeek = state.lastFeedTime ? getWeekString(new Date(state.lastFeedTime)) : null;
  let today = new Date(now).toDateString();
  let thisWeek = getWeekString(new Date(now));
  if (lastFeedDate === today) {
    feedCountToday += 1;
  } else {
    feedCountToday = 1;
  }
  if (lastFeedWeek === thisWeek) {
    feedCountWeek += 1;
  } else {
    feedCountWeek = 1;
  }
  const newState = {
    ...state,
    lastFeedTime: now,
    feedCountToday,
    feedCountWeek,
    lastAction: 'feed',
    lastFood: food,
  };
  const death = checkFrogDeath({ ...newState, feedCountToday }, 'feed');
  let actionText = `蛙吃了${foodMap[food] || food}，开心地跳了跳。`;
  // 统计信息
  const feedInfo = `今天已喂食${newState.feedCountToday}次，本周已喂食${newState.feedCountWeek}次。`;
  const waterInfo = `今天已换水${newState.waterChangeCountToday || 0}次，本周已换水${newState.waterChangeCountWeek || 0}次。`;
  const deathLogic = `死亡逻辑：1. 每天喂食超过3次有30%概率死亡；2. 一周不喂有50%概率饿死；3. 一周不换水有50%概率渴死。`;
  if (death.dead) {
    newState.isDead = true;
    actionText = death.reason;
  }
  // AI 回复
  // 判断是否需要提醒死亡逻辑和统计
  let needWarn = false;
  // 1. 喂食当天>=3次
  if (newState.feedCountToday >= 3) needWarn = true;
  // 2. 距离上次喂食/换水接近一周
  const almostAWeek = 6.5 * 24 * 3600 * 1000;
  if (now - (state.lastFeedTime || 0) > almostAWeek) needWarn = true;
  if (now - (state.lastWaterChange || 0) > almostAWeek) needWarn = true;
  let aiReply = await chatWithFrog(
    death.dead
      ? `我喂了你${foodMap[food] || food}，你${death.reason}，${feedInfo} ${waterInfo} ${deathLogic} 你还有什么想说的吗？`
      : `我喂了你${foodMap[food] || food}，${needWarn ? feedInfo + " " + waterInfo + " " + deathLogic : ""}你感觉怎么样？`
  );
  res.json({
    state: newState,
    action: actionText,
    aiReply,
    dead: !!newState.isDead,
    reason: death.reason || null
  });
});

// 换水接口
router.post('/change-water', async (req, res) => {
  const { state } = req.body;
  const now = Date.now();
  let waterChangeCountToday = state.waterChangeCountToday || 0;
  let waterChangeCountWeek = state.waterChangeCountWeek || 0;
  let lastWaterChangeDate = state.lastWaterChange ? new Date(state.lastWaterChange).toDateString() : null;
  let lastWaterChangeWeek = state.lastWaterChange ? getWeekString(new Date(state.lastWaterChange)) : null;
  let today = new Date(now).toDateString();
  let thisWeek = getWeekString(new Date(now));
  if (lastWaterChangeDate === today) {
    waterChangeCountToday += 1;
  } else {
    waterChangeCountToday = 1;
  }
  if (lastWaterChangeWeek === thisWeek) {
    waterChangeCountWeek += 1;
  } else {
    waterChangeCountWeek = 1;
  }
  const newState = {
    ...state,
    lastWaterChange: now,
    waterChangeCountToday,
    waterChangeCountWeek,
    lastAction: 'change-water'
  };
  const death = checkFrogDeath(newState, 'change-water');
  let actionText = '蛙在清澈的水里扑腾了一下。';
  // 统计信息
  const feedInfo = `今天已喂食${newState.feedCountToday || 0}次，本周已喂食${newState.feedCountWeek || 0}次。`;
  const waterInfo = `今天已换水${newState.waterChangeCountToday}次，本周已换水${newState.waterChangeCountWeek}次。`;
  const deathLogic = `死亡逻辑：1. 每天喂食超过3次有30%概率死亡；2. 一周不喂有50%概率饿死；3. 一周不换水有50%概率渴死。`;
  if (death.dead) {
    newState.isDead = true;
    actionText = death.reason;
  }
  // 判断是否需要提醒死亡逻辑和统计
  let needWarn = false;
  if (newState.waterChangeCountToday >= 3) needWarn = true;
  const almostAWeek = 6.5 * 24 * 3600 * 1000;
  if (now - (state.lastFeedTime || 0) > almostAWeek) needWarn = true;
  if (now - (state.lastWaterChange || 0) > almostAWeek) needWarn = true;
  let aiReply = await chatWithFrog(
    death.dead
      ? `我帮你换了水，你${death.reason}，${feedInfo} ${waterInfo} ${deathLogic} 你还有什么想说的吗？`
      : `我帮你换了水，${needWarn ? feedInfo + " " + waterInfo + " " + deathLogic : ""}你感觉如何？`
  );
  res.json({
    state: newState,
    action: actionText,
    aiReply,
    dead: !!newState.isDead,
    reason: death.reason || null
  });
});

// 逗蛙接口
router.post('/play', async (req, res) => {
  const { state } = req.body;
  const now = Date.now();
  const newState = {
    ...state,
    lastPlayTime: now,
    lastAction: 'play'
  };
  const death = checkFrogDeath(newState, 'play');
  let actionText = '蛙被你逗得咕咕叫。';
  // 统计信息
  const feedInfo = `今天已喂食${newState.feedCountToday || 0}次，本周已喂食${newState.feedCountWeek || 0}次。`;
  const waterInfo = `今天已换水${newState.waterChangeCountToday || 0}次，本周已换水${newState.waterChangeCountWeek || 0}次。`;
  const deathLogic = `死亡逻辑：1. 每天喂食超过3次有30%概率死亡；2. 一周不喂有50%概率饿死；3. 一周不换水有50%概率渴死。`;
  if (death.dead) {
    newState.isDead = true;
    actionText = death.reason;
  }
  // 判断是否需要提醒死亡逻辑和统计
  let needWarn = false;
  const almostAWeek = 6.5 * 24 * 3600 * 1000;
  if ((newState.feedCountToday || 0) >= 3) needWarn = true;
  if (now - (state.lastFeedTime || 0) > almostAWeek) needWarn = true;
  if (now - (state.lastWaterChange || 0) > almostAWeek) needWarn = true;
  let aiReply = await chatWithFrog(
    death.dead
      ? `我刚刚逗你玩，你${death.reason}，${feedInfo} ${waterInfo} ${deathLogic} 你还有什么想说的吗？`
      : `我刚刚逗你玩，${needWarn ? feedInfo + " " + waterInfo + " " + deathLogic : ""}你现在心情怎么样？`
  );
  res.json({
    state: newState,
    action: actionText,
    aiReply,
    dead: !!newState.isDead,
    reason: death.reason || null
  });
});

/**
 * 对话接口：用户可直接与蛙对话
 * POST /frog/chat { message: string }
 */
router.post('/chat', async (req, res) => {
  const { message } = req.body;
  let aiReply = await chatWithFrog(message || '');
  res.json({ aiReply });
});

/**
 * 重养一只新蛙，重置所有状态
 */
router.post('/restart', (req, res) => {
  // 可根据需要自定义初始属性
  const initialState = {
    feedCountToday: 0,
    feedCountWeek: 0,
    waterChangeCountToday: 0,
    waterChangeCountWeek: 0,
    lastFeedTime: null,
    lastWaterChange: null,
    lastPlayTime: null,
    lastAction: null,
    lastFood: null,
    isDead: false
  };
  res.json({
    state: initialState,
    action: '你又领养了一只新蛙，开始新的养成之旅！',
    aiReply: '你好，我是你的新蛙，今后请多关照。', // 可选：首次AI欢迎语
    dead: false,
    reason: null
  });
});

/**
 * 获取当前日期属于哪一年哪一周
 * @param {Date} date
 * @returns {string} 形如"2025-28"（第28周）
 */
function getWeekString(date) {
  const year = date.getFullYear();
  const firstDay = new Date(year, 0, 1);
  const dayOfYear = Math.floor((date - firstDay) / (24 * 60 * 60 * 1000)) + 1;
  const week = Math.ceil(dayOfYear / 7);
  return `${year}-${week}`;
}

module.exports = router;