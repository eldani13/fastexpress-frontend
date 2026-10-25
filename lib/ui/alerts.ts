"use client";

import Swal from "sweetalert2";

const DRACULA_THEME = {
  background: "#282a36",
  color: "#f8f8f2",
  confirmButtonColor: "#bd93f9",
  cancelButtonColor: "#6272a4",
  denyButtonColor: "#ff5555",
  iconColor: "#bd93f9",
  input: "#343746",
  inputLabel: "#f8f8f2",
  inputPlaceholder: "#6272a4",
} as const;

export type AlertType = "success" | "error" | "warning" | "info" | "question";

export interface AlertOptions {
  title: string;
  text?: string;
  html?: string;
  showCancelButton?: boolean;
  showDenyButton?: boolean;
  confirmButtonText?: string;
  cancelButtonText?: string;
  denyButtonText?: string;
  allowOutsideClick?: boolean;
  allowEscapeKey?: boolean;
  timer?: number;
  timerProgressBar?: boolean;
}

function baseConfig(type: AlertType, options: AlertOptions): any {
  return {
    ...DRACULA_THEME,
    icon: type,
    title: options.title,
    text: options.text,
    html: options.html,
    showCancelButton: options.showCancelButton ?? false,
    showDenyButton: options.showDenyButton ?? false,
    confirmButtonText: options.confirmButtonText ?? "OK",
    cancelButtonText: options.cancelButtonText ?? "Cancelar",
    denyButtonText: options.denyButtonText ?? "No",
    allowOutsideClick: options.allowOutsideClick ?? true,
    allowEscapeKey: options.allowEscapeKey ?? true,
    timer: options.timer,
    timerProgressBar: options.timerProgressBar ?? false,
    input: undefined,
    customClass: {
      popup: "swal2-dracula-popup",
      title: "swal2-dracula-title",
      content: "swal2-dracula-content",
      confirmButton: "swal2-dracula-confirm",
      cancelButton: "swal2-dracula-cancel",
      denyButton: "swal2-dracula-deny",
      icon: "swal2-dracula-icon",
      input: "swal2-dracula-input",
    },
    buttonsStyling: false,
    didOpen: () => {
      const popup = Swal.getPopup();
      if (popup) {
        popup.style.borderRadius = "12px";
        popup.style.boxShadow = "0 25px 80px -40px #bd93f9, 0 0 0 1px rgba(189,147,249,0.2)";
      }
    },
  };
}

export const alerts = {
  success: (options: AlertOptions) => Swal.fire(baseConfig("success", options)),

  error: (options: AlertOptions) => Swal.fire(baseConfig("error", options)),

  warning: (options: AlertOptions) => Swal.fire(baseConfig("warning", options)),

  info: (options: AlertOptions) => Swal.fire(baseConfig("info", options)),

  question: (options: AlertOptions) => Swal.fire(baseConfig("question", options)),

  confirm: (options: AlertOptions) =>
    Swal.fire({
      ...baseConfig("question", options),
      showCancelButton: true,
      confirmButtonText: options.confirmButtonText ?? "Confirmar",
      cancelButtonText: options.cancelButtonText ?? "Cancelar",
    }),

  toast: (type: AlertType, message: string, timer = 3000) =>
    Swal.fire({
      ...DRACULA_THEME,
      icon: type,
      title: message,
      toast: true,
      position: "top-end",
      showConfirmButton: false,
      timer,
      timerProgressBar: true,
      input: undefined,
      customClass: {
        popup: "swal2-dracula-toast",
      },
      didOpen: (toast: HTMLElement) => {
        toast.addEventListener("mouseenter", Swal.stopTimer);
        toast.addEventListener("mouseleave", Swal.resumeTimer);
      },
    } as any),

  loading: (title = "Procesando...") =>
    Swal.fire({
      ...DRACULA_THEME,
      title,
      allowOutsideClick: false,
      allowEscapeKey: false,
      showConfirmButton: false,
      input: undefined,
      didOpen: () => {
        Swal.showLoading();
        const popup = Swal.getPopup();
        if (popup) {
          popup.style.borderRadius = "12px";
        }
      },
    } as any),

  close: () => Swal.close(),
};

export function useAlerts() {
  return alerts;
}

export default alerts;