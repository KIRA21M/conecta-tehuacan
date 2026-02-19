import { render, screen, fireEvent } from '@testing-library/react';
import LoginPage from '../page';
import '@testing-library/jest-dom';

// Mock Next.js router
jest.mock('next/navigation', () => ({
    useRouter: () => ({
        push: jest.fn(),
    }),
}));

describe('LoginPage', () => {
    it('debe renderizar los campos de correo y contraseña', () => {
        render(<LoginPage />);
        expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    });

    it('el botón de inicio de sesión debe estar presente', () => {
        render(<LoginPage />);
        expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument();
    });

    it('debe permitir escribir en los campos', () => {
        render(<LoginPage />);
        const emailInput = screen.getByLabelText(/Correo Electrónico/i) as HTMLInputElement;
        fireEvent.change(emailInput, { target: { value: 'test@example.com' } });
        expect(emailInput.value).toBe('test@example.com');
    });
});
