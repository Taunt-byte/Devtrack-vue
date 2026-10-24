import { addDays, toDateStr } from './date'

export function loadDemoData({ subjects, tasks, sessions }) {
  const vue = subjects.add({ name: 'Vue 3', color: '#8b5cf6', weeklyGoalMin: 300 })
  const algo = subjects.add({ name: 'Algorithms', color: '#38bdf8', weeklyGoalMin: 240 })
  const eng = subjects.add({ name: 'Technical English', color: '#f472b6', weeklyGoalMin: 120 })

  const today = new Date()
  const due = (n) => toDateStr(addDays(today, n))

  tasks.add({ title: 'Finish Composition API course module', subjectId: vue.id, priority: 'high', status: 'doing', due: due(1) })
  tasks.add({ title: 'Build a Pinia store from scratch', subjectId: vue.id, priority: 'medium', status: 'todo', due: due(4) })
  tasks.add({ title: 'Solve 5 binary search problems', subjectId: algo.id, priority: 'high', status: 'todo', due: due(-1) })
  tasks.add({ title: 'Read the Big-O cheat sheet', subjectId: algo.id, priority: 'low', status: 'done', due: '' })
  tasks.add({ title: 'Write a 200-word dev blog draft in English', subjectId: eng.id, priority: 'medium', status: 'todo', due: due(6) })

  const plan = [
    [0, vue, 60], [0, eng, 20], [1, algo, 75], [2, vue, 90], [3, algo, 40],
    [4, vue, 50], [5, eng, 30], [5, algo, 45], [6, vue, 35]
  ]
  plan.forEach(([ago, subject, minutes]) => {
    sessions.add({ subjectId: subject.id, minutes, date: toDateStr(addDays(today, -ago)), note: 'Demo session' })
  })
}
