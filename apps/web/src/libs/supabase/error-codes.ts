export const AUTH_ERROR_MESSAGES = {
  email_exists: {
    title: "Este correo ya está registrado",
    description:
      "Intenta iniciar sesión o usa la opción “Olvidé mi contraseña”.",
  },
  email_not_confirmed: {
    title: "Confirma tu correo",
    description:
      "Te enviamos un enlace de confirmación. Revisa tu bandeja de entrada o correo no deseado.",
  },
  invalid_credentials: {
    title: "Credenciales incorrectas",
    description: "Revisa tu correo y contraseña e inténtalo de nuevo.",
  },
  over_request_rate_limit: {
    title: "Demasiadas peticiones",
    description:
      "Has hecho demasiados intentos en poco tiempo. Espera unos minutos e inténtalo de nuevo.",
  },
  over_email_send_rate_limit: {
    title: "Demasiados correos enviados",
    description:
      "Espera unos minutos antes de volver a solicitar un correo de autenticación.",
  },
  otp_expired: {
    title: "Código expirado",
    description: "El código de verificación expiró. Solicita uno nuevo.",
  },
  phone_exists: {
    title: "Teléfono ya registrado",
    description: "Ese número ya está asociado a otra cuenta.",
  },
  phone_not_confirmed: {
    title: "Confirma tu teléfono",
    description: "Debes confirmar tu número antes de iniciar sesión.",
  },
  provider_disabled: {
    title: "Proveedor deshabilitado",
    description:
      "Este método de autenticación no está disponible. Prueba con otro método.",
  },
  user_already_exists: {
    title: "Este correo ya está registrado",
    description:
      "Intenta iniciar sesión o usa la opción “Olvidé mi contraseña”.",
  },
} as const;

export type AuthErrorCode = keyof typeof AUTH_ERROR_MESSAGES;

export type AuthErrorMap = {
  code?: AuthErrorCode | string;
  title: string;
  description: string;
};
