import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { MemoryRouter } from 'react-router-dom';
import AuthPage from '@/pages/AuthPage';

const { signInWithPassword } = vi.hoisted(() => ({
  signInWithPassword: vi.fn().mockResolvedValue({ error: null }),
}));
vi.mock('@/integrations/supabase/client', () => ({
  supabase: { auth: { signInWithPassword } },
}));
vi.mock('react-i18next', () => ({ useTranslation: () => ({ t: (key: string) => key }) }));

afterEach(() => {
  cleanup();
  vi.unstubAllEnvs();
  vi.clearAllMocks();
});

describe('email authentication without Google configuration', () => {
  it('keeps password login available while Google is hidden', async () => {
    vi.stubEnv('VITE_GOOGLE_AUTH_ENABLED', 'false');
    render(<MemoryRouter><AuthPage /></MemoryRouter>);
    expect(screen.queryByRole('button', { name: 'auth.googleContinue' })).not.toBeInTheDocument();
    fireEvent.change(screen.getByPlaceholderText('auth.email'), { target: { value: 'local@example.test' } });
    fireEvent.change(screen.getByPlaceholderText('auth.password'), { target: { value: 'local-test-password' } });
    fireEvent.click(screen.getByRole('button', { name: 'auth.login' }));
    await waitFor(() => expect(signInWithPassword).toHaveBeenCalledWith({ email: 'local@example.test', password: 'local-test-password' }));
  });

  it('shows Google login only when configured', () => {
    vi.stubEnv('VITE_GOOGLE_AUTH_ENABLED', 'true');
    render(<MemoryRouter><AuthPage /></MemoryRouter>);
    expect(screen.getByRole('button', { name: 'auth.googleContinue' })).toBeInTheDocument();
    expect(screen.getByPlaceholderText('auth.password')).toBeInTheDocument();
  });
});
