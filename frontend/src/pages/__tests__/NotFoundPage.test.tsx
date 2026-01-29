import { screen, fireEvent } from '@testing-library/react';
import { NotFoundPage } from '../NotFoundPage';
import { renderWithProviders } from '../../tests/utils/renderWithProviders';

const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('NotFoundPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the 404 page correctly', () => {
    renderWithProviders(<NotFoundPage />);

    expect(screen.getByText('404')).toBeDefined();
    expect(screen.getByText('Page Not Found')).toBeDefined();
    expect(screen.getByText('The page you are looking for does not exist.')).toBeDefined();
    expect(screen.getByRole('button', { name: /go home/i })).toBeDefined();
  });

  it('navigates to home when Go Home button is clicked', () => {
    renderWithProviders(<NotFoundPage />);

    const button = screen.getByRole('button', { name: /go home/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
