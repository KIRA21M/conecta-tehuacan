import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import RegistroPage from '../page';

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

describe('Pagina de Registro', () => {
    beforeEach(() => {
        jest.clearAllMocks();
    });

    test('debe renderizar el titulo CONECTA TEHUACAN', () => {
        render(<RegistroPage />);
        expect(screen.getByText('CONECTA')).toBeInTheDocument();
    });

    test('debe renderizar todos los campos del formulario', () => {
        render(<RegistroPage />);
        expect(screen.getByLabelText(/Nombre Completo/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Correo Electrónico/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/^Contraseña$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/Confirma Contraseña/i)).toBeInTheDocument();
    });

    test('debe renderizar las opciones de rol', () => {
        render(<RegistroPage />);
        expect(screen.getByText('Selecciona tu Rol')).toBeInTheDocument();
        expect(screen.getByLabelText('Aspirante')).toBeInTheDocument();
        expect(screen.getByLabelText('Reclutador')).toBeInTheDocument();
    });

    test('debe tener Aspirante seleccionado por defecto', () => {
        render(<RegistroPage />);
        const aspiranteRadio = screen.getByLabelText('Aspirante');
        expect(aspiranteRadio).toBeChecked();
    });

    test('debe renderizar el boton de Registrarse', () => {
        render(<RegistroPage />);
        expect(screen.getByRole('button', { name: /Registrarse/i })).toBeInTheDocument();
    });

    test('debe renderizar el enlace a Inicia Sesion', () => {
        render(<RegistroPage />);
        expect(screen.getByText('Inicia Sesión')).toBeInTheDocument();
    });

    test('debe permitir escribir en todos los campos', async () => {
        render(<RegistroPage />);

        const nombreInput = screen.getByLabelText(/Nombre Completo/i);
        const emailInput = screen.getByLabelText(/Correo Electrónico/i);
        const passwordInput = screen.getByLabelText(/^Contraseña$/i);
        const confirmInput = screen.getByLabelText(/Confirma Contraseña/i);

        await userEvent.type(nombreInput, 'Juan Perez');
        await userEvent.type(emailInput, 'juan@ejemplo.com');
        await userEvent.type(passwordInput, 'contrasena123');
        await userEvent.type(confirmInput, 'contrasena123');

        expect(nombreInput).toHaveValue('Juan Perez');
        expect(emailInput).toHaveValue('juan@ejemplo.com');
        expect(passwordInput).toHaveValue('contrasena123');
        expect(confirmInput).toHaveValue('contrasena123');
    });

    test('debe permitir cambiar el rol a Reclutador', async () => {
        render(<RegistroPage />);
        const reclutadorRadio = screen.getByLabelText('Reclutador');

        await userEvent.click(reclutadorRadio);
        expect(reclutadorRadio).toBeChecked();
    });

    test('debe establecer el foco en el campo de nombre al cargar', async () => {
        render(<RegistroPage />);
        const nombreInput = screen.getByLabelText(/Nombre Completo/i);
        await waitFor(() => {
            expect(nombreInput).toHaveFocus();
        });
    });

    test('debe mostrar texto de carga al enviar el formulario', async () => {
        render(<RegistroPage />);
        const nombreInput = screen.getByLabelText(/Nombre Completo/i);
        const emailInput = screen.getByLabelText(/Correo Electrónico/i);
        const passwordInput = screen.getByLabelText(/^Contraseña$/i);
        const confirmInput = screen.getByLabelText(/Confirma Contraseña/i);
        const submitButton = screen.getByRole('button', { name: /Registrarse/i });

        await userEvent.type(nombreInput, 'Juan Perez');
        await userEvent.type(emailInput, 'juan@ejemplo.com');
        await userEvent.type(passwordInput, 'contrasena123');
        await userEvent.type(confirmInput, 'contrasena123');
        await userEvent.click(submitButton);

        expect(screen.getByRole('button', { name: /Registrando/i })).toBeInTheDocument();
    });

    test('debe renderizar el header y el footer', () => {
        render(<RegistroPage />);
        expect(screen.getByTestId('header')).toBeInTheDocument();
        expect(screen.getByTestId('footer')).toBeInTheDocument();
    });

    test('debe navegar con Enter entre campos del formulario', async () => {
        render(<RegistroPage />);
        const nombreInput = screen.getByLabelText(/Nombre Completo/i);
        const emailInput = screen.getByLabelText(/Correo Electrónico/i);

        nombreInput.focus();
        fireEvent.keyDown(nombreInput, { key: 'Enter' });

        await waitFor(() => {
            expect(emailInput).toHaveFocus();
        });
    });

    test('debe navegar con flechas laterales entre opciones de rol', async () => {
        render(<RegistroPage />);
        const aspiranteRadio = screen.getByLabelText('Aspirante');
        const reclutadorRadio = screen.getByLabelText('Reclutador');

        aspiranteRadio.focus();
        fireEvent.keyDown(aspiranteRadio, { key: 'ArrowRight' });

        await waitFor(() => {
            expect(reclutadorRadio).toHaveFocus();
        });
    });
});
