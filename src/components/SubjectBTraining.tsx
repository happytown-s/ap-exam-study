import { useState, useEffect } from 'react'
import topicsData from '../data/subject-b-training.json'

interface SBQuestion {
  question: string;
  options: string[];
  correct: number;
  explanation: string;
  code?: string | null;
}

interface SBTopic {
  topic: string;
  questions: SBQuestion[];
}

type SBMode = 'overview' | 'practice' | 'code' | 'challenge';

export default function SubjectBTraining() {
  const [topics, setTopics] = useState<SBTopic[]>(topicsData);
  const [selectedTopic, setSelectedTopic] = useState<number | null>(null);
  const [mode, setMode] = useState<SBMode>('overview');
  const [currentQ, setCurrentQ] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [total, setTotal] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [showCode, setShowCode] = useState(false);
  const [stats, setStats] = useState<Record<string, { correct: number; total: number }>>({});
  const [isFinished, setIsFinished] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('ap-b-stats');
    if (saved) setStats(JSON.parse(saved));
  }, []);

  const selectTopic = (idx: number) => {
    setSelectedTopic(idx);
    setCurrentQ(0);
    setScore(0);
    setTotal(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setShowCode(false);
    setIsFinished(false);
  };

  const handleAnswer = (optIndex: number) => {
    if (selectedAnswer !== null || selectedTopic === null) return;
    setSelectedAnswer(optIndex);
    setShowExplanation(true);
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
      localStorage.setItem('ap-b-stats', JSON.stringify(updated));
      return updated;
    });
  };

  const nextQuestion = () => {
    if (selectedTopic === null) return;
    const topic = topics[selectedTopic];
    if (currentQ + 1 >= topic.questions.length) {
      setIsFinished(true);
      return;
    }
    setCurrentQ(prev => prev + 1);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setShowCode(false);
  };

  const resetTopic = () => {
    setCurrentQ(0);
    setScore(0);
    setTotal(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setShowCode(false);
    setIsFinished(false);
  };

  if (topics.length === 0) return <div className="text-center py-20 text-gray-400">Loading...</div>;

  const topicData = selectedTopic !== null ? topics[selectedTopic] : null;

  return (
    <div className="space-y-4">
      {selectedTopic === null ? (
        <>
          <h2 className="text-xl font-bold text-[#f7c948]">Subject B Training</h2>
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
              onClick={() => setSelectedTopic(null)}
              className="text-sm text-gray-400 hover:text-white"
            >
              &larr; Back
            </button>
            <h2 className="text-lg font-bold text-[#f7c948]">{topicData?.topic}</h2>
          </div>

          <div className="flex gap-2 mb-4 overflow-x-auto">
            {(['overview', 'practice', 'code', 'challenge'] as SBMode[]).map(m => (
              <button
                key={m}
                onClick={() => { setMode(m); resetTopic(); }}
                className={`px-3 py-1.5 rounded-lg text-xs font-medium whitespace-nowrap transition-colors ${
                  mode === m
                    ? 'bg-gradient-to-r from-[#ff6b35] to-[#f7c948] text-black'
                    : 'bg-[#1a1a3e] text-gray-300 hover:bg-[#252550]'
                }`}
              >
                {m.charAt(0).toUpperCase() + m.slice(1)}
              </button>
            ))}
          </div>

          {mode === 'overview' && topicData && (
            <div className="bg-[#1a1a3e] rounded-xl p-6">
              <h3 className="text-lg font-bold text-[#f7c948] mb-4">Topic Overview</h3>
              <p className="text-gray-300 mb-4">{topicData.questions.length} problems in this topic.</p>
              <p className="text-sm text-gray-400">
                Practice mode tests your knowledge. Code mode focuses on problems with pseudocode.
                Challenge mode tests all questions with scoring.
              </p>
              <div className="mt-4 space-y-2">
                {topicData.questions.slice(0, 5).map((q, i) => (
                  <div key={i} className="text-sm text-gray-400 bg-[#252550] rounded p-3">
                    Q{i + 1}: {q.question.substring(0, 80)}...
                  </div>
                ))}
              </div>
            </div>
          )}

          {mode === 'practice' && topicData && (
            <>
              {isFinished ? (
                <div className="bg-[#1a1a3e] rounded-xl p-8 text-center">
                  <h2 className="text-2xl font-bold text-[#f7c948] mb-4">Complete!</h2>
                  <p className="text-xl mb-2">
                    Score: <span className="text-[#ff6b35] font-bold">{score}</span> / {total}
                  </p>
                  <button onClick={resetTopic} className="mt-6 px-6 py-3 bg-gradient-to-r from-[#ff6b35] to-[#f7c948] text-black rounded-lg font-bold hover:opacity-90">
                    Try Again
                  </button>
                </div>
              ) : (
                <div className="bg-[#1a1a3e] rounded-xl p-6">
                  <div className="flex justify-between items-center mb-4">
                    <span className="text-sm text-gray-400">Q{currentQ + 1} / {topicData.questions.length}</span>
                    <span className="text-sm text-gray-400">Score: {score}/{total}</span>
                  </div>

                  {topicData.questions[currentQ].code && (
                    <div className="mb-4">
                      <button
                        onClick={() => setShowCode(!showCode)}
                        className="text-xs text-[#f7c948] hover:underline"
                      >
                        {showCode ? 'Hide' : 'Show'} Code
                      </button>
                      {showCode && (
                        <pre className="mt-2 bg-[#0a0a1a] rounded-lg p-4 text-xs text-green-300 font-mono overflow-x-auto">
                          {topicData.questions[currentQ].code}
                        </pre>
                      )}
                    </div>
                  )}

                  <h3 className="text-lg font-medium mb-6 leading-relaxed">
                    {topicData.questions[currentQ].question}
                  </h3>

                  <div className="space-y-3 mb-6">
                    {topicData.questions[currentQ].options.map((opt, i) => {
                      let cls = 'bg-[#252550] border-2 border-transparent hover:border-[#ff6b35] text-gray-200';
                      if (selectedAnswer !== null) {
                        if (i === topicData.questions[currentQ].correct) cls = 'bg-green-900/50 border-2 border-green-500 text-green-300';
                        else if (i === selectedAnswer) cls = 'bg-red-900/50 border-2 border-red-500 text-red-300';
                      }
                      return (
                        <button
                          key={i}
                          onClick={() => handleAnswer(i)}
                          disabled={selectedAnswer !== null}
                          className={`w-full text-left p-4 rounded-lg transition-all ${cls} ${selectedAnswer !== null ? 'cursor-default' : 'cursor-pointer'}`}
                        >
                          {String.fromCharCode(65 + i)}. {opt}
                        </button>
                      );
                    })}
                  </div>

                  {showExplanation && (
                    <div className="bg-[#252550] rounded-lg p-4 mb-4">
                      <p className="text-sm text-gray-300 leading-relaxed">{topicData.questions[currentQ].explanation}</p>
                    </div>
                  )}

                  {selectedAnswer !== null && (
                    <div className="flex justify-end">
                      <button onClick={nextQuestion} className="px-6 py-2 bg-gradient-to-r from-[#ff6b35] to-[#f7c948] text-black rounded-lg font-bold text-sm hover:opacity-90">
                        Next
                      </button>
                    </div>
                  )}
                </div>
              )}
            </>
          )}

          {mode === 'code' && topicData && (
            <div className="bg-[#1a1a3e] rounded-xl p-6">
              <h3 className="text-lg font-bold text-[#f7c948] mb-4">Code Problems</h3>
              {topicData.questions
                .filter(q => q.code)
                .map((q, i) => (
                  <div key={i} className="mb-6 bg-[#252550] rounded-lg p-4">
                    <p className="text-sm text-gray-200 mb-3">{q.question}</p>
                    <pre className="bg-[#0a0a1a] rounded p-3 text-xs text-green-300 font-mono overflow-x-auto mb-3">
                      {q.code}
                    </pre>
                    <details className="text-xs">
                      <summary className="text-[#f7c948] cursor-pointer">Show Answer</summary>
                      <p className="mt-2 text-gray-300">{q.explanation}</p>
                    </details>
                  </div>
                ))}
            </div>
          )}

          {mode === 'challenge' && topicData && (
            <div className="bg-[#1a1a3e] rounded-xl p-6 text-center">
              <p className="text-gray-400 mb-4">Challenge mode tests all questions sequentially. Uses the same interface as Practice mode.</p>
              <button
                onClick={() => setMode('practice')}
                className="px-6 py-3 bg-gradient-to-r from-[#ff6b35] to-[#f7c948] text-black rounded-lg font-bold hover:opacity-90"
              >
                Start Challenge
              </button>
            </div>
          )}
        </>
      )}
    </div>
  );
}
