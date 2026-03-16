const PALETTE = [
  '#e44991', '#e57339', '#e5b839', '#4bc96b',
  '#39a5e5', '#7c5ce5', '#e54545', '#45b5aa',
  '#c75ce5', '#5c8ae5', '#e5a045', '#5ce577',
  '#e55c8a', '#39c2d6', '#a0a05c', '#d65c39',
]

export function projectColor(name) {
  if (!name) return '#999'
  let hash = 0
  for (let i = 0; i < name.length; i++) {
    hash = ((hash << 5) - hash + name.charCodeAt(i)) | 0
  }
  return PALETTE[Math.abs(hash) % PALETTE.length]
}
