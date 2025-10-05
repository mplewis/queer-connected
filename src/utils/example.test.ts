import { describe, expect, it } from 'vitest';
import { add, subtract } from './example';

describe('add', () => {
  it('adds two numbers correctly', () => {
    expect(add(2, 3)).toBe(5);
  });

  it('handles negative numbers', () => {
    expect(add(-1, 1)).toBe(0);
  });
});

describe('subtract', () => {
  it('subtracts two numbers correctly', () => {
    expect(subtract(5, 3)).toBe(2);
  });

  it('handles negative results', () => {
    expect(subtract(3, 5)).toBe(-2);
  });
});
