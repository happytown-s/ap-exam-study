import type { QuizConfig } from '../core/types';

export const quizConfig: QuizConfig = {
  id: 'ap-exam-exam',
  title: '応用情報',
  description: '応用情報技術者試験 問題集',
  passLine: 60,
  examQuestions: 80,
  examTimeLimit: 150,
  categories: [
    { id: 'hardware', name: 'ハードウェア', label: 'ハードウェア', icon: '🖥️', file: () => import('./questions').then(m => m.allQuestions.filter(q => q.category === 'hardware')) },    { id: 'system-arch', name: 'システム構成', label: 'システム構成', icon: '🏗️', file: () => import('./questions').then(m => m.allQuestions.filter(q => q.category === 'system-arch')) },    { id: 'network', name: 'ネットワーク', label: 'ネットワーク', icon: '🌐', file: () => import('./questions').then(m => m.allQuestions.filter(q => q.category === 'network')) },    { id: 'database', name: 'データベース', label: 'データベース', icon: '💾', file: () => import('./questions').then(m => m.allQuestions.filter(q => q.category === 'database')) },    { id: 'security', name: 'セキュリティ', label: 'セキュリティ', icon: '🔒', file: () => import('./questions').then(m => m.allQuestions.filter(q => q.category === 'security')) },    { id: 'os-software', name: 'OS・ソフトウェア', label: 'OS・ソフトウェア', icon: '💿', file: () => import('./questions').then(m => m.allQuestions.filter(q => q.category === 'os-software')) },    { id: 'strategy', name: 'ストラテジ', label: 'ストラテジ', icon: '📋', file: () => import('./questions').then(m => m.allQuestions.filter(q => q.category === 'strategy')) },    { id: 'pm', name: 'プロジェクトマネジメント', label: 'プロジェクトマネジメント', icon: '📈', file: () => import('./questions').then(m => m.allQuestions.filter(q => q.category === 'pm')) }
  ],
  termsFile: () => import('./terms').then(m => m.terms),
};
