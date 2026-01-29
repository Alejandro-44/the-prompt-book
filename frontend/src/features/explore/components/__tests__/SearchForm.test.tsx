import { render, screen, fireEvent } from '@testing-library/react';
import SearchForm from '../SearchForm';

describe('SearchForm', () => {
  it('renders the search input with correct attributes', () => {
    const mockOnSearch = vi.fn();
    render(<SearchForm onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Search prompts...');
    expect(input).toBeDefined();
    expect(input).toHaveProperty('name', 'search');
    expect(input).toHaveProperty('type', 'search');
  });

  it('calls onSearch with the input value on form submit', () => {
    const mockOnSearch = vi.fn();
    render(<SearchForm onSearch={mockOnSearch} />);

    const input = screen.getByPlaceholderText('Search prompts...');
    const form = screen.getByRole('form');

    fireEvent.change(input, { target: { value: 'test search' } });
    fireEvent.submit(form);

    expect(mockOnSearch).toHaveBeenCalledWith('test search');
  });

  it('calls onSearch with empty string when input is empty', () => {
    const mockOnSearch = vi.fn();
    render(<SearchForm onSearch={mockOnSearch} />);

    const form = screen.getByRole('form');
    fireEvent.submit(form);

    expect(mockOnSearch).toHaveBeenCalledWith('');
  });
});
