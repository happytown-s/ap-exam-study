import { useState, useEffect, useRef } from 'react'
import topicsData from '../data/calc-training.json'

interface CalcQuestion {
  question: string;
  options: string[];
  correct: number;
  solution: string[];
}

interface CalcTopic {
  topic: string;
  cheatsheet: string;
  example: {
    question: string;
    solution: string[];
  };
  questions: CalcQuestion[];
}

type CalcMode = 'cheatsheet' | 'example' | 'practice' | 'test' | 'advanced';

interface Props {
  onBack: () => void;
}

export default function CalcTraining({ onBack }: Props) {
  const [topics] = useState<CalcTopic[]>(topicsData);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [mode, setMode] = useState<CalcMode>('cheatsheet');
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [showSolution, setShowSolution] = useState(false);
  const [stats, setStats] = useState<Record<string, { correct: number; total: number }>>({});
  const [timer, setTimer] = useState(300);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [isFinished, setIsFinished] = useState(false);
  const touchStartRef = useRef<{ x: number; y: number } | null>(null);
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartRef.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
  };
  const handleTouchEnd = (e: React.TouchEvent) => {
    if (!touchStartRef.current) return;
    const dx = e.changedTouches[0].clientX - touchStartRef.current.x;
    const dy = e.changedTouches[0].clientY - touchStartRef.current.y;
    touchStartRef.current = null;
    if (Math.abs(dx) > 80 && Math.abs(dx) > Math.abs(dy) * 1.5 && dx > 0) { onBack(); }
  };

  useEffect(() => {
    const saved = localStorage.getItem('ap-calc-stats');
    if (saved) setStats(JSON.parse(saved));
  }, []);

  useEffect(() => {
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const updateStats = (topic: string, correct: boolean) => {
    setStats(prev => {
      const next = { ...prev };
      if (!next[topic]) next[topic] = { correct: 0, total: 0 };
      next[topic].total++;
      if (correct) next[topic].correct++;
      localStorage.setItem('ap-calc-stats', JSON.stringify(next));
      return next;
    });
  };

  const startTimer = () => {
    if (timerRef.current) clearInterval(timerRef.current);
    setTimer(300);
    setIsFinished(false);
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { if (timerRef.current) clearInterval(timerRef.current); setIsFinished(true); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  if (topics.length === 0) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  const topicData = selectedTopic !== null ? topics[selectedTopic] : null;

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={selectedTopic !== null ? () => { setSelectedTopic(null); setMode('cheatsheet'); if (timerRef.current) clearInterval(timerRef.current); } : onBack}
          className="mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          {selectedTopic !== null ? 'Topics' : 'Back'}
        </button>

        {topicData ? (
          <div className="space-y-4">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{topicData.topic}</h2>
            
            <div className="flex gap-1 bg-gray-200 dark:bg-gray-700 rounded-lg p-1">
              {(['cheatsheet', 'example', 'practice', 'test', 'advanced'] as CalcMode[]).map(m => (
                <button key={m} onClick={() => { setMode(m); setCurrentQ(0); setSelectedAnswer(null); setShowSolution(false); setScore(0); setTotal(0); setIsFinished(false); if (m === 'test') startTimer(); }} className={`flex-1 px-3 py-2 rounded-md text-sm font-medium transition-all ${mode === m ? 'bg-gradient-to-r from-red-500 to-orange-500 text-white shadow-md' : 'text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white'}`}>
                  {m === 'cheatsheet' ? 'Cheat Sheet' : m === 'example' ? 'Example' : m === 'practice' ? 'Practice' : m === 'test' ? 'Test' : 'Advanced'}
                </button>
              ))}
            </div>

            {mode === 'cheatsheet' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5">
                <h3 className="font-bold text-gray-900 dark:text-white mb-3">Step-by-step Guide</h3>
                <div className="bg-gray-50 dark:bg-gray-900 rounded-lg p-4 whitespace-pre-wrap text-sm text-gray-700 dark:text-gray-300 font-mono leading-relaxed">
                  {topicData.cheatsheet}
                </div>
              </div>
            )}

            {mode === 'example' && topicData.example && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5">
                <div className="bg-gradient-to-r from-red-50 to-orange-50 dark:from-red-900/20 dark:to-orange-900/20 rounded-lg p-4 mb-4">
                  <div className="text-xs font-bold text-red-600 dark:text-red-400 uppercase mb-1">Example Question</div>
                  <p className="text-gray-900 dark:text-white font-medium">{topicData.example.question}</p>
                </div>
                {topicData.example.solution.map((step, i) => (
                  <div key={i} className="flex gap-3 mb-2">
                    <span className="text-xs font-bold text-orange-500 bg-orange-100 dark:bg-orange-900/40 rounded px-2 py-1 h-fit whitespace-nowrap">Step {i+1}</span>
                    <span className="text-sm text-gray-700 dark:text-gray-300">{step}</span>
                  </div>
                ))}
              </div>
            )}

            {(mode === 'practice' || mode === 'advanced') && topicData.questions.length > 0 && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5">
                <div className="flex justify-between items-center mb-4 text-sm text-gray-500 dark:text-gray-400">
                  <span>Question {currentQ + 1} / {topicData.questions.length}</span>
                  <span>Score: {score}</span>
                </div>
                <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 mb-5">
                  <div className="h-2 rounded-full bg-gradient-to-r from-red-500 to-orange-500 transition-all duration-300" style={{ width: `${((currentQ + 1) / topicData.questions.length) * 100}%` }} />
                </div>
                <p className="text-gray-900 dark:text-white font-medium mb-4">{topicData.questions[currentQ].question}</p>
                <div className="space-y-2 mb-4">
                  {topicData.questions[currentQ].options.map((opt, idx) => {
                    let cls = 'border-2 rounded-lg p-3 text-left transition-all cursor-pointer ';
                    if (selectedAnswer === null) {
                      cls += 'border-gray-200 dark:border-gray-600 hover:border-orange-400 dark:hover:border-orange-500';
                    } else if (idx === topicData.questions[currentQ].correct) {
                      cls += 'border-green-500 bg-green-50 dark:bg-green-900/20';
                    } else if (selectedAnswer === idx) {
                      cls += 'border-red-500 bg-red-50 dark:bg-red-900/20';
                    } else {
                      cls += 'border-gray-200 dark:border-gray-600 opacity-50';
                    }
                    return (
                      <button key={idx} onClick={() => {
                        if (selectedAnswer !== null) return;
                        setSelectedAnswer(idx);
                        const correct = idx === topicData.questions[currentQ].correct;
                        if (correct) setScore(s => s + 1);
                        setTotal(t => t + 1);
                        updateStats(topicData.topic, correct);
                        if (!correct) setShowSolution(true);
                      }} className={cls}>
                        <span className="text-sm text-gray-900 dark:text-white">{opt}</span>
                        {selectedAnswer !== null && idx === topicData.questions[currentQ].correct && <span className="ml-2 text-green-600 font-bold text-xs">Correct</span>}
                        {selectedAnswer === idx && idx !== topicData.questions[currentQ].correct && <span className="ml-2 text-red-600 font-bold text-xs">Wrong</span>}
                      </button>
                    );
                  })}
                </div>
                {showSolution && (
                  <div className="mb-4 space-y-1">
                    {topicData.questions[currentQ].solution.map((step, i) => (
                      <div key={i} className="flex gap-2">
                        <span className="text-xs font-bold text-orange-500 bg-orange-100 dark:bg-orange-900/40 rounded px-2 py-1 h-fit whitespace-nowrap">Step {i+1}</span>
                        <span className="text-sm text-gray-700 dark:text-gray-300">{step}</span>
                      </div>
                    ))}
                  </div>
                )}
                {selectedAnswer !== null && (
                  <button onClick={() => {
                    if (currentQ + 1 >= topicData.questions.length) return;
                    setCurrentQ(q => q + 1);
                    setSelectedAnswer(null);
                    setShowSolution(false);
                  }} className="w-full py-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold hover:opacity-90 transition-opacity">
                    {currentQ + 1 >= topicData.questions.length ? `Result: ${score}/${total}` : 'Next'}
                  </button>
                )}
              </div>
            )}

            {mode === 'test' && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5">
                <div className="flex justify-between items-center mb-3">
                  <span className="text-sm text-gray-500 dark:text-gray-400">Test Mode</span>
                  <span className={`font-mono font-bold text-lg ${timer < 30 ? 'text-red-500 animate-pulse' : 'text-gray-900 dark:text-white'}`}>{formatTime(timer)}</span>
                </div>
                {isFinished ? (
                  <div className="text-center">
                    <div className="text-5xl font-bold text-gray-900 dark:text-white mb-2">{score}/{total}</div>
                    <p className="text-gray-500 dark:text-gray-400 mb-4">{total > 0 ? `${Math.round((score / total) * 100)}% accuracy` : 'No answers'}</p>
                    <button onClick={() => startTimer()} className="px-6 py-2 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-medium hover:opacity-90">Retry</button>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-900 dark:text-white font-medium mb-4">{topicData.questions[currentQ]?.question}</p>
                    <div className="space-y-2 mb-4">
                      {topicData.questions[currentQ]?.options.map((opt, idx) => {
                        let cls = 'border-2 rounded-lg p-3 text-left transition-all cursor-pointer ';
                        cls += selectedAnswer === null ? 'border-gray-200 dark:border-gray-600 hover:border-orange-400' : 'border-gray-200 dark:border-gray-600 opacity-50';
                        if (selectedAnswer === idx) cls += 'border-violet-500 bg-violet-50 dark:bg-violet-900/30';
                        return (
                          <button key={idx} onClick={() => {
                            if (selectedAnswer !== null) return;
                            setSelectedAnswer(idx);
                            const correct = idx === topicData.questions[currentQ].correct;
                            if (correct) setScore(s => s + 1);
                            setTotal(t => t + 1);
                            updateStats(topicData.topic, correct);
                          }} className={cls}>
                            <span className="text-sm text-gray-900 dark:text-white">{opt}</span>
                          </button>
                        );
                      })}
                    </div>
                    {selectedAnswer !== null && (
                      <button onClick={() => {
                        if (currentQ + 1 >= topicData.questions.length) {
                          if (timerRef.current) clearInterval(timerRef.current);
                          setIsFinished(true);
                        } else {
                          setCurrentQ(q => q + 1);
                          setSelectedAnswer(null);
                        }
                      }} className="w-full py-3 rounded-lg bg-gradient-to-r from-red-500 to-orange-500 text-white font-bold">
                        {currentQ + 1 >= topicData.questions.length ? 'Finish' : 'Next'}
                      </button>
                    )}
                  </>
                )}
              </div>
            )}

            {stats[topicData.topic] && (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-4 text-center text-sm">
                <span className="text-gray-500 dark:text-gray-400">Mastery: </span>
                <span className="font-bold text-gray-900 dark:text-white">
                  {stats[topicData.topic].total > 0 ? Math.round((stats[topicData.topic].correct / stats[topicData.topic].total) * 100) : 0}%
                  ({stats[topicData.topic].correct}/{stats[topicData.topic].total})
                </span>
              </div>
            )}
          </div>
        ) : (
          <div className="space-y-4">
            <div className="text-center mb-8">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-red-500 to-orange-500 bg-clip-text text-transparent">Calc Training</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">FE Exam Calculation Drills</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topics.map((topic, idx) => {
                const s = stats[topic.topic];
                const pct = s && s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
                return (
                  <button key={idx} onClick={() => { setSelectedTopic(idx); setMode('cheatsheet'); }} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 text-left hover:scale-[1.02] transition-transform group">
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-orange-500 dark:group-hover:text-orange-400 transition-colors">{topic.topic}</h3>
                    <div className="flex items-center gap-2 mt-3">
                      <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                        <div className={`h-2 rounded-full ${pct === 0 ? 'bg-gray-600' : pct < 80 ? 'bg-amber-500' : 'bg-green-500'} transition-all`} style={{ width: `${pct}%` }} />
                      </div>
                      <span className="text-xs text-gray-500 dark:text-gray-400">{s && s.total > 0 ? `${pct}%` : '--'}</span>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
