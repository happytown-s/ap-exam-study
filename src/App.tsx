import { useState } from 'react'
import Quiz from './components/Quiz'
import CalcTraining from './components/CalcTraining'
import SubjectBTraining from './components/SubjectBTraining'
import Progress from './components/Progress'

type Tab = 'quiz' | 'calc' | 'subjectb' | 'progress'

const tabs: { id: Tab; label: string; icon: string }[] = [
  { id: 'quiz', label: '問題集', icon: 'Q' },
  { id: 'calc', label: '計算トレーニング', icon: 'C' },
  { id: 'subjectb', label: '科目B', icon: 'B' },
  { id: 'progress', label: '統計', icon: 'S' },
]

export default function App() {
  const [activeTab, setActiveTab] = useState<Tab>('quiz')

  return (
    <div className="min-h-screen" style={{ backgroundColor: '#0f0f23' }}>
      <header className="sticky top-0 z-50 backdrop-blur-md border-b border-[#252550]" style={{ backgroundColor: 'rgba(15,15,35,0.9)' }}>
        <div className="max-w-2xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            <h1 className="text-xl font-bold">
              <span className="bg-gradient-to-r from-[#ff6b35] to-[#f7c948] bg-clip-text text-transparent">
                AP Exam Study
              </span>
            </h1>
            <span className="text-xs text-gray-500">Applied Information Technology Engineer</span>
          </div>
          <nav className="flex gap-1 mt-3">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-[#ff6b35] to-[#f7c948] text-black font-bold'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-[#1a1a3e]'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </nav>
        </div>
      </header>

      <main className="max-w-2xl mx-auto px-4 py-6">
        {activeTab === 'quiz' && <Quiz />}
        {activeTab === 'calc' && <CalcTraining />}
        {activeTab === 'subjectb' && <SubjectBTraining />}
        {activeTab === 'progress' && <Progress />}
      </main>

      <footer className="text-center py-6 text-xs text-gray-600">
        AP Exam Study
      </footer>
    </div>
  )
}
