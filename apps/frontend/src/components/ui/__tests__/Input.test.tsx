import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Input } from '../Input';

describe('Componente Input', () => {
    test('debe renderizar el label correctamente', () => {
        render(<Input label="Correo" id="correo" />);
        expect(screen.getByLabelText('Correo')).toBeInTheDocument();
    });

    test('debe renderizar como input sin tipo explicito por defecto', () => {
        render(<Input label="Nombre" id="nombre" />);
        const input = screen.getByLabelText('Nombre');
        expect(input.tagName).toBe('INPUT');
    });

    test('debe renderizar como input de tipo email', () => {
        render(<Input label="Email" id="email" type="email" />);
        const input = screen.getByLabelText('Email');
        expect(input).toHaveAttribute('type', 'email');
    });

    test('debe mostrar el mensaje de error', () => {
        render(<Input label="Campo" id="campo" error="Este campo es requerido" />);
        expect(screen.getByText('Este campo es requerido')).toBeInTheDocument();
    });

    test('debe pasar el ref correctamente', () => {
        const ref = React.createRef();
        render(<Input ref={ref} label="Test" id="test" />);
        expect(ref.current).toBeInstanceOf(HTMLInputElement);
    });

    test('debe estar deshabilitado cuando se pasa disabled', () => {
        render(<Input label="Deshabilitado" id="dis" disabled />);
        expect(screen.getByLabelText('Deshabilitado')).toBeDisabled();
    });
});
