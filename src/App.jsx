import React, { useState, useEffect, useRef, useCallback } from 'react';
import {
  Play, CheckCircle2, Youtube, Edit3,
  TrendingUp, X, ChevronRight, Utensils,
  Timer, Dumbbell, Flame, Coffee,
  Heart, Zap, RotateCcw, Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  EXERCISE_MAPPING,
  WEEKLY_PLAN,
  COACH_REST_TIPS,
  COACH_ENCOURAGEMENTS,
  COACH_FATIGUE_MSG,
  getExerciseById,
} from './exerciseData';

// ─── 常數 ───
const FATIGUE_THRESHOLD = 45;  // 秒
const REST_DURATION = 60;      // 秒
const TIMER_RING_MAX = 90;     // 計時圓環滿圈秒數
const TIMER_RING_R = 100;      // SVG 圓環半徑
const TIMER_RING_C = 2 * Math.PI * TIMER_RING_R; // 周長

// ─── 工具函式 ───
const pickRandom = (arr) => arr[Math.floor(Math.random() * arr.length)];

const getDayDates = () => {
  const today = new Date();
  const dayOfWeek = today.getDay(); // 0=Sun
  const monday = new Date(today);
  monday.setDate(today.getDate() - ((dayOfWeek + 6) % 7));
  return Array.from({ length: 7 }, (_, i) => {
    const d = new Date(monday);
    d.setDate(monday.getDate() + i);
    return d;
  });
};

const dayLabels = ["日", "一", "二", "三", "四", "五", "六"];

// ═══════════════════════════════════════════════════════
// 主應用
// ═══════════════════════════════════════════════════════
export default function NeoCoachLifeFitness() {
  // ─── 基礎狀態 ───
  const [coachName, setCoachName] = useState("Neo Coach");
  const [isEditingName, setIsEditingName] = useState(false);
  const [coachMsg, setCoachMsg] = useState("歡迎來到健身房，今天專注在器材的發力感！");

  // ─── 日期選擇 ───
  const weekDates = getDayDates();
  const todayStr = new Date().toDateString();
  const [selectedDayIdx, setSelectedDayIdx] = useState(() => {
    const todayDow = new Date().getDay();
    return todayDow === 0 ? 6 : todayDow - 1; // 0=Mon
  });

  const currentPlan = WEEKLY_PLAN[selectedDayIdx];
  const dayExercises = currentPlan.exercises
    .map(getExerciseById)
    .filter(Boolean);

  // ─── 訓練模式 ───
  const [activeEx, setActiveEx] = useState(null);
  const [timer, setTimer] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [isFatigued, setIsFatigued] = useState(false);
  const [currentSet, setCurrentSet] = useState(1);
  const timerRef = useRef(null);

  // ─── 組間休息 ───
  const [isResting, setIsResting] = useState(false);
  const [restTimer, setRestTimer] = useState(REST_DURATION);
  const [restTip, setRestTip] = useState("");
  const restRef = useRef(null);

  // ─── YouTube Drawer ───
  const [ytDrawer, setYtDrawer] = useState(null); // { name, ytId }

  // ─── 已完成動作 (todolist) ───
  const [completedExercises, setCompletedExercises] = useState(new Set());

  // ─── 訓練計時 ───
  useEffect(() => {
    if (isRunning) {
      timerRef.current = setInterval(() => {
        setTimer((t) => {
          if (t + 1 >= FATIGUE_THRESHOLD && !isFatigued) {
            setIsFatigued(true);
          }
          return t + 1;
        });
      }, 1000);
    } else {
      clearInterval(timerRef.current);
    }
    return () => clearInterval(timerRef.current);
  }, [isRunning, isFatigued]);

  // ─── 休息倒數 ───
  useEffect(() => {
    if (isResting && restTimer > 0) {
      restRef.current = setInterval(() => {
        setRestTimer((t) => t - 1);
      }, 1000);
    } else if (restTimer <= 0 && isResting) {
      setIsResting(false);
      setRestTimer(REST_DURATION);
      setCoachMsg("休息結束！準備好下一組了嗎？全力以赴！");
    }
    return () => clearInterval(restRef.current);
  }, [isResting, restTimer]);

  // ─── 結束一組 ───
  const handleFinishSet = useCallback(() => {
    setIsRunning(false);
    clearInterval(timerRef.current);

    const encouragement = pickRandom(COACH_ENCOURAGEMENTS);

    if (isFatigued) {
      setCoachMsg(`${encouragement}\n建議維持重量或微降 2.5kg。`);
    } else {
      setCoachMsg(`${encouragement}\n下組建議嘗試 ${activeEx.lastWeight + 2.5}kg！`);
    }

    setTimer(0);
    setIsFatigued(false);

    if (currentSet < activeEx.sets) {
      setCurrentSet((s) => s + 1);
      setRestTip(pickRandom(COACH_REST_TIPS));
      setIsResting(true);
      setRestTimer(REST_DURATION);
    } else {
      setCoachMsg("所有組數完成！你今天表現得太棒了！🎉");
      setCompletedExercises((prev) => new Set([...prev, activeEx.id]));
      setTimeout(() => {
        setActiveEx(null);
        setCurrentSet(1);
      }, 2000);
    }
  }, [activeEx, currentSet, isFatigued]);

  // ─── 開始訓練 ───
  const startExercise = (ex) => {
    setActiveEx(ex);
    setCurrentSet(1);
    setTimer(0);
    setIsFatigued(false);
    setIsRunning(false);
    setIsResting(false);
    setCoachMsg(`準備進行「${ex.name}」，調整好座椅高度後開始！`);
  };

  // ─── 關閉訓練 Modal ───
  const closeTraining = () => {
    setActiveEx(null);
    setTimer(0);
    setIsRunning(false);
    setIsFatigued(false);
    setCurrentSet(1);
    setIsResting(false);
    clearInterval(timerRef.current);
    clearInterval(restRef.current);
  };

  // ═══════════════════════════════════════════════════════
  // RENDER
  // ═══════════════════════════════════════════════════════
  return (
    <div className="min-h-screen bg-black text-white font-sans selection:bg-lime-400 selection:text-black">
      <div className="max-w-md mx-auto px-5 py-6 pb-32">

        {/* ━━━ Header / 教練系統 ━━━ */}
        <header className="mb-8">
          <div className="flex items-center gap-4">
            <div className="w-14 h-14 bg-[#D2FF00] rounded-full flex items-center justify-center text-black font-black text-xl shrink-0 shadow-[0_0_20px_rgba(210,255,0,0.3)]">
              {coachName[0]}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 text-zinc-500 text-[10px] font-bold uppercase tracking-widest mb-1">
                <Edit3 size={10} />
                {isEditingName ? (
                  <input
                    autoFocus
                    value={coachName}
                    onChange={(e) => setCoachName(e.target.value)}
                    onBlur={() => setIsEditingName(false)}
                    onKeyDown={(e) => e.key === "Enter" && setIsEditingName(false)}
                    className="bg-transparent border-b border-[#D2FF00] text-white text-xs p-0 focus:outline-none w-28"
                  />
                ) : (
                  <span
                    onClick={() => setIsEditingName(true)}
                    className="cursor-pointer hover:text-white transition"
                  >
                    {coachName}
                  </span>
                )}
              </div>
              <p className="text-zinc-400 text-sm italic font-medium leading-snug truncate">
                「{coachMsg}」
              </p>
            </div>
          </div>
        </header>

        {/* ━━━ 日期滑動選擇器 ━━━ */}
        <section className="mb-8">
          <div className="flex gap-2 overflow-x-auto hide-scrollbar pb-2">
            {weekDates.map((d, i) => {
              const isToday = d.toDateString() === todayStr;
              const isActive = i === selectedDayIdx;
              return (
                <button
                  key={i}
                  onClick={() => setSelectedDayIdx(i)}
                  className={`date-chip flex flex-col items-center min-w-[52px] py-3 px-2 rounded-2xl font-bold text-sm
                    ${isActive
                      ? "active bg-[#D2FF00] text-black"
                      : "bg-white/5 text-zinc-400 hover:bg-white/10"
                    }
                    ${isToday && !isActive ? "ring-1 ring-[#D2FF00]/40" : ""}
                  `}
                >
                  <span className="text-[10px] uppercase font-bold tracking-wider opacity-70">
                    {dayLabels[d.getDay()]}
                  </span>
                  <span className="text-lg mt-0.5">{d.getDate()}</span>
                  {isToday && (
                    <div className={`w-1.5 h-1.5 rounded-full mt-1 ${isActive ? "bg-black" : "bg-[#D2FF00]"}`} />
                  )}
                </button>
              );
            })}
          </div>
        </section>

        {/* ━━━ 當日訓練重點 ━━━ */}
        <section className="mb-6">
          <div className="flex items-center gap-3 mb-4">
            <Dumbbell size={20} className="text-[#D2FF00]" />
            <h2 className="ntc-title text-2xl">{currentPlan.focus}</h2>
            <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-1">
              {currentPlan.day}
            </span>
          </div>
        </section>

        {/* ━━━ 飲食推薦卡片 ━━━ */}
        <section className="mb-8">
          <div className="glass-card rounded-3xl p-5">
            <div className="flex items-center gap-2 mb-3">
              <Utensils size={16} className="text-[#D2FF00]" />
              <h3 className="text-xs font-bold uppercase tracking-widest text-zinc-400">
                今日飲食建議
              </h3>
            </div>
            <p className="ntc-title text-lg text-[#D2FF00] mb-2">{currentPlan.diet.title}</p>
            <p className="text-sm text-zinc-300 leading-relaxed mb-3">{currentPlan.diet.desc}</p>
            <div className="flex gap-4">
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Flame size={12} className="text-orange-400" />
                <span>{currentPlan.diet.calories}</span>
              </div>
              <div className="flex items-center gap-1.5 text-xs text-zinc-500">
                <Zap size={12} className="text-blue-400" />
                <span>蛋白質 {currentPlan.diet.protein}</span>
              </div>
            </div>
          </div>
        </section>

        {/* ━━━ 訓練課表 ━━━ */}
        <section>
          <h2 className="ntc-title text-3xl mb-6">Today's Session</h2>

          {dayExercises.length === 0 ? (
            <div className="glass-card rounded-3xl p-8 text-center">
              <Coffee size={40} className="text-[#D2FF00] mx-auto mb-4" />
              <p className="ntc-title text-xl mb-2">主動恢復日</p>
              <p className="text-sm text-zinc-400">今天好好休息，做些輕度伸展或散步即可。</p>
            </div>
          ) : (
            <div className="space-y-4">
              {dayExercises.map((ex) => {
                const isDone = completedExercises.has(ex.id);
                return (
                  <div
                    key={ex.id}
                    className={`glass-card rounded-3xl p-6 group relative transition-all duration-500 ${isDone ? "opacity-60 border-[#D2FF00]/20" : ""
                      }`}
                  >
                    {/* 完成標記 */}
                    {isDone && (
                      <div className="absolute top-4 left-4 w-8 h-8 bg-[#D2FF00] rounded-full flex items-center justify-center shadow-[0_0_15px_rgba(210,255,0,0.4)]">
                        <Check size={18} className="text-black" strokeWidth={3} />
                      </div>
                    )}

                    {/* 卡片頂部：名稱 + YouTube 按鈕 */}
                    <div className={`flex justify-between items-start mb-5 ${isDone ? "pl-10" : ""}`}>
                      <div
                        onClick={() => !isDone && startExercise(ex)}
                        className={`flex-1 min-w-0 ${isDone ? "" : "cursor-pointer"}`}
                      >
                        <h3 className={`ntc-title text-xl mb-1 transition-colors ${isDone ? "line-through text-zinc-500" : "group-hover:text-[#D2FF00]"
                          }`}>
                          {ex.name}
                        </h3>
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                          {ex.machine}
                        </p>
                      </div>
                      <button
                        onClick={() => setYtDrawer({ name: ex.name, ytId: ex.ytId })}
                        className="flex items-center gap-1.5 bg-white/10 hover:bg-[#D2FF00]/20 px-3 py-2 rounded-2xl text-[#D2FF00] transition-all text-[11px] font-bold uppercase tracking-wider shrink-0 ml-3"
                        title="Life Fitness 器材教學"
                      >
                        <Youtube size={16} />
                        <span className="hidden sm:inline">器材教學</span>
                      </button>
                    </div>

                    {/* 卡片底部：數據 + 建議重量 */}
                    <div className="flex justify-between items-end">
                      <div className="flex gap-5">
                        <div className="text-center">
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">組數</p>
                          <p className="font-bold text-lg">{ex.sets}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">次數</p>
                          <p className="font-bold text-lg">{ex.target}</p>
                        </div>
                        <div className="text-center">
                          <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider">部位</p>
                          <p className="font-bold text-lg">{ex.bodyPart}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-wider mb-1">建議重量</p>
                        <p className="neon-weight font-black italic text-2xl">
                          {ex.lastWeight + 2.5} KG
                        </p>
                      </div>
                    </div>

                    {/* 開始按鈕 / 完成標記 */}
                    {isDone ? (
                      <div className="mt-5 w-full py-3.5 rounded-2xl bg-[#D2FF00]/10 font-black uppercase tracking-wider text-sm flex items-center justify-center gap-2 text-[#D2FF00]">
                        <CheckCircle2 size={16} />
                        已完成
                      </div>
                    ) : (
                      <button
                        onClick={() => startExercise(ex)}
                        className="mt-5 w-full py-3.5 rounded-2xl bg-white/5 hover:bg-[#D2FF00] hover:text-black font-black uppercase tracking-wider text-sm transition-all flex items-center justify-center gap-2 group/btn"
                      >
                        <Play size={16} className="group-hover/btn:scale-110 transition-transform" />
                        開始訓練
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </section>
      </div>

      {/* ━━━ YouTube Drawer ━━━ */}
      <AnimatePresence>
        {ytDrawer && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setYtDrawer(null)}
              className="fixed inset-0 drawer-backdrop z-40"
            />
            <motion.div
              initial={{ y: "100%" }}
              animate={{ y: 0 }}
              exit={{ y: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed bottom-0 left-0 right-0 z-50 yt-drawer rounded-t-3xl max-h-[85vh] overflow-hidden"
            >
              {/* Drawer Handle */}
              <div className="flex justify-center pt-3 pb-2">
                <div className="w-10 h-1 bg-zinc-600 rounded-full" />
              </div>

              {/* Drawer Header */}
              <div className="flex items-center justify-between px-5 pb-4">
                <div className="flex items-center gap-2">
                  <Youtube size={18} className="text-red-500" />
                  <div>
                    <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                      Life Fitness 器材教學
                    </p>
                    <p className="ntc-title text-base">{ytDrawer.name}</p>
                  </div>
                </div>
                <button
                  onClick={() => setYtDrawer(null)}
                  className="text-zinc-500 hover:text-white transition p-2"
                >
                  <X size={20} />
                </button>
              </div>

              {/* YouTube Iframe */}
              <div className="px-5 pb-8">
                <div className="relative w-full rounded-2xl overflow-hidden" style={{ paddingBottom: "56.25%" }}>
                  <iframe
                    className="absolute inset-0 w-full h-full"
                    src={`https://www.youtube.com/embed/${ytDrawer.ytId}?rel=0&modestbranding=1`}
                    title={`${ytDrawer.name} 教學影片`}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                    frameBorder="0"
                  />
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* ━━━ 訓練模式 Modal ━━━ */}
      <AnimatePresence>
        {activeEx && (
          <motion.div
            initial={{ y: "100%" }}
            animate={{ y: 0 }}
            exit={{ y: "100%" }}
            transition={{ type: "spring", damping: 28, stiffness: 280 }}
            className="fixed inset-0 bg-black z-50 flex flex-col overflow-hidden"
          >
            {/* 頂部工具列 */}
            <div className="flex justify-between items-center px-6 pt-6 pb-2">
              <button
                onClick={() => setYtDrawer({ name: activeEx.name, ytId: activeEx.ytId })}
                className="text-[#D2FF00] flex items-center gap-2 font-bold uppercase text-xs tracking-wider"
              >
                <Youtube size={16} /> 器材教學
              </button>
              <div className="text-center">
                <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest">
                  第 {currentSet} / {activeEx.sets} 組
                </span>
              </div>
              <button
                onClick={closeTraining}
                className="text-zinc-500 hover:text-white transition p-1"
              >
                <X size={22} />
              </button>
            </div>

            {/* ─── 組間休息畫面 ─── */}
            {isResting ? (
              <div className="flex-1 flex flex-col items-center justify-center px-8">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  className="text-center"
                >
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-[0.2em] mb-4">
                    組間休息
                  </p>

                  {/* 倒數圓環 */}
                  <div className="relative w-52 h-52 mx-auto mb-8">
                    <svg className="w-full h-full -rotate-90" viewBox="0 0 200 200">
                      <circle
                        cx="100" cy="100" r="88"
                        fill="none"
                        stroke="rgba(255,255,255,0.05)"
                        strokeWidth="6"
                      />
                      <circle
                        cx="100" cy="100" r="88"
                        fill="none"
                        stroke="#D2FF00"
                        strokeWidth="6"
                        strokeLinecap="round"
                        strokeDasharray={2 * Math.PI * 88}
                        strokeDashoffset={2 * Math.PI * 88 * (1 - restTimer / REST_DURATION)}
                        className="transition-all duration-1000 linear"
                      />
                    </svg>
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                      <span className="text-6xl font-black italic text-white">
                        {restTimer}
                      </span>
                      <span className="text-xs text-zinc-500 font-bold uppercase mt-1">秒</span>
                    </div>
                  </div>

                  {/* 科學小撇步 */}
                  <div className="tip-card rounded-2xl p-5 max-w-xs mx-auto">
                    <p className="text-[10px] text-[#D2FF00] font-bold uppercase tracking-widest mb-2">
                      💡 教練小撇步
                    </p>
                    <p className="text-sm text-zinc-300 leading-relaxed">{restTip}</p>
                  </div>

                  {/* 跳過休息 */}
                  <button
                    onClick={() => {
                      setIsResting(false);
                      setRestTimer(REST_DURATION);
                      clearInterval(restRef.current);
                      setCoachMsg("跳過休息！準備開始下一組！");
                    }}
                    className="mt-6 text-zinc-500 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 mx-auto transition"
                  >
                    <ChevronRight size={14} /> 跳過休息
                  </button>
                </motion.div>
              </div>
            ) : (
              /* ─── 訓練計時畫面 ─── */
              <div className="flex-1 flex flex-col items-center justify-center px-8">
                <h2 className="ntc-title text-3xl text-center mb-2">{activeEx.name}</h2>
                <p className="text-xs text-zinc-500 font-bold uppercase tracking-widest mb-8">
                  {activeEx.machine}
                </p>

                {/* 計時圓環 — 一開始深灰，隨時間填色 */}
                {(() => {
                  const progress = Math.min(timer / TIMER_RING_MAX, 1);
                  const ringColor = isFatigued ? "#ef4444" : "#D2FF00";
                  const glowColor = isFatigued ? "rgba(239,68,68,0.3)" : "rgba(210,255,0,0.25)";
                  return (
                    <div className="relative w-64 h-64 mb-6">
                      <svg className="w-full h-full -rotate-90" viewBox="0 0 220 220">
                        {/* 背景灰色圓環 */}
                        <circle
                          cx="110" cy="110" r={TIMER_RING_R}
                          fill="none"
                          stroke="rgba(255,255,255,0.06)"
                          strokeWidth="8"
                        />
                        {/* 進度填色圓環 */}
                        <circle
                          cx="110" cy="110" r={TIMER_RING_R}
                          fill="none"
                          stroke={ringColor}
                          strokeWidth="8"
                          strokeLinecap="round"
                          strokeDasharray={TIMER_RING_C}
                          strokeDashoffset={TIMER_RING_C * (1 - progress)}
                          style={{
                            transition: "stroke-dashoffset 1s linear, stroke 0.3s ease",
                            filter: `drop-shadow(0 0 8px ${glowColor})`,
                          }}
                        />
                      </svg>
                      {/* 中央時間顯示 */}
                      <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span
                          className={`text-6xl sm:text-7xl font-black italic leading-none transition-colors duration-300 ${isFatigued ? "text-red-500 fatigue-pulse" : "text-white"
                            }`}
                        >
                          {String(Math.floor(timer / 60)).padStart(2, "0")}:{String(timer % 60).padStart(2, "0")}
                        </span>
                        <span className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mt-2">
                          {isFatigued ? "⚠️ 疲勞偵測中" : "計時中"}
                        </span>
                      </div>
                    </div>
                  );
                })()}

                {/* 建議重量 */}
                <div className="mb-6 text-center">
                  <p className="text-[10px] text-zinc-500 font-bold uppercase tracking-widest mb-1">建議重量</p>
                  <p className="neon-weight font-black italic text-3xl">
                    {activeEx.lastWeight + 2.5} KG
                  </p>
                </div>

                {/* 疲勞提示 */}
                <AnimatePresence>
                  {isFatigued && (
                    <motion.div
                      initial={{ y: 20, opacity: 0 }}
                      animate={{ y: 0, opacity: 1 }}
                      exit={{ y: 20, opacity: 0 }}
                      className="mb-6 px-5 py-3 bg-red-500/10 border border-red-500/30 rounded-2xl max-w-xs text-center"
                    >
                      <p className="text-red-400 font-bold text-sm leading-relaxed">
                        ⚠️ {COACH_FATIGUE_MSG}
                      </p>
                    </motion.div>
                  )}
                </AnimatePresence>

                {/* 開始 / 結束按鈕 */}
                <button
                  onClick={isRunning ? handleFinishSet : () => setIsRunning(true)}
                  className={`w-36 h-36 rounded-full border-[5px] flex flex-col items-center justify-center transition-all duration-300
                    ${isRunning
                      ? "border-red-500 shadow-[0_0_40px_rgba(239,68,68,0.25)] hover:shadow-[0_0_60px_rgba(239,68,68,0.35)]"
                      : "border-[#D2FF00] shadow-[0_0_40px_rgba(210,255,0,0.15)] hover:shadow-[0_0_60px_rgba(210,255,0,0.25)]"
                    }`}
                >
                  {isRunning ? (
                    <>
                      <CheckCircle2 size={40} className="text-red-500" />
                      <span className="font-black mt-2 uppercase tracking-tighter text-sm text-red-500">
                        結束這組
                      </span>
                    </>
                  ) : (
                    <>
                      <Play size={40} className="text-[#D2FF00]" />
                      <span className="font-black mt-2 uppercase tracking-tighter text-sm text-[#D2FF00]">
                        開始
                      </span>
                    </>
                  )}
                </button>
              </div>
            )}

            {/* 底部教練訊息 */}
            <div className="px-6 pb-8 pt-4">
              <p className="text-center text-sm italic text-zinc-400 leading-relaxed">
                「{coachMsg}」
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}