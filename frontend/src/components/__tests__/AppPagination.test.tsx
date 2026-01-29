import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { AppPagination } from '../AppPagination';

// Mock the getPageNumbers utility
vi.mock('@/utils', () => ({
  getPageNumbers: vi.fn(),
}));

const { getPageNumbers } = await import('@/utils');

describe('AppPagination', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders pagination with correct page numbers', () => {
    (getPageNumbers as any).mockReturnValue([1, 2, 3, 4, 5]);
    const mockOnPageChange = vi.fn();

    render(
      <AppPagination
        page={3}
        totalPages={5}
        onPageChange={mockOnPageChange}
      />
    );

    expect(screen.getByText('1')).toBeDefined();
    expect(screen.getByText('2')).toBeDefined();
    expect(screen.getByText('3')).toBeDefined();
    expect(screen.getByText('4')).toBeDefined();
    expect(screen.getByText('5')).toBeDefined();
    expect(getPageNumbers).toHaveBeenCalledWith(3, 5, 1);
  });

  it('highlights the current page', () => {
    (getPageNumbers as any).mockReturnValue([1, 2, 3]);
    const mockOnPageChange = vi.fn();

    render(
      <AppPagination
        page={2}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    const activeLink = screen.getByText('2');
    expect(activeLink.getAttribute("data-active")).toBe("true")
  });

  it('calls onPageChange when a page number is clicked', () => {
    (getPageNumbers as any).mockReturnValue([1, 2, 3]);
    const mockOnPageChange = vi.fn();

    render(
      <AppPagination
        page={1}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    const page2Link = screen.getByText('2');
    fireEvent.click(page2Link);

    expect(mockOnPageChange).toHaveBeenCalledWith(2);
  });

  it('calls onPageChange with previous page when Previous button is clicked', () => {
    (getPageNumbers as any).mockReturnValue([1, 2, 3]);
    const mockOnPageChange = vi.fn();

    render(
      <AppPagination
        page={2}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    const previousButton = screen.getByLabelText('Go to previous page');
    fireEvent.click(previousButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(1);
  });

  it('calls onPageChange with next page when Next button is clicked', () => {
    (getPageNumbers as any).mockReturnValue([1, 2, 3]);
    const mockOnPageChange = vi.fn();

    render(
      <AppPagination
        page={2}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByLabelText('Go to next page');
    fireEvent.click(nextButton);

    expect(mockOnPageChange).toHaveBeenCalledWith(3);
  });

  it('disables Previous button on first page', () => {
    (getPageNumbers as any).mockReturnValue([1, 2, 3]);
    const mockOnPageChange = vi.fn();

    render(
      <AppPagination
        page={1}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    const previousButton = screen.getByLabelText('Go to previous page');
    expect(previousButton.className).toContain('pointer-events-none');
    expect(previousButton.className).toContain('opacity-50');
    expect(previousButton.getAttribute('aria-disabled')).toBe('true');
  });

  it('disables Next button on last page', () => {
    (getPageNumbers as any).mockReturnValue([1, 2, 3]);
    const mockOnPageChange = vi.fn();

    render(
      <AppPagination
        page={3}
        totalPages={3}
        onPageChange={mockOnPageChange}
      />
    );

    const nextButton = screen.getByLabelText('Go to next page');
    expect(nextButton.className).toContain('pointer-events-none');
    expect(nextButton.className).toContain('opacity-50');
    expect(nextButton.getAttribute('aria-disabled')).toBe('true');
  });

  it('uses custom siblingCount', () => {
    (getPageNumbers as any).mockReturnValue([1, 2, 3, 4, 5, 6, 7]);
    const mockOnPageChange = vi.fn();

    render(
      <AppPagination
        page={4}
        totalPages={10}
        onPageChange={mockOnPageChange}
        siblingCount={2}
      />
    );

    expect(getPageNumbers).toHaveBeenCalledWith(4, 10, 2);
  });
});
