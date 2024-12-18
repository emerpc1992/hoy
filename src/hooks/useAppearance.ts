import { useState, useEffect } from 'react';
import { AppearanceState, Colors, Images, Branding } from '../types/appearance';
import { DEFAULT_INVOICE_SETTINGS } from '../constants/invoiceSettings';
import {
  saveAppearanceSettings,
  getAppearanceSettings
} from '../services/firebase/collections/settings';

const initialState: AppearanceState = {
  colors: {
    primary: '#2563EB',
    secondary: '#E5E7EB',
    loginButton: '#2563EB',
  },
  images: {
    loginLogo: '',
    favicon: '',
    loginBackground: 'https://images.unsplash.com/photo-1562322140-8baeececf3df?ixlib=rb-1.2.1&auto=format&fit=crop&w=1920&q=80',
  },
  branding: {
    name: 'MASTER FACTU',
    slogan: 'TU NEGOCIO EN UN CLICK',
    browserTitle: 'MASTER FACTU - Sistema de Gestión',
  },
  invoiceSettings: {
    sales: { ...DEFAULT_INVOICE_SETTINGS },
    credits: { ...DEFAULT_INVOICE_SETTINGS },
  },
};

export function useAppearance() {
  const [state, setState] = useState<AppearanceState>(initialState);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const loadSettings = async () => {
      try {
        const settings = await getAppearanceSettings();
        if (settings) {
          setState(settings);
        }
        setLoading(false);
      } catch (err) {
        setError(err as Error);
        setLoading(false);
      }
    };

    loadSettings();
  }, []);

  useEffect(() => {
    if (!loading && !error) {
      document.title = state.branding.browserTitle;

      if (state.images.favicon) {
        const link = document.querySelector("link[rel*='icon']") || document.createElement('link');
        link.type = 'image/x-icon';
        link.rel = 'shortcut icon';
        link.href = state.images.favicon;
        document.getElementsByTagName('head')[0].appendChild(link);
      }

      saveAppearanceSettings(state).catch(console.error);
    }
  }, [state, loading, error]);

  const updateColors = (colors: Partial<Colors>) => {
    setState((prev) => ({
      ...prev,
      colors: { ...prev.colors, ...colors },
    }));
  };

  const updateImages = (images: Partial<Images>) => {
    setState((prev) => ({
      ...prev,
      images: { ...prev.images, ...images },
    }));
  };

  const updateBranding = (branding: Branding) => {
    setState((prev) => ({
      ...prev,
      branding,
    }));
  };

  const updateInvoiceSettings = (settings: AppearanceState['invoiceSettings']) => {
    setState((prev) => ({
      ...prev,
      invoiceSettings: settings,
    }));
  };

  return {
    ...state,
    loading,
    error,
    updateColors,
    updateImages,
    updateBranding,
    updateInvoiceSettings,
  };
}