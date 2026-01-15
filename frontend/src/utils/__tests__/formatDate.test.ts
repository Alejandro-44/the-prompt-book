import { describe, it, expect } from 'vitest';
import { formatDate } from '../formatDate';

describe('formatDate', () => {
  it('should format a valid ISO date string correctly', () => {
    const dateString = '2023-10-15T00:00:00.000Z';
    const result = formatDate(dateString);
    expect(result).toBe('Oct 15, 2023');
  });

  it('should format another valid date string', () => {
    const dateString = '2021-01-01T12:00:00.000Z';
    const result = formatDate(dateString);
    expect(result).toBe('Jan 1, 2021');
  });

  it('should handle invalid date string', () => {
    const result = formatDate('invalid-date');
    expect(result).toBe('Invalid Date');
  });

  it('should handle empty string', () => {
    const result = formatDate('');
    expect(result).toBe('Invalid Date');
  });
});
