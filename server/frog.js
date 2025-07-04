const express = require('express');
const router = express.Router();

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
router.post('/feed', (req, res) => {
  const { state, food } = req.body;
  const now = Date.now();
  const foodMap = {
    'grasshopper': '蚱蜢',
    'earthworm': '蚯蚓',
    'mealworm': '面包虫',
    'frogfood': '蛙粮'
  };
  let feedCountToday = state.feedCountToday || 0;
  let lastFeedDate = state.lastFeedTime ? new Date(state.lastFeedTime).toDateString() : null;
  let today = new Date(now).toDateString();
  if (lastFeedDate === today) {
    feedCountToday += 1;
  } else {
    feedCountToday = 1;
  }
  const newState = {
    ...state,
    lastFeedTime: now,
    feedCountToday,
    lastAction: 'feed',
    lastFood: food,
  };
  const death = checkFrogDeath({ ...newState, feedCountToday }, 'feed');
  let actionText = `蛙吃了${foodMap[food] || food}，开心地跳了跳。`;
  if (death.dead) {
    newState.isDead = true;
    actionText = death.reason;
  }
  res.json({
    state: newState,
    action: actionText,
    dead: !!newState.isDead,
    reason: death.reason || null
  });
});

// 换水接口
router.post('/change-water', (req, res) => {
  const { state } = req.body;
  const now = Date.now();
  const newState = {
    ...state,
    lastWaterChange: now,
    lastAction: 'change-water'
  };
  const death = checkFrogDeath(newState, 'change-water');
  let actionText = '蛙在清澈的水里扑腾了一下。';
  if (death.dead) {
    newState.isDead = true;
    actionText = death.reason;
  }
  res.json({
    state: newState,
    action: actionText,
    dead: !!newState.isDead,
    reason: death.reason || null
  });
});

// 逗蛙接口
router.post('/play', (req, res) => {
  const { state } = req.body;
  const now = Date.now();
  const newState = {
    ...state,
    lastPlayTime: now,
    lastAction: 'play'
  };
  const death = checkFrogDeath(newState, 'play');
  let actionText = '蛙被你逗得咕咕叫。';
  if (death.dead) {
    newState.isDead = true;
    actionText = death.reason;
  }
  res.json({
    state: newState,
    action: actionText,
    dead: !!newState.isDead,
    reason: death.reason || null
  });
});

module.exports = router;