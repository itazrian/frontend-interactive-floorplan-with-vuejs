export async function fetchLayout() {
  const res = await fetch('/api/layout')
  return res.ok ? res.json() : []
}
export async function saveLayout(layout) {
  const res = await fetch('/api/layout', {
    method: 'POST',
    headers: { 'Content-Type':'application/json' },
    body: JSON.stringify(layout)
  })
  return res.json()
}
