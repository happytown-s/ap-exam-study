import { useState, useEffect, useRef } from 'react'
import topicsData from '../data/subject-b-training.json'

interface PseudoQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  code?: string | null;
}

interface PseudoTopic {
  topic: string;
  questions: PseudoQuestion[];
}

interface Props {
  onBack: () => void;
}

function CodeBlock({ code }: { code: string }) {
  return (
    <div className="my-3 rounded-lg overflow-hidden border border-gray-700 dark:border-gray-600">
      <div className="bg-gray-800 px-4 py-2 text-xs text-gray-400 font-mono flex items-center gap-2">
        <span className="w-3 h-3 rounded-full bg-red-500 inline-block"></span>
        <span className="w-3 h-3 rounded-full bg-yellow-500 inline-block"></span>
        <span className="w-3 h-3 rounded-full bg-green-500 inline-block"></span>
        <span className="ml-2 text-gray-500">pseudo</span>
      </div>
      <pre className="bg-gray-900 text-green-300 p-4 overflow-x-auto text-sm leading-relaxed" style={{ fontFamily: "'Cascadia Code', 'Fira Code', 'Consolas', monospace" }}>
        <code>{code}</code>
      </pre>
    </div>
  );
}

export default function PseudoLanguageTraining({ onBack }: Props) {
  const [topics] = useState<PseudoTopic[]>(topicsData);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [stats, setStats] = useState<Record<string, { correct: number; total: number }>>({});
  const [timer, setTimer] = useState(300);
  const [isTestMode, setIsTestMode] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
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
    const saved = localStorage.getItem('ap-pseudo-stats');
    if (saved) setStats(JSON.parse(saved));
    return () => { if (timerRef.current) clearInterval(timerRef.current); };
  }, []);

  const updateStats = (topic: string, correct: boolean) => {
    setStats(prev => {
      const next = { ...prev };
      if (!next[topic]) next[topic] = { correct: 0, total: 0 };
      next[topic].total++;
      if (correct) next[topic].correct++;
      localStorage.setItem('ap-pseudo-stats', JSON.stringify(next));
      return next;
    });
  };

  const startTest = () => {
    setIsTestMode(true);
    setIsFinished(false);
    setTimer(300);
    setCurrentQ(0);
    setSelectedAnswer(null);
    setScore(0);
    setTotal(0);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setTimer(t => {
        if (t <= 1) { if (timerRef.current) clearInterval(timerRef.current); setIsFinished(true); return 0; }
        return t - 1;
      });
    }, 1000);
  };

  const formatTime = (s: number) => {
    const m = Math.floor(s / 60);
    const sec = s % 60;
    return `${m}:${sec.toString().padStart(2, '0')}`;
  };

  if (topics.length === 0) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  const topicData = selectedTopic !== null ? topics[selectedTopic] : null;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors" onTouchStart={handleTouchStart} onTouchEnd={handleTouchEnd}>
      <div className="max-w-2xl mx-auto px-4 py-8">
        <button
          onClick={selectedTopic !== null ? () => { setSelectedTopic(null); setIsTestMode(false); if (timerRef.current) clearInterval(timerRef.current); } : onBack}
          className="mb-6 text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors flex items-center gap-2"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" /></svg>
          {selectedTopic !== null ? 'Topics' : 'Back'}
        </button>

        {topicData ? (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-white">{topicData.topic}</h2>
              {!isTestMode && (
                <button onClick={startTest} className="px-4 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white text-sm font-medium hover:opacity-90">Start Timed Test (5min)</button>
              )}
            </div>

            {isTestMode && !isFinished && (
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Q{currentQ + 1}/{topicData.questions.length}</span>
                <span className={`font-mono font-bold text-lg ${timer < 30 ? 'text-red-500 animate-pulse' : 'text-gray-900 dark:text-white'}`}>{formatTime(timer)}</span>
              </div>
            )}

            {isFinished ? (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 text-center">
                <div className="text-5xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent mb-2">{score}/{total}</div>
                <p className="text-gray-500 dark:text-gray-400 mb-4">{total > 0 ? `${Math.round((score / total) * 100)}% accuracy` : ''}</p>
                <button onClick={() => { setIsTestMode(false); setIsFinished(false); }} className="px-6 py-2 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-medium hover:opacity-90">Back to Practice</button>
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5">
                {!isTestMode && (
                  <div className="flex justify-between items-center mb-4 text-sm text-gray-500 dark:text-gray-400">
                    <span>Question {currentQ + 1} / {topicData.questions.length}</span>
                    <span>Score: {score}</span>
                  </div>
                )}
                <p className="text-gray-900 dark:text-white font-medium mb-3">{topicData.questions[currentQ].question}</p>
                {topicData.questions[currentQ].code && <CodeBlock code={topicData.questions[currentQ].code} />}
                <div className="space-y-2 mb-4">
                  {topicData.questions[currentQ].options.map((opt, idx) => {
                    let cls = 'border-2 rounded-lg p-3 text-left transition-all cursor-pointer ';
                    if (selectedAnswer === null) {
                      cls += 'border-gray-200 dark:border-gray-600 hover:border-cyan-400 dark:hover:border-cyan-500';
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
                      }} className={cls}>
                        <span className="text-sm text-gray-900 dark:text-white">{opt}</span>
                        {selectedAnswer !== null && idx === topicData.questions[currentQ].correct && <span className="ml-2 text-green-600 font-bold text-xs">Correct</span>}
                        {selectedAnswer === idx && idx !== topicData.questions[currentQ].correct && <span className="ml-2 text-red-600 font-bold text-xs">Wrong</span>}
                      </button>
                    );
                  })}
                </div>
                {selectedAnswer !== null && !isTestMode && (
                  <div className="bg-indigo-50 dark:bg-indigo-900/20 rounded-lg p-3 mb-3 border border-indigo-200 dark:border-indigo-800">
                    <p className="text-sm text-indigo-800 dark:text-indigo-300">{topicData.questions[currentQ].explanation}</p>
                  </div>
                )}
                {selectedAnswer !== null && (
                  <button onClick={() => {
                    if (currentQ + 1 >= topicData.questions.length) {
                      if (isTestMode) { if (timerRef.current) clearInterval(timerRef.current); setIsFinished(true); }
                    } else {
                      setCurrentQ(q => q + 1);
                      setSelectedAnswer(null);
                    }
                  }} className="w-full py-3 rounded-lg bg-gradient-to-r from-cyan-500 to-blue-600 text-white font-bold hover:opacity-90 transition-opacity">
                    {currentQ + 1 >= topicData.questions.length ? (isTestMode ? 'Finish Test' : 'Done') : 'Next'}
                  </button>
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
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4 shadow-lg">PL</div>
              <h1 className="text-3xl font-bold bg-gradient-to-r from-cyan-500 to-blue-600 bg-clip-text text-transparent">Subject B Training</h1>
              <p className="text-gray-500 dark:text-gray-400 mt-2">IPA Pseudo-Language Drills for FE Exam</p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {topics.map((topic, idx) => {
                const s = stats[topic.topic];
                const pct = s && s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
                return (
                  <button key={idx} onClick={() => { setSelectedTopic(idx); setCurrentQ(0); setSelectedAnswer(null); setScore(0); setTotal(0); setIsTestMode(false); setIsFinished(false); }} className="bg-white dark:bg-gray-800 rounded-xl shadow-lg p-5 text-left hover:scale-[1.02] transition-transform group">
                    <h3 className="font-bold text-gray-900 dark:text-white group-hover:text-cyan-500 dark:group-hover:text-cyan-400 transition-colors">{topic.topic}</h3>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">{topic.questions.length} questions</p>
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
