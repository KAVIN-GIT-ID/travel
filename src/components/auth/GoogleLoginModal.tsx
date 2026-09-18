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
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-xs transition-opacity animate-in fade-in duration-200">
      <div
        className="bg-white rounded-2xl shadow-xl max-w-md w-full overflow-hidden border border-gray-200 flex flex-col relative"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-700 w-8 h-8 rounded-full flex items-center justify-center hover:bg-gray-100 transition cursor-pointer z-10"
          title="Close"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Header */}
        <div className="pt-7 px-6 pb-2 text-center">
          <div className="flex justify-center mb-3">
            <BusLogo size="sm" layout="horizontal" />
          </div>

          <h3 className="text-xl font-bold text-gray-900 tracking-tight">
            {title}
          </h3>
          <p className="text-xs text-gray-500 mt-1 max-w-xs mx-auto leading-relaxed">
            {subtitle}
          </p>
        </div>

        {/* Modal Body */}
        <div className="p-6 pt-3 space-y-4">
          {errorMessage && (
            <div className="bg-rose-50 border border-rose-200 text-rose-700 text-xs p-3 rounded-lg flex items-center gap-2">
              <svg className="w-4 h-4 text-rose-500 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* Official Google Button Render Target */}
          {clientId.trim() ? (
            <div className="flex flex-col items-center justify-center py-1">
              <div ref={googleBtnRef} className="min-h-[44px] flex items-center justify-center w-full" />
            </div>
          ) : null}

          <div className="relative flex items-center justify-center my-2">
            <div className="border-t border-gray-200 w-full" />
            <span className="bg-white px-3 text-xs text-gray-400 font-medium relative">
              or continue with email
            </span>
          </div>

          {/* Direct Google OAuth Login Form */}
          <form onSubmit={handleManualEmailLogin} className="space-y-3">
            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Google Account Email
              </label>
              <input
                type="email"
                required
                placeholder="name@gmail.com"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            <div>
              <label className="block text-xs font-semibold text-gray-700 mb-1">
                Your Full Name <span className="text-gray-400 font-normal">(Optional)</span>
              </label>
              <input
                type="text"
                placeholder="e.g. Kavin Kumar"
                value={nameInput}
                onChange={(e) => setNameInput(e.target.value)}
                className="w-full px-3.5 py-2 rounded-lg border border-gray-300 text-sm focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-2.5 px-4 rounded-xl bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white font-semibold text-sm shadow-xs transition flex items-center justify-center gap-2 cursor-pointer disabled:opacity-60"
            >
              <span>{loading ? 'Signing In...' : 'Continue to Dashboard'}</span>
              <span>➔</span>
            </button>
          </form>

          <p className="text-[11px] text-gray-400 text-center leading-relaxed pt-1">
            Protected by Google Identity Services. By signing in, you agree to our Terms of Service &amp; Privacy Policy.
          </p>
        </div>
      </div>
    </div>
  );
};
