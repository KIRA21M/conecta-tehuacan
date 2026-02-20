import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import LoginPage from '../page';

// Mock de Next.js
jest.mock('next/navigation', () => ({
    useRouter: () => ({ push: jest.fn() }),
}));

jest.mock('next/link', () => {
    return ({ children, href }) => <a href={href}>{children}</a>;
});

jest.mock('@/components/layout/Header', () => ({
    Header: () => <header data-testid="header">Header</header>,
}));

jest.mock('@/components/layout/Footer', () => ({
    Footer: () => <footer data-testid="footer">Footer</footer>,
}));

describe('Pagina de Inicio de Sesion', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('debe renderizar el titulo CONECTA TEHUACAN', () => {
        render(<LoginPage />);
        expect(screen.getByText('CONECTA')).toBeInTheDocument();
    });

    test('debe renderizar los campos de correo electronico y contrasena', () => {
        render(<LoginPage />);
        expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Contraseña/i)).toBeInTheDocument();
    });

    test('debe renderizar el boton de Iniciar Sesion', () => {
        render(<LoginPage />);
        expect(screen.getByRole('button', { name: /Iniciar Sesión/i })).toBeInTheDocument();
    });

    test('debe renderizar el enlace a Crear Cuenta', () => {
        render(<LoginPage />);
        expect(screen.getByText('Crear Cuenta')).toBeInTheDocument();
    });

    test('debe renderizar el enlace de contrasena olvidada', () => {
        render(<LoginPage />);
        expect(screen.getByText(/Olvidaste tu contraseña/i)).toBeInTheDocument();
    });

    test('debe permitir escribir en el campo de correo electronico', async () => {
        render(<LoginPage />);
        const emailInput = screen.getByLabelText(/Correo Electrónico/i);
        await userEvent.type(emailInput, 'test@ejemplo.com');
        expect(emailInput).toHaveValue('test@ejemplo.com');
    });

    test('debe permitir escribir en el campo de contrasena', async () => {
        render(<LoginPage />);
        const passwordInput = screen.getByLabelText(/Contraseña/i);
        await userEvent.type(passwordInput, 'micontrasena123');
        expect(passwordInput).toHaveValue('micontrasena123');
    });

    test('debe establecer el foco en el campo de correo al cargar', async () => {
        render(<LoginPage />);
        const emailInput = screen.getByLabelText(/Correo Electrónico/i);
        await waitFor(() => {
            expect(emailInput).toHaveFocus();
        });
    });

    test('debe mostrar el texto de carga al enviar el formulario', async () => {
        render(<LoginPage />);
        const emailInput = screen.getByLabelText(/Correo Electrónico/i);
        const passwordInput = screen.getByLabelText(/Contraseña/i);
        const submitButton = screen.getByRole('button', { name: /Iniciar Sesión/i });

        await userEvent.type(emailInput, 'test@ejemplo.com');
        await userEvent.type(passwordInput, 'contrasena123');
        await userEvent.click(submitButton);

        expect(screen.getByRole('button', { name: /Cargando/i })).toBeInTheDocument();
    });

    test('debe renderizar el header y el footer', () => {
        render(<LoginPage />);
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    test('debe navegar al campo de contrasena con flecha abajo', async () => {
        render(<LoginPage />);
        const emailInput = screen.getByLabelText(/Correo Electrónico/i);
        const passwordInput = screen.getByLabelText(/Contraseña/i);

        emailInput.focus();
        fireEvent.keyDown(emailInput, { key: 'ArrowDown' });

        await waitFor(() => {
            expect(passwordInput).toHaveFocus();
        });
    });

    test('debe navegar al campo de correo con flecha arriba desde contrasena', async () => {
        render(<LoginPage />);
        const emailInput = screen.getByLabelText(/Correo Electrónico/i);
        const passwordInput = screen.getByLabelText(/Contraseña/i);

        passwordInput.focus();
        fireEvent.keyUp(passwordInput, { key: 'ArrowUp' });

        await waitFor(() => {
            expect(emailInput).toHaveFocus();
        });
    });
});
