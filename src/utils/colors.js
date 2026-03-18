const PALETTE = [
  '#e44991', // 0  pink/magenta  (~330°)
  '#39a5e5', // 1  sky blue      (~205°) — opposite pink
  '#4bc96b', // 2  green         (~135°) — 120° from blue
  '#e57339', // 3  orange        (~25°)  — 120° from green
  '#7c5ce5', // 4  violet        (~260°)
  '#45b5aa', // 5  teal          (~175°)
  '#e5b839', // 6  amber         (~45°)
  '#e54545', // 7  red           (~0°)
  '#c75ce5', // 8  purple        (similar to violet)
  '#39c2d6', // 9  cyan          (similar to teal)
  '#e5a045', // 10 light orange  (similar to orange)
  '#5ce577', // 11 light green   (similar to green)
  '#e55c8a', // 12 rose          (similar to pink)
  '#5c8ae5', // 13 periwinkle    (similar to blue)
  '#a0a05c', // 14 olive         (similar to amber)
  '#d65c39', // 15 terracotta    (similar to red)
]

export function projectColor(index) {
  if (index == null || index < 0) return '#999'
  return PALETTE[index % PALETTE.length]
}
