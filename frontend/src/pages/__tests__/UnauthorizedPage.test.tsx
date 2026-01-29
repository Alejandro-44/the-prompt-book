import { screen, fireEvent } from '@testing-library/react';
import { UnauthorizedPage } from '../UnauthorizedPage';
import { renderWithProviders } from '../../tests/utils/renderWithProviders';

const mockNavigate = vi.fn();
vi.mock('react-router', async (importOriginal) => {
  const actual = await importOriginal() as any;
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

describe('UnauthorizedPage', () => {
  beforeEach(() => {
    mockNavigate.mockClear();
  });

  it('renders the 403 page correctly', () => {
    renderWithProviders(<UnauthorizedPage />);

    expect(screen.getByText('403')).toBeDefined();
    expect(screen.getByText('Unauthorized Access')).toBeDefined();
    expect(screen.getByText('You do not have permission to access this page.')).toBeDefined();
    expect(screen.getByRole('button', { name: /login/i })).toBeDefined();
  });

  it('navigates to login when Login button is clicked', () => {
    renderWithProviders(<UnauthorizedPage />);

    const button = screen.getByRole('button', { name: /login/i });
    fireEvent.click(button);

    expect(mockNavigate).toHaveBeenCalledWith('/login');
    expect(mockNavigate).toHaveBeenCalledTimes(1);
  });
});
