import React, { useEffect, useRef, useState } from 'react';
import type { User } from '../../types';
import { authService } from '../../services/api';
import { BusLogo } from '../common/BusLogo';

interface GoogleLoginModalProps {
  isOpen: boolean;
  onClose: () => void;
  onLoginSuccess: (user: User) => void;
  title?: string;
  subtitle?: string;
}

declare global {
  interface Window {
    google?: {
      accounts: {
        id: {
          initialize: (config: any) => void;
          renderButton: (parent: HTMLElement, options: any) => void;
          prompt: (notification?: any) => void;
          cancel: () => void;
        };
      };
    };
  }
}

const DEFAULT_GOOGLE_CLIENT_ID = '1081442493959-lqi8vkld67qi5ghv3g53tuvej64s8m4a.apps.googleusercontent.com';

export const GoogleLoginModal: React.FC<GoogleLoginModalProps> = ({
  isOpen,
  onClose,
  onLoginSuccess,
  title = 'Sign In with Google',
  subtitle = 'Login or Sign Up with your Google Account to manage outstation bookings, track drivers, and access verified rates.',
}) => {
  const googleBtnRef = useRef<HTMLDivElement>(null);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [clientId] = useState<string>(() => {
    return (
      (import.meta.env.VITE_GOOGLE_CLIENT_ID as string) ||
      localStorage.getItem('saved_google_client_id') ||
      DEFAULT_GOOGLE_CLIENT_ID
    );
  });
  const [emailInput, setEmailInput] = useState('');
  const [nameInput, setNameInput] = useState('');

  // Handle Google Token from Google Identity Services
  const handleCredentialResponse = async (response: any) => {
    try {
      setLoading(true);
      setErrorMessage('');
      const credential = response.credential;

      const res = await authService.loginWithGoogle({
        credential,
      });

      if (res.success && res.user) {
        localStorage.setItem('travel_user', JSON.stringify(res.user));
        onLoginSuccess(res.user);
        onClose();
      } else {
        setErrorMessage('Failed to sign in. Please try again.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with authentication server.');
    } finally {
      setLoading(false);
    }
  };

  // Direct Google Email Login
  const handleManualEmailLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!emailInput.trim()) {
      setErrorMessage('Please enter a valid Google email address.');
      return;
    }

    try {
      setLoading(true);
      setErrorMessage('');
      const res = await authService.loginWithGoogle({
        email: emailInput.trim(),
        name: nameInput.trim() || emailInput.split('@')[0],
      });

      if (res.success && res.user) {
        localStorage.setItem('travel_user', JSON.stringify(res.user));
        onLoginSuccess(res.user);
        onClose();
      } else {
        setErrorMessage('Failed to authenticate.');
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Error communicating with authentication server.');
    } finally {
      setLoading(false);
    }
  };

  // Initialize Google Identity Services button with retry polling
  useEffect(() => {
    if (!isOpen) return;

    const renderGoogleButton = () => {
      if (window.google?.accounts?.id && clientId.trim() && googleBtnRef.current) {
        try {
          window.google.accounts.id.initialize({
            client_id: clientId.trim(),
            callback: handleCredentialResponse,
            auto_select: false,
          });

          googleBtnRef.current.innerHTML = '';
          window.google.accounts.id.renderButton(googleBtnRef.current, {
            theme: 'outline',
            size: 'large',
            width: 280,
            text: 'continue_with',
            shape: 'pill',
            logo_alignment: 'left',
          });
          return true;
        } catch (err) {
          console.warn('Google Identity button initialization:', err);
        }
      }
      return false;
    };

    if (!renderGoogleButton()) {
      const timer = setInterval(() => {
        if (renderGoogleButton()) {
          clearInterval(timer);
        }
      }, 250);
      return () => clearInterval(timer);
    }
  }, [isOpen, clientId]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-2xl max-w-md w-full overflow-hidden border border-gray-100 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 hover:bg-gray-200 transition cursor-pointer z-10"
          title="Close"
        >
          ✕
        </button>

        {/* Modal Header */}
        <div className="bg-[#051329] text-white p-6 pb-7 text-center relative overflow-hidden">
          <div className="flex justify-center mb-3">
            <BusLogo size="sm" variant="light" layout="stacked" />
          </div>

          <h3 className="text-xl font-black text-white tracking-tight">{title}</h3>
          <p className="text-xs text-slate-300 mt-1 max-w-xs mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-5">
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-lg flex items-center gap-2">
              <span>⚠️</span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Official Google Button Render Target */}
          {clientId.trim() ? (
            <div className="flex flex-col items-center justify-center py-2 space-y-3">
              <div ref={googleBtnRef} className="min-h-[44px] flex items-center justify-center" />
              <p className="text-[11px] text-gray-400 text-center">
                Uses official Google Identity Services OAuth 2.0
              </p>
            </div>
          ) : null}

          {/* Direct Google OAuth Login Form */}
          <form onSubmit={handleManualEmailLogin} className="space-y-3 pt-1">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                Google Account Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  required
                  placeholder="yourname@gmail.com"
                  value={emailInput}
                  onChange={(e) => setEmailInput(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1 uppercase tracking-wider">
                Your Name <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Kavin Kumar"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3.5 py-2.5 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-4 rounded-xl bg-white border border-gray-300 hover:bg-gray-50 active:bg-gray-100 text-gray-800 font-bold text-sm shadow-xs transition flex items-center justify-center gap-3 cursor-pointer disabled:opacity-60"
            >
              {/* Google G Logo */}
              <svg className="w-5 h-5" viewBox="0 0 24 24">
                <path
                  fill="#4285F4"
                  d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                />
                <path
                  fill="#34A853"
                  d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                />
                <path
                  fill="#FBBC05"
                  d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
                />
                <path
                  fill="#EA4335"
                  d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
                />
              </svg>
              <span>{loading ? 'Authenticating...' : 'Continue with Google'}</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};
