'use client';

import React, { useState, useEffect } from 'react';

interface Message {
  id: string;
  senderName: string;
  senderEmail: string;
  subject: string;
  preview: string;
  timestamp: string;
  isRead: boolean;
}

interface Conversation {
  id: string;
  messages: Message[];
  participantName: string;
  participantEmail: string;
  lastMessageTime: string;
}

export default function Mensajes() {
  const [conversaciones, setConversaciones] = useState<Conversation[]>([]);
  const [selectedConversation, setSelectedConversation] = useState<Conversation | null>(null);
  const [messageText, setMessageText] = useState('');
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // TODO: Integrar con API para traer las conversaciones
    // Por ahora, mostramos datos de ejemplo
    setConversaciones([
      {
        id: '1',
        participantName: 'Juan García',
        participantEmail: 'juan@example.com',
        messages: [
          {
            id: '1',
            senderName: 'Juan García',
            senderEmail: 'juan@example.com',
            subject: '¿Cuándo será la entrevista?',
            preview: 'Hola, he visto la vacante y me interesa mucho. ¿Cuándo podríamos agendar la entrevista?',
            timestamp: '2024-01-20 14:30',
            isRead: false,
          },
          {
            id: '2',
            senderName: 'Tú',
            senderEmail: 'recruiter@company.com',
            subject: 'Re: ¿Cuándo será la entrevista?',
            preview: 'Hola Juan, gracias por tu interés. Podemos agendar la entrevista para el próximo jueves a las 10 AM.',
            timestamp: '2024-01-20 15:00',
            isRead: true,
          },
        ],
        lastMessageTime: '2024-01-20 15:00',
      },
      {
        id: '2',
        participantName: 'María López',
        participantEmail: 'maria@example.com',
        messages: [
          {
            id: '3',
            senderName: 'María López',
            senderEmail: 'maria@example.com',
            subject: 'Pregunta sobre beneficios',
            preview: '¿Puedo conocer más sobre los beneficios del puesto?',
            timestamp: '2024-01-19 10:15',
            isRead: true,
          },
        ],
        lastMessageTime: '2024-01-19 10:15',
      },
    ]);
    setIsLoading(false);
  }, []);

  const handleSendMessage = () => {
    if (!messageText.trim() || !selectedConversation) return;

    // TODO: Enviar mensaje a través de la API
    alert('Funcionalidad de envío de mensajes será integrada pronto');
    setMessageText('');
  };

  if (isLoading) {
    return <div>Cargando mensajes...</div>;
  }

  return (
    <section style={{ display: 'flex', gap: '1.5rem', minHeight: 'calc(100vh - 200px)' }}>
      {/* Lista de conversaciones */}
      <div style={{ flex: '0 0 350px', borderRight: '1px solid #e5e7eb' }}>
        <h2 style={{ fontSize: '1.125rem', fontWeight: 'bold', marginBottom: '1rem' }}>
          Conversaciones
        </h2>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
          {conversaciones.map((conv) => (
            <button
              key={conv.id}
              onClick={() => setSelectedConversation(conv)}
              style={{
                padding: '1rem',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                backgroundColor:
                  selectedConversation?.id === conv.id ? '#eff6ff' : '#ffffff',
                cursor: 'pointer',
                textAlign: 'left',
                transition: 'all 0.2s',
              }}
            >
              <p style={{ fontWeight: 'bold', margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>
                {conv.participantName}
              </p>
              <p style={{ color: '#6b7280', margin: '0 0 0.5rem 0', fontSize: '0.875rem' }}>
                {conv.participantEmail}
              </p>
              <p style={{ color: '#9ca3af', margin: '0', fontSize: '0.8rem' }}>
                {conv.lastMessageTime}
              </p>
            </button>
          ))}
        </div>
      </div>

      {/* Panel de conversación */}
      <div style={{ flex: 1 }}>
        {selectedConversation ? (
          <>
            <h2 style={{ fontSize: '1.25rem', fontWeight: 'bold', marginBottom: '1.5rem' }}>
              {selectedConversation.participantName}
            </h2>

            {/* Historial de mensajes */}
            <div
              style={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '0.375rem',
                padding: '1.5rem',
                minHeight: '300px',
                maxHeight: '500px',
                overflowY: 'auto',
                marginBottom: '1.5rem',
              }}
            >
              {selectedConversation.messages.map((msg) => (
                <div
                  key={msg.id}
                  style={{
                    marginBottom: '1rem',
                    padding: '1rem',
                    backgroundColor: msg.senderEmail === 'recruiter@company.com' ? '#dbeafe' : '#ffffff',
                    borderRadius: '0.375rem',
                    borderLeft: `4px solid ${
                      msg.senderEmail === 'recruiter@company.com' ? '#2563eb' : '#e5e7eb'
                    }`,
                  }}
                >
                  <p style={{ fontWeight: 'bold', margin: '0 0 0.25rem 0', fontSize: '0.95rem' }}>
                    {msg.senderName}
                  </p>
                  <p style={{ color: '#6b7280', margin: '0 0 0.75rem 0', fontSize: '0.875rem' }}>
                    {msg.timestamp}
                  </p>
                  <p style={{ margin: 0 }}>{msg.preview}</p>
                </div>
              ))}
            </div>

            {/* Formulario de respuesta */}
            <div>
              <textarea
                value={messageText}
                onChange={(e) => setMessageText(e.target.value)}
                placeholder="Escribe tu respuesta..."
                style={{
                  width: '100%',
                  padding: '0.75rem',
                  border: '1px solid #d1d5db',
                  borderRadius: '0.375rem',
                  fontSize: '1rem',
                  fontFamily: 'inherit',
                  minHeight: '100px',
                  marginBottom: '1rem',
                  resize: 'vertical',
                }}
              />
              <button
                onClick={handleSendMessage}
                disabled={!messageText.trim()}
                style={{
                  backgroundColor: messageText.trim() ? '#2563eb' : '#d1d5db',
                  color: '#ffffff',
                  padding: '0.75rem 1.5rem',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: messageText.trim() ? 'pointer' : 'not-allowed',
                  fontSize: '1rem',
                }}
              >
                Enviar mensaje
              </button>
            </div>
          </>
        ) : (
          <div
            style={{
              display: 'flex',
              justifyContent: 'center',
              alignItems: 'center',
              minHeight: '400px',
              color: '#6b7280',
            }}
          >
            <p>Selecciona una conversación para empezar</p>
          </div>
        )}
      </div>
    </section>
  );
}
