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

export default function CalcTraining() {
  const [topics, setTopics] = useState<CalcTopic[]>(topicsData);
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

  useEffect(() => {
    const saved = localStorage.getItem('ap-calc-stats');
    if (saved) setStats(JSON.parse(saved));
  }, []);

  useEffect(() => {
    if (mode === 'test' && selectedTopic !== null && !isFinished) {
      timerRef.current = setInterval(() => {
        setTimer(prev => {
          if (prev <= 1) {
            if (timerRef.current) clearInterval(timerRef.current);
            setIsFinished(true);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
  }, [mode, selectedTopic, isFinished]);

  const selectTopic = (idx: number) => {
    setSelectedTopic(idx);
    setCurrentQ(0);
    setScore(0);
    setTotal(0);
    setSelectedAnswer(null);
    setShowSolution(false);
    setTimer(300);
    setIsFinished(false);
    if (timerRef.current) clearInterval(timerRef.current);
  };

  const handleAnswer = (optIndex: number) => {
    if (selectedAnswer !== null || selectedTopic === null) return;
    setSelectedAnswer(optIndex);
    setShowSolution(true);
    const topic = topics[selectedTopic];
    const q = topic.questions[currentQ];
    const isCorrect = optIndex === q.correct;
    setTotal(prev => prev + 1);
    if (isCorrect) setScore(prev => prev + 1);
    setStats(prev => {
      const t = topic.topic;
      const updated = {
        ...prev,
        [t]: { correct: (prev[t]?.correct || 0) + (isCorrect ? 1 : 0), total: (prev[t]?.total || 0) + 1 }
      };
      localStorage.setItem('ap-calc-stats', JSON.stringify(updated));
      return updated;
    });
  };

  const nextQuestion = () => {
    if (selectedTopic === null) return;
    const topic = topics[selectedTopic];
    if (currentQ + 1 >= topic.questions.length) {
      setIsFinished(true);
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }
    setCurrentQ(prev => prev + 1);
    setSelectedAnswer(null);
    setShowSolution(false);
  };

  const resetTopic = () => {
    setCurrentQ(0);
    setScore(0);
    setTotal(0);
    setSelectedAnswer(null);
    setShowSolution(false);
    setTimer(300);
    setIsFinished(false);
  };

  const formatTime = (s: number) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  if (topics.length === 0) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  const topicData = selectedTopic !== null ? topics[selectedTopic] : null;

  return (
    <div className="space-y-4">
      {selectedTopic === null ? (
        <>
          <h2 className="text-xl font-bold text-[#f7c948]">Calculation Training</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {topics.map((topic, idx) => {
              const s = stats[topic.topic];
              const pct = s && s.total > 0 ? Math.round((s.correct / s.total) * 100) : 0;
              return (
                <button
                  key={topic.topic}
                  onClick={() => selectTopic(idx)}
                  className="bg-[#1a1a3e] rounded-xl p-5 text-left hover:bg-[#252550] transition-colors"
                >
                  <h3 className="text-lg font-bold text-white mb-1">{topic.topic}</h3>
                  <p className="text-sm text-gray-400 mb-3">{topic.questions.length} problems</p>
                  <div className="w-full bg-[#252550] rounded-full h-2">
                    <div
                      className="bg-gradient-to-r from-[#ff6b35] to-[#f7c948] h-2 rounded-full"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                  <p className="text-xs text-gray-500 mt-1">{s ? `${s.correct}/${s.total} (${pct}%)` : 'Not started'}</p>
                </button>
              );
            })}
          </div>
        </>
      ) : (
        <>
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => { setSelectedTopic(null); if (timerRef.current) clearInterval(timerRef.current); }}
              className="text-sm text-gray-400 hover:text-white"
            >
              &larr; Back
            </button>
            <h2 className="text-lg font-bold text-[#f7c948]">{topicData?.topic}</h2>
            {mode === 'test' && (
              <span className={`ml-auto text-sm font-mono ${timer < 60 ? 'text-red-400' : 'text-gray-300'}`}>
                {formatTime(timer)}
              </span>
            )}
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto">
            {(['cheatsheet', 'example', 'practice', 'test', 'advanced'] as CalcMode[]).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); resetTopic(); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  mode === m
                    ? 'bg-gradient-to-r from-[#ff6b35] to-[#f7c948] text-black'
                    : 'bg-[#1a1a3e] text-gray-300 hover:bg-[#252550]'
                }`}
              >
                {m === 'test' ? 'Timed Test (5m)' : m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>

          {mode === 'cheatsheet' && topicData && (
            <div className="bg-[#1a1a3e] rounded-xl p-6">
              <h3 className="text-lg font-bold text-[#f7c948] mb-4">Cheat Sheet</h3>
              <div className="text-sm text-gray-300 whitespace-pre-wrap leading-relaxed font-mono">
                {topicData.cheatsheet}
              </div>
            </div>
          )}

          {mode === 'example' && topicData && (
            <div className="bg-[#1a1a3e] rounded-xl p-6">
              <h3 className="text-lg font-bold text-[#f7c948] mb-4">Worked Example</h3>
              <p className="text-gray-200 mb-4">{topicData.example.question}</p>
              <div className="space-y-2">
                {topicData.example.solution.map((step, i) => (
                  <p key={i} className="text-sm text-gray-300 font-mono pl-4 border-l-2 border-[#ff6b35]">
                    {step}
                  </p>
                ))}
              </div>
            </div>
          )}

          {(mode === 'practice' || mode === 'test' || mode === 'advanced') && topicData && (
            <>
              {isFinished ? (
                <div className="bg-[#1a1a3e] rounded-xl p-8 text-center">
                  <h2 className="text-2xl font-bold text-[#f7c948] mb-4">Complete!</h2>
                  <p className="text-xl mb-2">
                    Score: <span className="text-[#ff6b35] font-bold">{score}</span> / {total}
                  </p>
                  <p className="text-gray-400 mb-6">
                    {total > 0 ? `${Math.round((score / total) * 100)}% accuracy` : ''}
                  </p>
                  <button
                    onClick={resetTopic}
                    className="px-6 py-3 bg-gradient-to-r from-[#ff6b35] to-[#f7c948] text-black rounded-lg font-bold hover:opacity-90"
                  >
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="bg-[#1a1a3e] rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-400">
                      Q{currentQ + 1} / {topicData.questions.length} | Score: {score}/{total}
                    </span>
                    {mode === 'advanced' && (
                      <span className="text-xs px-2 py-1 rounded bg-[#252550] text-[#f7c948]">Advanced</span>
                    )}
                  </div>

                  <h3 className="text-lg font-medium mb-6 leading-relaxed">
                    {topicData.questions[currentQ].question}
                  </h3>

                  <div className="space-y-3 mb-6">
                    {topicData.questions[currentQ].options.map((opt, i) => {
                      let cls = 'bg-[#252550] border-2 border-transparent hover:border-[#ff6b35] text-gray-200';
                      if (selectedAnswer !== null) {
                        if (i === topicData.questions[currentQ].correct) {
                          cls = 'bg-green-900/50 border-2 border-green-500 text-green-300';
                        } else if (i === selectedAnswer) {
                          cls = 'bg-red-900/50 border-2 border-red-500 text-red-300';
                        }
                      }
                      return (
                        <button
                          key={i}
                          onClick={() => handleAnswer(i)}
                          disabled={selectedAnswer !== null}
                          className={`w-full text-left p-4 rounded-lg transition-all ${cls} ${
                            selectedAnswer !== null ? 'cursor-default' : 'cursor-pointer'
                          }`}
                        >
                          {String.fromCharCode(65 + i)}. {opt}
                        </button>
                      );
                    })}
                  </div>

                  {showSolution && (
                    <div className="bg-[#252550] rounded-lg p-4 mb-4">
                      <p className="text-xs font-bold text-[#f7c948] mb-2">Solution Steps:</p>
                      {topicData.questions[currentQ].solution.map((step, i) => (
                        <p key={i} className="text-sm text-gray-300 font-mono">{step}</p>
                      ))}
                    </div>
                  )}

                  {selectedAnswer !== null && (
                    <div className="flex justify-end">
                      <button
                        onClick={nextQuestion}
                        className="px-6 py-2 bg-gradient-to-r from-[#ff6b35] to-[#f7c948] text-black rounded-lg font-bold text-sm hover:opacity-90"
                      >
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}
