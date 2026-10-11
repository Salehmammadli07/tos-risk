import { describe, it, expect } from 'vitest';
import { computeScore, levelFor, WEIGHTS } from '../src/core/score.js';

const c = (category, severity) => ({ category, severity });

describe('computeScore', () => {
  it('madde yoksa 0 ve düşük', () => {
    expect(computeScore([])).toEqual({ score: 0, level: 'low' });
  });
  it('ağırlık × şiddet çarpanı', () => {
    expect(computeScore([c('auto_renewal', 'high')])).toEqual({ score: 30, level: 'medium' });
    expect(computeScore([c('liability_limit', 'low')]).score).toBe(5);
  });
  it('aynı kategori bir kez, en yüksek şiddetle sayılır', () => {
    expect(computeScore([c('data_sharing', 'low'), c('data_sharing', 'high'), c('data_sharing', 'medium')]).score).toBe(38);
  });
  it('100 ile sınırlanır', () => {
    const all = Object.keys(WEIGHTS).map((k) => c(k, 'high'));
    expect(computeScore(all)).toEqual({ score: 100, level: 'high' });
  });
});

describe('levelFor', () => {
  it('eşikler', () => {
    expect(levelFor(29)).toBe('low');
    expect(levelFor(30)).toBe('medium');
    expect(levelFor(59)).toBe('medium');
    expect(levelFor(60)).toBe('high');
  });
});
