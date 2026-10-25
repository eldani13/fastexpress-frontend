/** Contrato de la API FastExpress (cotización). */

export type TipoCliente = "NUEVO" | "FRECUENTE" | "VIP";
export type TipoEnvio = "ESTANDAR" | "EXPRESS";

export type CodigoRechazo = "LIMITE_PESO_EXCEDIDO" | "LIMITE_MONTO_EXCEDIDO";

export type CodigoErrorCampo = "PESO_INVALIDO" | "MONTO_INVALIDO";

export interface CotizacionRequest {
  peso: string;
  monto_declarado: string;
  tipo_cliente: TipoCliente;
  tipo_envio: TipoEnvio;
}

export interface CotizacionResponse {
  peso: string;
  monto_declarado: string;
  tipo_cliente: TipoCliente;
  tipo_envio: TipoEnvio;
  tarifa_base: string;
  tarifa_kg: string;
  cargo_peso: string;
  subtotal: string;
  porcentaje_descuento: string;
  descuento: string;
  porcentaje_recargo: string;
  recargo: string;
  seguro: string;
  total: string;
}

export interface ErrorApiBody {
  codigo?: string;
  mensaje?: string;
  detalle?: Record<string, unknown>;
}

export type ResultadoGuia =
  | { tipo: "vacia" }
  | { tipo: "ok"; cotizacion: CotizacionResponse }
  | { tipo: "rechazo"; codigo: CodigoRechazo; datos: CotizacionRequest }
  | { tipo: "fallo"; mensaje: string };
