'use client';

import React, { useState } from 'react';

export default function DomainSuspendedPage() {
  const [copied, setCopied] = useState(false);

  const handleCopyPrompt = () => {
    navigator.clipboard.writeText('404: DEPLOYMENT_NOT_FOUND\narn1::7wdz7-1790100402140-0916573b0c98');
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleGoBack = () => {
    if (typeof window !== 'undefined') {
      if (window.history.length > 1) {
        window.history.back();
      } else {
        window.location.href = 'https://luxauto-test.vercel.app/';
      }
    }
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#000000',
        color: '#ffffff',
        fontFamily:
          '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '32px 20px',
        position: 'relative',
        userSelect: 'none',
        overflow: 'hidden',
      }}
    >
      {/* Invisible spacer for flex layout balance */}
      <div style={{ height: '20px' }} />

      {/* Main 404 Vercel replica block */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '520px',
          width: '100%',
        }}
      >
        <h1
          style={{
            fontSize: '28px',
            fontWeight: 600,
            letterSpacing: '-0.02em',
            marginBottom: '12px',
            color: '#f5f5f5',
          }}
        >
          This page doesn’t exist
        </h1>

        <p
          style={{
            fontSize: '14px',
            lineHeight: 1.6,
            color: '#888888',
            marginBottom: '26px',
            maxWidth: '340px',
          }}
        >
          It may have been moved, removed, or never existed.
        </p>

        <button
          onClick={handleGoBack}
          style={{
            backgroundColor: '#ffffff',
            color: '#000000',
            border: 'none',
            borderRadius: '6px',
            padding: '8px 20px',
            fontSize: '14px',
            fontWeight: 500,
            cursor: 'pointer',
            marginBottom: '40px',
            transition: 'background-color 0.15s ease',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.backgroundColor = '#e6e6e6')}
          onMouseLeave={(e) => (e.currentTarget.style.backgroundColor = '#ffffff')}
        >
          Go back
        </button>

        <div
          style={{
            fontFamily:
              'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace',
            fontSize: '12px',
            color: '#666666',
            lineHeight: 1.8,
            letterSpacing: '-0.01em',
          }}
        >
          <div>404: DEPLOYMENT_NOT_FOUND</div>
          <div style={{ wordBreak: 'break-all', opacity: 0.85 }}>
            arn1::7wdz7-1790100402140-0916573b0c98
          </div>
        </div>
      </div>

      {/* Bottom Vercel-style footer links */}
      <div
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '12px',
          fontSize: '11px',
          color: '#555555',
          letterSpacing: '0.05em',
          textTransform: 'uppercase',
          fontFamily:
            'ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace',
        }}
      >
        <span
          onClick={() => {
            if (typeof window !== 'undefined') {
              window.open('https://vercel.com/docs', '_blank');
            }
          }}
          style={{ cursor: 'pointer', transition: 'color 0.15s ease' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#888')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#555')}
        >
          VIEW DOCUMENTATION
        </span>
        <span>/</span>
        <span
          onClick={handleCopyPrompt}
          style={{ cursor: 'pointer', transition: 'color 0.15s ease' }}
          onMouseEnter={(e) => (e.currentTarget.style.color = '#888')}
          onMouseLeave={(e) => (e.currentTarget.style.color = '#555')}
        >
          {copied ? 'COPIED!' : 'COPY DEBUG PROMPT'}
        </span>
      </div>

      {/* Modern Developer Demo Card on the side / corner */}
      <aside
        style={{
          position: 'fixed',
          bottom: '24px',
          right: '24px',
          zIndex: 9999,
          maxWidth: '340px',
          width: 'calc(100% - 48px)',
          background: 'rgba(18, 18, 20, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.12)',
          borderRadius: '14px',
          padding: '16px 18px',
          boxShadow: '0 20px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(255, 255, 255, 0.03)',
          display: 'flex',
          flexDirection: 'column',
          gap: '12px',
          transition: 'all 0.25s ease',
          cursor: 'pointer',
        }}
        onClick={() => {
          if (typeof window !== 'undefined') {
            window.location.href = 'https://luxauto-test.vercel.app/';
          }
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.3)';
          e.currentTarget.style.transform = 'translateY(-3px)';
          e.currentTarget.style.boxShadow =
            '0 24px 50px rgba(0, 0, 0, 0.85), 0 0 35px rgba(255, 255, 255, 0.08)';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.12)';
          e.currentTarget.style.transform = 'translateY(0)';
          e.currentTarget.style.boxShadow =
            '0 20px 40px rgba(0, 0, 0, 0.7), 0 0 25px rgba(255, 255, 255, 0.03)';
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
            {/* Green glowing status dot */}
            <span
              style={{
                width: '8px',
                height: '8px',
                borderRadius: '50%',
                backgroundColor: '#10b981',
                boxShadow: '0 0 10px #10b981',
                display: 'inline-block',
              }}
            />
            <span
              style={{
                fontSize: '12px',
                fontWeight: 600,
                color: '#e2e8f0',
                textTransform: 'uppercase',
                letterSpacing: '0.05em',
              }}
            >
              Демо-версія сайту
            </span>
          </div>

          <span
            style={{
              fontSize: '11px',
              color: '#94a3b8',
              backgroundColor: 'rgba(255, 255, 255, 0.07)',
              padding: '3px 8px',
              borderRadius: '6px',
              fontWeight: 500,
            }}
          >
            Vynnytsky
          </span>
        </div>

        <p
          style={{
            margin: 0,
            fontSize: '13px',
            color: '#94a3b8',
            lineHeight: 1.45,
          }}
        >
          Сайт тимчасово призупинено на цьому домені. Робочу версію проекту можна переглянути за посиланням:
        </p>

        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            backgroundColor: '#ffffff',
            color: '#000000',
            borderRadius: '8px',
            padding: '9px 14px',
            fontSize: '13px',
            fontWeight: 600,
            transition: 'background-color 0.15s ease',
          }}
        >
          <span>Перейти на робочий сайт</span>
          <svg
            width="14"
            height="14"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M5 12h14M12 5l7 7-7 7" />
          </svg>
        </div>
      </aside>
    </div>
  );
}
