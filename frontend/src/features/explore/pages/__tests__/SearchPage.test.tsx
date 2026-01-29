import { render, screen, fireEvent } from '@testing-library/react';
import { SearchPage } from '../SearchPage';
import { usePrompts } from '@/features/prompts/hooks';

const mockSetSearchParams = vi.fn();
vi.mock('react-router', () => ({
  useSearchParams: vi.fn(() => [
    new URLSearchParams({ search: 'test' }),
    mockSetSearchParams,
  ]),
}));

vi.mock('@/features/prompts/hooks', () => ({
  usePrompts: vi.fn(),
}));

vi.mock('@/components/AppPagination', () => ({
  AppPagination: ({ page, totalPages, onPageChange }: any) => (
    <div data-testid="app-pagination" data-page={page} data-total={totalPages} onClick={() => onPageChange(2)} />
  ),
}));

vi.mock('@/features/prompts/components/PromptsGrid', () => ({
  PromptsGrid: ({ prompts }: any) => (
    <div data-testid="prompts-grid">{prompts.length} prompts</div>
  ),
}));

describe('SearchPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders search form and passes search param to usePrompts', () => {
    (usePrompts as any).mockReturnValue({
      prompts: [],
      page: 1,
      pages: 1,
      setPage: vi.fn(),
    });

    render(<SearchPage />);

    expect(screen.getByRole('form')).toBeDefined();
    expect(usePrompts).toHaveBeenCalledWith({ search: 'test', limit: 12 });
  });

  it('displays no prompts found message when prompts array is empty', () => {
    (usePrompts as any).mockReturnValue({
      prompts: [],
      page: 1,
      pages: 1,
      setPage: vi.fn(),
    });

    render(<SearchPage />);

    expect(screen.getByText('No prompts found')).toBeDefined();
    expect(screen.queryByTestId('prompts-grid')).toBeNull();
    expect(screen.queryByTestId('app-pagination')).toBeNull();
  });

  it('renders PromptsGrid and AppPagination when prompts are present', () => {
    const mockPrompts = [{ id: 1, title: 'Prompt 1' }, { id: 2, title: 'Prompt 2' }];
    (usePrompts as any).mockReturnValue({
      prompts: mockPrompts,
      page: 1,
      pages: 5,
      setPage: vi.fn(),
    });

    render(<SearchPage />);

    expect(screen.getByTestId('prompts-grid')).toBeDefined();
    expect(screen.getByText('2 prompts')).toBeDefined();
    expect(screen.getByTestId('app-pagination')).toBeDefined();
    expect(screen.queryByText('No prompts found')).toBeNull();
  });

  it('calls setSearchParams when search form is submitted', () => {
    (usePrompts as any).mockReturnValue({
      prompts: [],
      page: 1,
      pages: 1,
      setPage: vi.fn(),
    });

    render(<SearchPage />);

    const input = screen.getByPlaceholderText('Search prompts...');
    const form = screen.getByRole('form');

    fireEvent.change(input, { target: { value: 'new search' } });
    fireEvent.submit(form);

    expect(mockSetSearchParams).toHaveBeenCalledWith({ search: 'new search' });
  });
});
