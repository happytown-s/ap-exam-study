import { useState, useEffect } from 'react'

interface Stats {
  correct: number;
  total: number;
}

type Tab = 'quiz' | 'calc' | 'subjectb';

export default function Progress() {
  const [tab, setTab] = useState<Tab>('quiz');
  const [quizStats, setQuizStats] = useState<Record<string, Stats>>({});
  const [calcStats, setCalcStats] = useState<Record<string, Stats>>({});
  const [sbStats, setSbStats] = useState<Record<string, Stats>>({});

  useEffect(() => {
    const qs = localStorage.getItem('ap-quiz-stats');
    if (qs) setQuizStats(JSON.parse(qs));
    const cs = localStorage.getItem('ap-calc-stats');
    if (cs) setCalcStats(JSON.parse(cs));
    const ss = localStorage.getItem('ap-b-stats');
    if (ss) setSbStats(JSON.parse(ss));
  }, []);

  const renderBar = (label: string, stats: Stats) => {
    const pct = stats.total > 0 ? Math.round((stats.correct / stats.total) * 100) : 0;
    return (
      <div className="mb-3">
        <div className="flex justify-between text-sm mb-1">
          <span className="text-gray-300">{label}</span>
          <span className="text-gray-400">{stats.correct}/{stats.total} ({pct}%)</span>
        </div>
        <div className="w-full bg-[#252550] rounded-full h-2.5">
          <div
            className="bg-gradient-to-r from-[#ff6b35] to-[#f7c948] h-2.5 rounded-full transition-all"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  };

  const totalStats = (stats: Record<string, Stats>) => {
    const entries = Object.values(stats);
    return {
      correct: entries.reduce((s, e) => s + e.correct, 0),
      total: entries.reduce((s, e) => s + e.total, 0),
    };
  };

  const renderOverall = (label: string, stats: Record<string, Stats>, color: string) => {
    const t = totalStats(stats);
    const pct = t.total > 0 ? Math.round((t.correct / t.total) * 100) : 0;
    return (
      <div className={`rounded-xl p-6 ${color}`}>
        <h3 className="text-lg font-bold text-white mb-2">{label}</h3>
        <div className="flex items-end gap-2">
          <span className="text-4xl font-bold text-[#f7c948]">{pct}%</span>
          <span className="text-gray-400 text-sm mb-1">({t.correct}/{t.total})</span>
        </div>
        <div className="w-full bg-[#252550] rounded-full h-3 mt-3">
          <div
            className="bg-gradient-to-r from-[#ff6b35] to-[#f7c948] h-3 rounded-full"
            style={{ width: `${pct}%` }}
          />
        </div>
      </div>
    );
  };

  const quizCategories = ['Hardware/Architecture', 'OS/Software', 'Network', 'Database', 'Security', 'System Architecture', 'Project Management', 'Strategy/Legal'];
  const calcTopics = ['Queuing Theory', 'Reliability', 'CPU Scheduling', 'Memory/Paging', 'Network Performance', 'DB Normalization', 'Cryptography'];
  const sbTopics = ['Algorithm Design', 'Data Structures', 'System Design', 'UML/Modeling', 'Test Design', 'Network Design', 'Performance Analysis', 'Scenario Problems'];

  const clearData = (key: string) => {
    localStorage.removeItem(key);
    if (key === 'ap-quiz-stats') setQuizStats({});
    if (key === 'ap-calc-stats') setCalcStats({});
    if (key === 'ap-b-stats') setSbStats({});
  };

  return (
    <div className="space-y-4">
      <h2 className="text-xl font-bold text-[#f7c948]">Progress</h2>

      <div className="flex gap-2 mb-6">
        {(['quiz', 'calc', 'subjectb'] as Tab[]).map(t => (
          <button
            key={t}
            onClick={() => setTab(t)}
            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
              tab === t
                ? 'bg-gradient-to-r from-[#ff6b35] to-[#f7c948] text-black'
                : 'bg-[#1a1a3e] text-gray-300 hover:bg-[#252550]'
            }`}
          >
            {t === 'quiz' ? 'Quiz' : t === 'calc' ? 'Calc' : 'Subject B'}
          </button>
        ))}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-6">
        {renderOverall('Quiz', quizStats, 'bg-[#1a1a3e]')}
        {renderOverall('Calc Training', calcStats, 'bg-[#1a1a3e]')}
        {renderOverall('Subject B', sbStats, 'bg-[#1a1a3e]')}
      </div>

      {tab === 'quiz' && (
        <div className="bg-[#1a1a3e] rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Quiz Progress by Category</h3>
            <button
              onClick={() => clearData('ap-quiz-stats')}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Reset
            </button>
          </div>
          {quizCategories.map(cat => renderBar(cat, quizStats[cat] || { correct: 0, total: 0 }))}
          {Object.keys(quizStats).length === 0 && <p className="text-gray-500 text-sm">No quiz data yet. Start practicing!</p>}
        </div>
      )}

      {tab === 'calc' && (
        <div className="bg-[#1a1a3e] rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Calc Training Progress</h3>
            <button
              onClick={() => clearData('ap-calc-stats')}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Reset
            </button>
          </div>
          {calcTopics.map(t => renderBar(t, calcStats[t] || { correct: 0, total: 0 }))}
          {Object.keys(calcStats).length === 0 && <p className="text-gray-500 text-sm">No calc data yet. Start practicing!</p>}
        </div>
      )}

      {tab === 'subjectb' && (
        <div className="bg-[#1a1a3e] rounded-xl p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="text-lg font-bold text-white">Subject B Progress</h3>
            <button
              onClick={() => clearData('ap-b-stats')}
              className="text-xs text-red-400 hover:text-red-300"
            >
              Reset
            </button>
          </div>
          {sbTopics.map(t => renderBar(t, sbStats[t] || { correct: 0, total: 0 }))}
          {Object.keys(sbStats).length === 0 && <p className="text-gray-500 text-sm">No Subject B data yet. Start practicing!</p>}
        </div>
      )}
    </div>
  );
}
