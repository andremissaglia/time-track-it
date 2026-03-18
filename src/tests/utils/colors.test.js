import { describe, it, expect } from 'vitest'
import { projectColor } from '../../utils/colors.js'

describe('projectColor', () => {
  it('returns grey for null index', () => {
    expect(projectColor(null)).toBe('#999')
  })

  it('returns grey for negative index', () => {
    expect(projectColor(-1)).toBe('#999')
  })

  it('returns first palette color for index 0', () => {
    expect(projectColor(0)).toBe('#e44991')
  })

  it('returns second palette color for index 1', () => {
    expect(projectColor(1)).toBe('#39a5e5')
  })

  it('cycles palette when index exceeds length', () => {
    // palette has 16 colors — index 16 should wrap to index 0
    expect(projectColor(16)).toBe(projectColor(0))
  })

  it('returns consistent colors for same index', () => {
    expect(projectColor(3)).toBe(projectColor(3))
  })
})
