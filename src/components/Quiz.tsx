import { useState, useEffect, useCallback } from 'react'
import questionsData from '../data/ap-exam.json'

interface QuizOption {
  text: string;
  correct: boolean;
}

interface QuizQuestion {
  category: string;
  question: string;
  options: QuizOption[];
  explanation: string;
}

type Mode = 'drill' | 'exam' | 'review';

const categoryNames: Record<string, string> = {
  'Hardware/Architecture': 'ハードウェア/アーキテクチャ',
  'OS/Software': 'OS/ソフトウェア',
  'Network': 'ネットワーク',
  'Database': 'データベース',
  'Security': 'セキュリティ',
  'System Architecture': 'システムアーキテクチャ',
  'Project Management': 'プロジェクトマネジメント',
  'Strategy/Legal': 'ストラテジ/法務',
};

const modeNames: Record<string, string> = {
  drill: 'ドリル',
  exam: '模擬試験',
  review: '復習',
};

const CATEGORIES = [
  'Hardware/Architecture',
  'OS/Software',
  'Network',
  'Database',
  'Security',
  'System Architecture',
  'Project Management',
  'Strategy/Legal',
];

export default function Quiz() {
  const [questions, setQuestions] = useState<QuizQuestion[]>(questionsData);
  const [mode, setMode] = useState<Mode>('drill');
  const [selectedCategories, setSelectedCategories] = useState<string[]>(CATEGORIES);
  const [shuffle, setShuffle] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [answered, setAnswered] = useState(0);
  const [wrongIds, setWrongIds] = useState<number[]>([]);
  const [stats, setStats] = useState<Record<string, { correct: number; total: number }>>({});
  const [isFinished, setIsFinished] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);

  useEffect(() => {
    const savedStats = localStorage.getItem('ap-quiz-stats');
    if (savedStats) setStats(JSON.parse(savedStats));
    const savedWrong = localStorage.getItem('ap-quiz-wrong');
    if (savedWrong) setWrongIds(JSON.parse(savedWrong));
  }, []);

  const getFilteredQuestions = useCallback(() => {
    let filtered = questions.filter(q => selectedCategories.includes(q.category));
    if (mode === 'review' && wrongIds.length > 0) {
      filtered = filtered.filter(q => wrongIds.includes(questions.indexOf(q)));
    }
    if (shuffle) {
      const arr = [...filtered];
      for (let i = arr.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [arr[i], arr[j]] = [arr[j], arr[i]];
      }
      return arr;
    }
    return filtered;
  }, [questions, selectedCategories, mode, wrongIds, shuffle]);

  const [displayQuestions, setDisplayQuestions] = useState<QuizQuestion[]>([]);

  useEffect(() => {
    if (questions.length > 0) {
      let filtered = getFilteredQuestions();
      if (mode === 'exam') {
        filtered = filtered.slice(0, 25);
      }
      setDisplayQuestions(filtered);
      setCurrentIndex(0);
      setScore(0);
      setAnswered(0);
      setSelectedAnswer(null);
      setShowExplanation(false);
      setIsFinished(false);
    }
  }, [mode, selectedCategories, shuffle, questions.length, getFilteredQuestions]);

  const toggleCategory = (cat: string) => {
    setSelectedCategories(prev =>
      prev.includes(cat) ? prev.filter(c => c !== cat) : [...prev, cat]
    );
  };

  const handleAnswer = (optIndex: number) => {
    if (selectedAnswer !== null) return;
    setSelectedAnswer(optIndex);
    setShowExplanation(true);
    const q = displayQuestions[currentIndex];
    if (!q) return;
    const isCorrect = q.options[optIndex].correct;
    setAnswered(prev => prev + 1);
    if (isCorrect) {
      setScore(prev => prev + 1);
    } else {
      const qIdx = questions.indexOf(q);
      if (!wrongIds.includes(qIdx)) {
        const newWrong = [...wrongIds, qIdx];
        setWrongIds(newWrong);
        localStorage.setItem('ap-quiz-wrong', JSON.stringify(newWrong));
      }
    }
    const cat = q.category;
    setStats(prev => {
      const updated = { ...prev, [cat]: { correct: (prev[cat]?.correct || 0) + (isCorrect ? 1 : 0), total: (prev[cat]?.total || 0) + 1 } };
      localStorage.setItem('ap-quiz-stats', JSON.stringify(updated));
      return updated;
    });
  };

  const nextQuestion = () => {
    if (currentIndex + 1 >= displayQuestions.length) {
      setIsFinished(true);
      return;
    }
    setCurrentIndex(prev => prev + 1);
    setSelectedAnswer(null);
    setShowExplanation(false);
  };

  const restart = () => {
    setCurrentIndex(0);
    setScore(0);
    setAnswered(0);
    setSelectedAnswer(null);
    setShowExplanation(false);
    setIsFinished(false);
  };

  if (questions.length === 0) return <div className="text-center py-20 text-gray-400">Loading questions...</div>;

  const currentQ = displayQuestions[currentIndex];

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap gap-2 mb-4">
        {(['drill', 'exam', 'review'] as Mode[]).map(m => (
          <button
            key={m}
            onClick={() => setMode(m)}
            className={`px-4 py-2 rounded-lg font-medium text-sm transition-colors ${
              mode === m
                ? 'bg-gradient-to-r from-[#ff6b35] to-[#f7c948] text-black'
                : 'bg-[#1a1a3e] text-gray-300 hover:bg-[#252550]'
            }`}
          >
            {modeNames[m] || m}
            {m === 'review' && wrongIds.length > 0 && ` (${wrongIds.length})`}
          </button>
        ))}
        <label className="flex items-center gap-2 ml-auto text-sm text-gray-400">
          <input
            type="checkbox"
            checked={shuffle}
            onChange={e => setShuffle(e.target.checked)}
            className="accent-[#f7c948]"
          />
          シャッフル
        </label>
      </div>

      {mode !== 'review' && (
        <div className="flex flex-wrap gap-2">
          {CATEGORIES.map(cat => (
            <button
              key={cat}
              onClick={() => toggleCategory(cat)}
              className={`px-3 py-1 rounded text-xs transition-colors ${
                selectedCategories.includes(cat)
                  ? 'bg-[#ff6b35] text-white'
                  : 'bg-[#1a1a3e] text-gray-500'
              }`}
            >
              {categoryNames[cat] || cat}
            </button>
          ))}
        </div>
      )}

      {isFinished ? (
        <div className="bg-[#1a1a3e] rounded-xl p-8 text-center">
          <h2 className="text-2xl font-bold text-[#f7c948] mb-4">問題集完了!</h2>
          <p className="text-xl mb-2">
            得点: <span className="text-[#ff6b35] font-bold">{score}</span> / {answered}
          </p>
          <p className="text-gray-400 mb-6">
            {answered > 0 ? `正解率 ${Math.round((score / answered) * 100)}%` : ''}
          </p>
          <button
            onClick={restart}
            className="px-6 py-3 bg-gradient-to-r from-[#ff6b35] to-[#f7c948] text-black rounded-lg font-bold hover:opacity-90"
          >
            もう一度挑戦
          </button>
        </div>
      ) : currentQ ? (
        <div className="bg-[#1a1a3e] rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs px-3 py-1 rounded-full bg-[#252550] text-[#f7c948]">
              {categoryNames[currentQ.category] || currentQ.category}
            </span>
            <span className="text-sm text-gray-400">
              {currentIndex + 1} / {displayQuestions.length}
              {mode === 'drill' && ` | 得点: ${score}/${answered}`}
            </span>
          </div>

          <div className="w-full bg-[#252550] rounded-full h-1.5 mb-6">
            <div
              className="bg-gradient-to-r from-[#ff6b35] to-[#f7c948] h-1.5 rounded-full transition-all"
              style={{ width: `${((currentIndex + 1) / displayQuestions.length) * 100}%` }}
            />
          </div>

          <h3 className="text-lg font-medium mb-6 leading-relaxed">{currentQ.question}</h3>

          <div className="space-y-3 mb-6">
            {currentQ.options.map((opt, i) => {
              let btnClass = 'bg-[#252550] border-2 border-transparent hover:border-[#ff6b35] text-gray-200';
              if (selectedAnswer !== null) {
                if (opt.correct) {
                  btnClass = 'bg-green-900/50 border-2 border-green-500 text-green-300';
                } else if (i === selectedAnswer) {
                  btnClass = 'bg-red-900/50 border-2 border-red-500 text-red-300';
                }
              }
              return (
                <button
                  key={i}
                  onClick={() => handleAnswer(i)}
                  disabled={selectedAnswer !== null}
                  className={`w-full text-left p-4 rounded-lg transition-all ${btnClass} ${
                    selectedAnswer !== null ? 'cursor-default' : 'cursor-pointer'
                  }`}
                >
                  <span className="text-sm font-medium">
                    {String.fromCharCode(65 + i)}. {opt.text}
                  </span>
                </button>
              );
            })}
          </div>

          {showExplanation && (
            <div className="bg-[#252550] rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-300 leading-relaxed">{currentQ.explanation}</p>
            </div>
          )}

          {selectedAnswer !== null && (
            <div className="flex justify-end">
              <button
                onClick={nextQuestion}
                className="px-6 py-2 bg-gradient-to-r from-[#ff6b35] to-[#f7c948] text-black rounded-lg font-bold text-sm hover:opacity-90"
              >
                {currentIndex + 1 >= displayQuestions.length ? 'Finish' : 'Next'}
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="text-center py-20 text-gray-400">
          {mode === 'review' ? 'No wrong answers to review!' : 'Select at least one category.'}
        </div>
      )}
    </div>
  );
}
