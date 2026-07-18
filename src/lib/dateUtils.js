export function formatHoraChilena(ts) {
  if (!ts) return '—'
  return new Date(ts).toLocaleTimeString('es-CL', {
    timeZone: 'America/Santiago',
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  })
}
