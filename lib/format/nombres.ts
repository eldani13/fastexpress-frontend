import type { TipoCliente, TipoEnvio } from "@/types/cotizacion";

export const NOMBRES_CLIENTE: Record<TipoCliente, string> = {
  NUEVO: "Nuevo",
  FRECUENTE: "Frecuente",
  VIP: "VIP",
};

export const NOMBRES_ENVIO: Record<TipoEnvio, string> = {
  ESTANDAR: "Estándar",
  EXPRESS: "Express",
};

export const NOMBRES = {
  ...NOMBRES_CLIENTE,
  ...NOMBRES_ENVIO,
} as const;
