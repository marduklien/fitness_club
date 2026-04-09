// ============================================================
// exerciseData.js — NeoCoach 訓練資料模組
// 預留 EXERCISE_MAPPING 供使用者自行擴充 Life Fitness Video ID
// ============================================================

/**
 * EXERCISE_MAPPING
 * 每個項目包含：
 *   id       — 唯一識別碼
 *   name     — 動作名稱（繁體中文）
 *   machine  — Life Fitness 機台型號
 *   ytId     — YouTube Video ID（嵌入用）
 *   sets     — 建議組數
 *   target   — 每組目標次數
 *   lastWeight — 上次使用重量 (kg)
 *   bodyPart — 訓練部位
 */
export const EXERCISE_MAPPING = [
  {
    id: "chest_press",
    name: "坐姿胸部推舉",
    machine: "Insignia Chest Press",
    ytId: "v_m4yX2j2XU",
    sets: 4,
    target: 12,
    lastWeight: 45,
    bodyPart: "胸",
  },
  {
    id: "lat_pulldown",
    name: "滑輪下拉",
    machine: "Insignia Lat Pulldown",
    ytId: "v_8_V_S9Ksw",
    sets: 4,
    target: 10,
    lastWeight: 40,
    bodyPart: "背",
  },
  {
    id: "leg_press",
    name: "坐姿推腿",
    machine: "Insignia Leg Press",
    ytId: "A94aV1z2pYk",
    sets: 3,
    target: 15,
    lastWeight: 80,
    bodyPart: "腿",
  },
  {
    id: "shoulder_press",
    name: "坐姿肩部推舉",
    machine: "Insignia Shoulder Press",
    ytId: "qEwKCR5JCog",
    sets: 4,
    target: 10,
    lastWeight: 25,
    bodyPart: "肩",
  },
  {
    id: "cable_row",
    name: "坐姿划船",
    machine: "Insignia Row",
    ytId: "GZbfZ033f74",
    sets: 4,
    target: 12,
    lastWeight: 35,
    bodyPart: "背",
  },
  {
    id: "leg_curl",
    name: "坐姿腿彎舉",
    machine: "Insignia Leg Curl",
    ytId: "ELOCsiu2qs0",
    sets: 3,
    target: 12,
    lastWeight: 30,
    bodyPart: "腿",
  },
  // ─── 在此處新增更多 Life Fitness 器材 ───
  // {
  //   id: "your_exercise_id",
  //   name: "動作名稱",
  //   machine: "Life Fitness 機台名稱",
  //   ytId: "YouTube_VIDEO_ID",
  //   sets: 3,
  //   target: 12,
  //   lastWeight: 20,
  //   bodyPart: "部位",
  // },
];

// ============================================================
// 一週訓練計畫
// ============================================================

const dayNames = ["週日", "週一", "週二", "週三", "週四", "週五", "週六"];

export const WEEKLY_PLAN = [
  {
    day: "週一",
    focus: "胸 + 三頭",
    exercises: ["chest_press", "shoulder_press"],
    diet: { title: "高蛋白日", desc: "雞胸肉 200g・糙米飯・花椰菜・水煮蛋 x3", calories: "2,200 kcal", protein: "180g" },
  },
  {
    day: "週二",
    focus: "背 + 二頭",
    exercises: ["lat_pulldown", "cable_row"],
    diet: { title: "增肌飲食", desc: "鮭魚排・地瓜泥・綜合沙拉・乳清蛋白", calories: "2,400 kcal", protein: "190g" },
  },
  {
    day: "週三",
    focus: "腿部專攻",
    exercises: ["leg_press", "leg_curl"],
    diet: { title: "碳水補充日", desc: "全麥義大利麵・牛肉丸・菠菜・香蕉 x2", calories: "2,600 kcal", protein: "160g" },
  },
  {
    day: "週四",
    focus: "肩 + 核心",
    exercises: ["shoulder_press"],
    diet: { title: "輕食日", desc: "希臘優格・堅果・酪梨吐司・蛋白奶昔", calories: "1,800 kcal", protein: "140g" },
  },
  {
    day: "週五",
    focus: "全身循環",
    exercises: ["chest_press", "lat_pulldown", "leg_press"],
    diet: { title: "高蛋白日", desc: "豬里肌・藜麥飯・毛豆・茶葉蛋 x3", calories: "2,300 kcal", protein: "185g" },
  },
  {
    day: "週六",
    focus: "弱項加強",
    exercises: ["cable_row", "leg_curl", "shoulder_press"],
    diet: { title: "自由飲食", desc: "今天可適度放鬆，但仍需攝取足量蛋白質", calories: "2,000 kcal", protein: "150g" },
  },
  {
    day: "週日",
    focus: "主動恢復",
    exercises: [],
    diet: { title: "恢復補給", desc: "低脂牛奶・全穀麥片・水果拼盤・深海魚油", calories: "1,600 kcal", protein: "120g" },
  },
];

/**
 * 根據今天星期幾取得對應計畫
 */
export function getTodayPlan() {
  const todayIdx = new Date().getDay(); // 0=Sun
  return WEEKLY_PLAN[todayIdx === 0 ? 6 : todayIdx - 1];
}

/**
 * 根據 id 查找運動資料
 */
export function getExerciseById(id) {
  return EXERCISE_MAPPING.find((ex) => ex.id === id);
}

// ============================================================
// 教練語句庫
// ============================================================

/** 組間休息時顯示的科學小撇步 */
export const COACH_REST_TIPS = [
  "💧 休息時補充一口水，保持肌肉的含水量有助於力量表現。",
  "📵 休息時放下手機，專注感受目標肌群的充血感。",
  "🫁 進行 3 次深呼吸，幫助心率穩定，為下一組做好準備。",
  "🧊 輕輕甩動手臂，促進乳酸代謝，減少酸痛感。",
  "🧠 閉眼 10 秒，想像下一組的完美動作軌跡。",
  "🦵 站起來走動幾步，避免肌肉冷卻過快。",
  "💪 回想上一組的發力感，找到最佳的「Mind-Muscle Connection」。",
  "🍌 如果訓練超過 45 分鐘，考慮補充一根香蕉維持血糖。",
];

/** 完成一組時的隨機激勵語 */
export const COACH_ENCOURAGEMENTS = [
  "太強了！這組完美！💥",
  "就是這個節奏，繼續保持！🔥",
  "肌肉正在成長，你感受到了嗎？💪",
  "又突破了一組，離目標更近了！🎯",
  "這就是冠軍的訓練態度！🏆",
  "穩定且有力，教練看到你的進步了！📈",
  "深呼吸，準備下一組的爆發！⚡",
  "你的毅力讓人敬佩，撐住！🛡️",
  "每一下都算數，你沒有浪費任何一個動作！✅",
  "今天的汗水，就是明天的成果！🌟",
];

/** 疲勞偵測時的教練提示 */
export const COACH_FATIGUE_MSG =
  "偵測到發力速度下降，這是增肌的好時機，撐住！";
