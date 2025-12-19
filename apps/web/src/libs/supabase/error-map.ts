import { AuthError, isAuthApiError } from "@supabase/supabase-js";
import {
  AUTH_ERROR_MESSAGES,
  AuthErrorCode,
  AuthErrorMap,
} from "./error-codes";

export function toSupabaseErrorMap(error: unknown): AuthErrorMap {
  if (!error) {
    return {
      title: "Error desconocido",
      description: "Ocurrió un error inesperado. Intenta de nuevo.",
    };
  }

  if (isAuthApiError(error)) {
    const anyError = error as unknown as { code: AuthErrorCode | string };
    const code = anyError.code as AuthErrorCode | string | undefined;

    if (code && code in AUTH_ERROR_MESSAGES) {
      const mapped = AUTH_ERROR_MESSAGES[code as AuthErrorCode];
      return { code, ...mapped };
    }

    return {
      code,
      title: "Error al autenticarte",
      description: error.message,
    };
  }

  if (error instanceof AuthError) {
    return {
      code: error.name,
      title: "Error de autenticación",
      description: error.message,
    };
  }

  return {
    title: "Error al autenticarse",
    description:
      (error as unknown as { message: string })?.message ??
      "Ocurrió un error inesperado. Intenta de nuevo.",
  };
}
