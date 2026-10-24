import { load, save, remove } from './storage'

const KEYS = ['subjects', 'tasks', 'sessions', 'timer-settings']

export function exportData() {
  const data = { app: 'devtrack', version: 1, exportedAt: new Date().toISOString() }
  KEYS.forEach((key) => (data[key] = load(key, null)))

  const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
  const url = URL.createObjectURL(blob)
  const link = document.createElement('a')
  link.href = url
  link.download = `devtrack-backup-${new Date().toISOString().slice(0, 10)}.json`
  link.click()
  URL.revokeObjectURL(url)
}

export async function importData(file) {
  const data = JSON.parse(await file.text())
  if (data?.app !== 'devtrack') throw new Error('This file is not a DevTrack backup.')
  KEYS.forEach((key) => {
    if (data[key] !== null && data[key] !== undefined) save(key, data[key])
  })
}

export function clearAllData() {
  KEYS.forEach(remove)
}
