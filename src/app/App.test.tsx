import { cleanup, fireEvent, render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { afterEach, beforeEach, describe, expect, it } from 'vitest';
import App from './App';

describe('Bundesland onboarding and trainer', () => {
  beforeEach(() => window.localStorage.clear());
  afterEach(() => cleanup());

  it('requires a Bundesland selection on first visit', () => {
    render(<MemoryRouter><App /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /which bundesland are you preparing for/i })).toBeInTheDocument();
    expect(screen.getByLabelText(/federal state/i)).toBeInTheDocument();
  });

  it('saves the selected Bundesland and opens the trainer', () => {
    render(<MemoryRouter><App /></MemoryRouter>);
    fireEvent.change(screen.getByLabelText(/federal state/i), { target: { value: 'by' } });
    expect(window.localStorage.getItem('lid-trainer-bundesland')).toBe('by');
    expect(screen.getByRole('heading', { name: /lid test trainer/i })).toBeInTheDocument();
    expect(screen.getAllByText(/bayern/i).length).toBeGreaterThan(0);
    expect(screen.getByText(/topics/i)).toBeInTheDocument();
  });

  it('restores a saved Bundesland on the next visit', () => {
    window.localStorage.setItem('lid-trainer-bundesland', 'by');
    render(<MemoryRouter><App /></MemoryRouter>);
    expect(screen.getByRole('heading', { name: /lid test trainer/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: /which bundesland/i })).not.toBeInTheDocument();
  });

  it('allows the user to change their Bundesland', () => {
    window.localStorage.setItem('lid-trainer-bundesland', 'by');
    render(<MemoryRouter><App /></MemoryRouter>);
    fireEvent.click(screen.getByRole('button', { name: /change state/i }));
    expect(screen.getByRole('heading', { name: /your bundesland/i })).toBeInTheDocument();
    fireEvent.change(screen.getByLabelText(/federal state/i), { target: { value: 'he' } });
    expect(window.localStorage.getItem('lid-trainer-bundesland')).toBe('he');
    expect(screen.getByRole('heading', { name: /lid test trainer/i })).toBeInTheDocument();
    expect(screen.getAllByText(/hessen/i).length).toBeGreaterThan(0);
  });

  it('shows all original learning topics', () => {
    window.localStorage.setItem('lid-trainer-bundesland', 'by');
    render(<MemoryRouter><App /></MemoryRouter>);
    expect(screen.getAllByRole('button').filter((button) => button.className.includes('topic-row'))).toHaveLength(9);
  });

  it('persists the original legacy LocalStorage formats', () => {
    window.localStorage.setItem('lid-trainer-bundesland', 'by');
    window.localStorage.setItem('lid2-stats', JSON.stringify({ '1': { r: true } }));
    window.localStorage.setItem('lid2-bm', JSON.stringify(['2']));
    window.localStorage.setItem('lid2-pos', JSON.stringify(7));
    window.localStorage.setItem('lid-en', JSON.stringify(false));
    window.localStorage.setItem('lid-exam-date', JSON.stringify('2027-01-15'));
    render(<MemoryRouter><App /></MemoryRouter>);
    expect(screen.getAllByRole('checkbox')[0]).not.toBeChecked();
    expect(screen.getByDisplayValue('2027-01-15')).toBeInTheDocument();
    expect(screen.getByText('1/310')).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /bookmarks \(1\)/i })).toBeInTheDocument();
  });
});
