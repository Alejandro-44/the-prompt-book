import { getPageNumbers } from '../getPageNumers';

describe('getPageNumbers', () => {
  it('should return pages around current with siblings', () => {
    expect(getPageNumbers(5, 10, 2)).toEqual([3, 4, 5, 6, 7]);
  });

  it('should handle start boundary', () => {
    expect(getPageNumbers(1, 10, 2)).toEqual([1, 2, 3]);
  });

  it('should handle end boundary', () => {
    expect(getPageNumbers(10, 10, 2)).toEqual([8, 9, 10]);
  });

  it('should handle small total', () => {
    expect(getPageNumbers(2, 3, 2)).toEqual([1, 2, 3]);
  });

  it('should handle siblingCount 0', () => {
    expect(getPageNumbers(5, 10, 0)).toEqual([5]);
  });

  it('should handle siblingCount larger than possible', () => {
    expect(getPageNumbers(1, 2, 5)).toEqual([1, 2]);
  });
});
