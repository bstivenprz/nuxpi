import type { FormState, RegisterOptions } from "react-hook-form";

const whitespaceValidation = (value: string) =>
  /^(?!\s)/.test(value) || "Este campo no puede contener espacios al inicio.";

export function isFieldValid<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TFieldValues extends Record<string, any>,
  K extends keyof TFieldValues
>(formState: FormState<TFieldValues>, field: K) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  /** @ts-ignore */
  return formState.dirtyFields[field] && !formState.errors[field];
}

export function isFieldValidInput<
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  TFieldValues extends Record<string, any>,
  K extends keyof TFieldValues
>(formState: FormState<TFieldValues>, field: K) {
  return formState.errors[field] ? "invalid" : "valid";
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function isFormValid<TFieldValues extends Record<string, any>>(
  formState: FormState<TFieldValues>
) {
  return !formState.isDirty || !formState.isValid;
}

export const MIN_USERNAME_LENGTH = 3;
export const MAX_USERNAME_LENGTH = 30;

export const usernameValidation: RegisterOptions = {
  pattern: {
    value: new RegExp(
      `^[a-zA-Z0-9._]{${MIN_USERNAME_LENGTH},${MAX_USERNAME_LENGTH}}$`
    ),
    message: "Ingresa un nombre de usuario válido.",
  },
  minLength: {
    value: MIN_USERNAME_LENGTH,
    message: `El nombre de usuario debe tener al menos ${MIN_USERNAME_LENGTH} caracteres`,
  },
  maxLength: {
    value: MAX_USERNAME_LENGTH,
    message: `El nombre de usuario debe tener menos de ${MAX_USERNAME_LENGTH} caracteres`,
  },
};

export const emailValidation: RegisterOptions = {
  pattern: {
    value:
      /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/,
    message: "El correo electrónico no es válido.",
  },
};

export const nameValidation: RegisterOptions = {
  pattern: {
    value: /^[a-zA-ZáéíóúÁÉÍÓÚñÑüÜ\s'-]*$/,
    message: "Este campo no puede contener caracteres especiales.",
  },
};

export const numberValidation = {
  maxLength: {
    value: 10,
    message: "Este campo no puede contener más de 10 caracteres.",
  },
  minLength: {
    value: 10,
    message: "Este campo debe contener mínimo 10 caracteres.",
  },
  validate: {
    isValid: (value: string) =>
      /^\d+$/.test(value) || "Sólo puede ingresar números.",
    whitespace: whitespaceValidation,
  },
};

export const phoneValidation = {
  maxLength: {
    value: 10,
    message: "Este campo no puede contener más de 10 caracteres.",
  },
  minLength: {
    value: 10,
    message: "Este campo debe contener mínimo 10 caracteres.",
  },
  validate: {
    isValid: (value: string) =>
      /^\d+$/.test(value) || "Sólo puede ingresar números.",
    whitespace: whitespaceValidation,
  },
};

export const passwordValidation: RegisterOptions = {
  validate: {
    capital: (value: string) =>
      /^(?=.*?[A-Z])(?=.*?[a-z])/.test(value) ||
      "La contraseña debe contener letras minúsculas y mayúsculas.",
    number: (value: string) =>
      /^(?=.*?\d)/.test(value) ||
      "La contraseña debe contener al menos un número.",
    special: (value: string) =>
      /^(?=.*?[#?!@$%^&*-_])/.test(value) ||
      "La contraseña debe contener al menos un caracter especial.",
  },
  minLength: {
    value: 8,
    message: "La contraseña debe tener al menos 8 caracteres.",
  },
};
