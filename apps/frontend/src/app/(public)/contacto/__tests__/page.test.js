import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Contacto from '../page';

describe('Página de Contacto - Funcionalidad Completa', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test('debe renderizar el formulario de contacto', () => {
    render(<Contacto />);

    expect(screen.getByText('Contáctanos')).toBeInTheDocument();
    expect(screen.getByLabelText(/nombre completo/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/correo electrónico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/mensaje/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /enviar mensaje/i })).toBeInTheDocument();
  });

  test('debe mostrar el skip link y permitir saltar al contenido', async () => {
    render(<Contacto />);

    const skipLink = screen.getByText('Saltar al contenido principal');
    expect(skipLink).toBeInTheDocument();

    // El skip link debería estar oculto inicialmente (sr-only)
    expect(skipLink).toHaveClass('sr-only');

    // Al hacer focus, debería ser visible
    skipLink.focus();
    await waitFor(() => {
      expect(skipLink).not.toHaveClass('sr-only');
    });
  });

  test('debe validar campos requeridos', async () => {
    render(<Contacto />);

    const submitButton = screen.getByRole('button', { name: /enviar mensaje/i });
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
      expect(screen.getByText('El email es requerido')).toBeInTheDocument();
      expect(screen.getByText('El mensaje es requerido')).toBeInTheDocument();
    });
  });

  test('debe validar formato de email', async () => {
    render(<Contacto />);

    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const submitButton = screen.getByRole('button', { name: /enviar mensaje/i });

    await userEvent.type(emailInput, 'invalid-email');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El email no es válido')).toBeInTheDocument();
    });
  });

  test('debe validar longitud mínima del mensaje', async () => {
    render(<Contacto />);

    const messageInput = screen.getByLabelText(/mensaje/i);
    const submitButton = screen.getByRole('button', { name: /enviar mensaje/i });

    await userEvent.type(messageInput, 'Hola');
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El mensaje debe tener al menos 10 caracteres')).toBeInTheDocument();
    });
  });

  test('debe enviar el formulario correctamente', async () => {
    render(<Contacto />);

    const nameInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const messageInput = screen.getByLabelText(/mensaje/i);
    const submitButton = screen.getByRole('button', { name: /enviar mensaje/i });

    await userEvent.type(nameInput, 'Juan Pérez');
    await userEvent.type(emailInput, 'juan@example.com');
    await userEvent.type(messageInput, 'Este es un mensaje de prueba con más de 10 caracteres');

    await userEvent.click(submitButton);

    // Debería mostrar estado de carga
    expect(screen.getByText('Enviando...')).toBeInTheDocument();

    // Después de la simulación, debería mostrar mensaje de éxito
    await waitFor(() => {
      expect(screen.getByText('¡Mensaje enviado!')).toBeInTheDocument();
    }, { timeout: 3000 });
  });

  test('debe manejar envío con Enter', async () => {
    render(<Contacto />);

    const nameInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const messageInput = screen.getByLabelText(/mensaje/i);

    await userEvent.type(nameInput, 'Juan Pérez');
    await userEvent.type(emailInput, 'juan@example.com');
    await userEvent.type(messageInput, 'Mensaje válido con suficiente longitud');

    // Presionar Enter en el último campo
    fireEvent.keyDown(messageInput, { key: 'Enter' });

    // Debería mostrar estado de carga
    await waitFor(() => {
      expect(screen.getByText('Enviando...')).toBeInTheDocument();
    });
  });

  test('debe limpiar errores al escribir', async () => {
    render(<Contacto />);

    const nameInput = screen.getByLabelText(/nombre completo/i);
    const submitButton = screen.getByRole('button', { name: /enviar mensaje/i });

    // Enviar formulario vacío para generar errores
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
    });

    // Escribir en el campo
    await userEvent.type(nameInput, 'Juan');

    // El error debería desaparecer
    await waitFor(() => {
      expect(screen.queryByText('El nombre es requerido')).not.toBeInTheDocument();
    });
  });

  test('debe manejar Escape para limpiar errores', async () => {
    render(<Contacto />);

    const submitButton = screen.getByRole('button', { name: /enviar mensaje/i });

    // Generar errores
    await userEvent.click(submitButton);

    await waitFor(() => {
      expect(screen.getByText('El nombre es requerido')).toBeInTheDocument();
    });

    // Presionar Escape
    fireEvent.keyDown(document, { key: 'Escape' });

    // Los errores deberían desaparecer
    await waitFor(() => {
      expect(screen.queryByText('El nombre es requerido')).not.toBeInTheDocument();
    });
  });

  test('debe tener navegación por teclado con Tab', async () => {
    render(<Contacto />);

    const nameInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const messageInput = screen.getByLabelText(/mensaje/i);
    const submitButton = screen.getByRole('button', { name: /enviar mensaje/i });

    // Focus inicial debería estar en el primer campo
    await waitFor(() => {
      expect(nameInput).toHaveFocus();
    });

    // Tab al siguiente campo
    await userEvent.tab();
    expect(emailInput).toHaveFocus();

    // Tab al siguiente
    await userEvent.tab();
    expect(messageInput).toHaveFocus();

    // Tab al botón
    await userEvent.tab();
    expect(submitButton).toHaveFocus();
  });

  test('debe implementar focus trap en el formulario', async () => {
    render(<Contacto />);

    const submitButton = screen.getByRole('button', { name: /enviar mensaje/i });
    const clearButton = screen.getByRole('button', { name: /limpiar formulario/i });

    // Focus en el último elemento
    submitButton.focus();
    expect(submitButton).toHaveFocus();

    // Tab debería ir al siguiente elemento (focus trap)
    await userEvent.tab();
    expect(clearButton).toHaveFocus();

    // Tab desde el último debería volver al primero
    await userEvent.tab();
    const nameInput = screen.getByLabelText(/nombre completo/i);
    expect(nameInput).toHaveFocus();
  });

  test('debe mostrar mensaje de éxito con foco correcto', async () => {
    render(<Contacto />);

    const nameInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const messageInput = screen.getByLabelText(/mensaje/i);
    const submitButton = screen.getByRole('button', { name: /enviar mensaje/i });

    await userEvent.type(nameInput, 'Juan Pérez');
    await userEvent.type(emailInput, 'juan@example.com');
    await userEvent.type(messageInput, 'Mensaje válido con suficiente longitud para la validación');

    await userEvent.click(submitButton);

    await waitFor(() => {
      const successMessage = screen.getByText('¡Mensaje enviado!');
      expect(successMessage).toBeInTheDocument();
      expect(successMessage).toHaveFocus();
    });
  });

  test('debe tener atributos de accesibilidad correctos', () => {
    render(<Contacto />);

    const nameInput = screen.getByLabelText(/nombre completo/i);
    const emailInput = screen.getByLabelText(/correo electrónico/i);
    const messageInput = screen.getByLabelText(/mensaje/i);

    expect(nameInput).toHaveAttribute('aria-describedby');
    expect(emailInput).toHaveAttribute('aria-describedby');
    expect(messageInput).toHaveAttribute('aria-describedby');

    // Campos requeridos
    expect(nameInput).toHaveAttribute('required');
    expect(emailInput).toHaveAttribute('required');
    expect(messageInput).toHaveAttribute('required');
  });

  test('debe mostrar información de contacto alternativa', () => {
    render(<Contacto />);

    expect(screen.getByText('¿Prefieres contactarnos de otra forma?')).toBeInTheDocument();
    expect(screen.getByText('+52 55 1234 5678')).toBeInTheDocument();
    expect(screen.getByText('contacto@conectatehuacan.com')).toBeInTheDocument();
  });
});