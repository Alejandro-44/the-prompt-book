import { render, screen, fireEvent } from '@testing-library/react';
import { ThemeToggle } from '../ThemeToggle';

vi.mock('../theme-provider', () => ({
  useTheme: vi.fn(),
}));

const { useTheme } = await import('../theme-provider');

describe('ThemeToggle', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders the toggle button with Sun and Moon icons', () => {
    (useTheme as any).mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /change theme/i });
    expect(button).toBeDefined();

    // Check for Sun icon (visible in light mode)
    const sunIcon = document.querySelector('.lucide-sun');
    expect(sunIcon).toBeDefined();

    // Check for Moon icon (hidden in light mode, but present)
    const moonIcon = document.querySelector('.lucide-moon');
    expect(moonIcon).toBeDefined();
  });

  it('toggles from light to dark theme on click', () => {
    const mockSetTheme = vi.fn();
    (useTheme as any).mockReturnValue({
      theme: 'light',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /change theme/i });
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith('dark');
  });

  it('toggles from dark to light theme on click', () => {
    const mockSetTheme = vi.fn();
    (useTheme as any).mockReturnValue({
      theme: 'dark',
      setTheme: mockSetTheme,
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /change theme/i });
    fireEvent.click(button);

    expect(mockSetTheme).toHaveBeenCalledWith('light');
  });

  it('has correct button attributes', () => {
    (useTheme as any).mockReturnValue({
      theme: 'light',
      setTheme: vi.fn(),
    });

    render(<ThemeToggle />);

    const button = screen.getByRole('button', { name: /change theme/i });
    expect(button.getAttribute('data-variant')).toBe('ghost');
    expect(button.getAttribute('data-size')).toBe('icon');
  });
});
