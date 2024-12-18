import { InvoiceSettings } from '../types/appearance';
import { BRANDING } from './branding';

export const DEFAULT_INVOICE_SETTINGS: InvoiceSettings = {
  width: 70,
  fontSize: 10,
  showLogo: true,
  showHeader: true,
  showFooter: true,
  headerText: '',
  footerText: '¡Gracias por su compra!',
  additionalNotes: 'Este documento es un comprobante válido',
  logo: {
    url: '',
    width: 150,
    height: 80,
  },
  header: {
    title: BRANDING.name,
    subtitle: BRANDING.slogan,
    address: '',
    phone: '',
    email: '',
  },
};