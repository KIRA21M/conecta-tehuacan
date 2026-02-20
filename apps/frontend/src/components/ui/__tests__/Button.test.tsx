import React from 'react';
import { render, screen } from '@testing-library/react';
import '@testing-library/jest-dom';
import { Button } from '../Button';

describe('Componente Button', () => {
    test('debe renderizar el texto del boton', () => {
        render(<Button>Enviar</Button>);
        expect(screen.getByRole('button', { name: /Enviar/i })).toBeInTheDocument();
    });

    test('debe aplicar la variante primaria por defecto', () => {
        render(<Button>Primario</Button>);
        const button = screen.getByRole('button');
        expect(button.className).toContain('bg-primary');
    });

    test('debe aplicar la variante secundaria correctamente', () => {
        render(<Button variant="secondary">Secundario</Button>);
        const button = screen.getByRole('button');
        expect(button.className).toContain('bg-secondary');
    });

    test('debe aplicar ancho completo con fullWidth', () => {
        render(<Button fullWidth>Completo</Button>);
        const button = screen.getByRole('button');
        expect(button.className).toContain('w-full');
    });

    test('debe estar deshabilitado cuando se pasa disabled', () => {
        render(<Button disabled>Deshabilitado</Button>);
        expect(screen.getByRole('button')).toBeDisabled();
    });

    test('debe pasar el ref correctamente', () => {
        const ref = React.createRef();
        render(<Button ref={ref}>Con Ref</Button>);
        expect(ref.current).toBeInstanceOf(HTMLButtonElement);
    });
});
