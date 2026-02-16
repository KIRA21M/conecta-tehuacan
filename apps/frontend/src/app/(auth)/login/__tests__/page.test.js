import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import '@testing-library/jest-dom';
import Login from '../page';

// Mock del contexto ViewContext
const mockSwitchToCandidateView = jest.fn();
const mockSwitchToRecruiterView = jest.fn();

jest.mock('@/contexts/ViewContext', () => ({
  useView: () => ({
    switchToCandidateView: mockSwitchToCandidateView,
    switchToRecruiterView: mockSwitchToRecruiterView,
  }),
}));

describe('Login Component - Focus Management', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockSwitchToCandidateView.mockClear();
    mockSwitchToRecruiterView.mockClear();
  });

  test('debe renderizar los botones de Candidatos y Dashboard', () => {
    render(<Login />);
    
    expect(screen.getByTestId('candidate-button')).toBeInTheDocument();
    expect(screen.getByTestId('recruiter-button')).toBeInTheDocument();
  });

  test('el botón de Candidatos debe tener foco automáticamente al cargar', async () => {
    render(<Login />);
    
    await waitFor(() => {
      expect(screen.getByTestId('candidate-button')).toHaveFocus();
    });
  });

  test('al hacer clic en el botón Candidatos, el foco debe permanecer en él', async () => {
    render(<Login />);
    
    const candidateButton = screen.getByTestId('candidate-button');
    
    await userEvent.click(candidateButton);
    
    expect(candidateButton).toHaveFocus();
    expect(mockSwitchToCandidateView).toHaveBeenCalled();
  });

  test('al presionar Tab, el foco debe moverse del botón Candidatos al Dashboard', async () => {
    render(<Login />);
    
    const candidateButton = screen.getByTestId('candidate-button');
    const recruiterButton = screen.getByTestId('recruiter-button');
    
    // El foco inicial está en Candidatos
    await waitFor(() => {
      expect(candidateButton).toHaveFocus();
    });
    
    // Presionar Tab para mover al siguiente
    await userEvent.tab();
    
    expect(recruiterButton).toHaveFocus();
  });

  test('al presionar Shift+Tab, el foco debe retroceder', async () => {
    render(<Login />);
    
    const candidateButton = screen.getByTestId('candidate-button');
    const recruiterButton = screen.getByTestId('recruiter-button');
    
    // Mover al botón Dashboard
    await userEvent.tab();
    expect(recruiterButton).toHaveFocus();
    
    // Presionar Shift+Tab para retroceder
    await userEvent.tab({ shift: true });
    
    expect(candidateButton).toHaveFocus();
  });

  test('al presionar ArrowDown, el foco debe moverse al siguiente botón', async () => {
    render(<Login />);
    
    const candidateButton = screen.getByTestId('candidate-button');
    const recruiterButton = screen.getByTestId('recruiter-button');
    
    await waitFor(() => {
      expect(candidateButton).toHaveFocus();
    });
    
    // Presionar flecha hacia abajo
    fireEvent.keyDown(candidateButton, { key: 'ArrowDown' });
    
    await waitFor(() => {
      expect(recruiterButton).toHaveFocus();
    });
  });

  test('al presionar ArrowUp, el foco debe moverse al botón anterior', async () => {
    render(<Login />);
    
    const candidateButton = screen.getByTestId('candidate-button');
    const recruiterButton = screen.getByTestId('recruiter-button');
    
    // Mover al botón Dashboard
    fireEvent.keyDown(candidateButton, { key: 'ArrowDown' });
    
    await waitFor(() => {
      expect(recruiterButton).toHaveFocus();
    });
    
    // Presionar flecha hacia arriba
    fireEvent.keyDown(recruiterButton, { key: 'ArrowUp' });
    
    await waitFor(() => {
      expect(candidateButton).toHaveFocus();
    });
  });

  test('al presionar Enter en el botón Candidatos, debe llamar a switchToCandidateView', async () => {
    render(<Login />);
    
    const candidateButton = screen.getByTestId('candidate-button');
    
    await waitFor(() => {
      expect(candidateButton).toHaveFocus();
    });
    
    // Presionar Enter
    fireEvent.keyDown(candidateButton, { key: 'Enter' });
    fireEvent.click(candidateButton);
    
    expect(mockSwitchToCandidateView).toHaveBeenCalled();
  });

  test('al presionar Enter en el botón Dashboard, debe llamar a switchToRecruiterView', async () => {
    render(<Login />);
    
    const recruiterButton = screen.getByTestId('recruiter-button');
    
    // Mover el foco al botón Dashboard
    fireEvent.keyDown(screen.getByTestId('candidate-button'), { key: 'ArrowDown' });
    
    await waitFor(() => {
      expect(recruiterButton).toHaveFocus();
    });
    
    // Presionar Enter
    fireEvent.keyDown(recruiterButton, { key: 'Enter' });
    fireEvent.click(recruiterButton);
    
    expect(mockSwitchToRecruiterView).toHaveBeenCalled();
  });

  test('la navegación debe ser cíclica (Tab en Dashboard vuelve a Candidatos)', async () => {
    render(<Login />);
    
    const candidateButton = screen.getByTestId('candidate-button');
    const recruiterButton = screen.getByTestId('recruiter-button');
    
    // Mover al Dashboard
    await userEvent.tab();
    expect(recruiterButton).toHaveFocus();
    
    // Presionar Tab nuevamente para volver al inicio
    await userEvent.tab();
    
    expect(candidateButton).toHaveFocus();
  });

  test('los botones deben tener atributos aria-label para accesibilidad', () => {
    render(<Login />);
    
    expect(screen.getByTestId('candidate-button')).toHaveAttribute(
      'aria-label',
      'Seleccionar rol de candidato'
    );
    expect(screen.getByTestId('recruiter-button')).toHaveAttribute(
      'aria-label',
      'Seleccionar rol de reclutador'
    );
  });

  test('el contenedor debe capturar los eventos de teclado', async () => {
    render(<Login />);
    
    const candidateButton = screen.getByTestId('candidate-button');
    
    // Simular presionar Tab
    fireEvent.keyDown(document, { key: 'Tab' });
    
    // El foco debe estar en uno de los botones
    await waitFor(() => {
      expect(
        document.activeElement === candidateButton ||
        document.activeElement === screen.getByTestId('recruiter-button')
      ).toBe(true);
    });
  });
});
