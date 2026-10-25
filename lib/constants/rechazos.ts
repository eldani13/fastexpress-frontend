import { dinero } from "@/lib/format/dinero";
import type { CodigoRechazo, CotizacionRequest } from "@/types/cotizacion";

export interface TextoRechazo {
  detalle: (datos: CotizacionRequest) => string;
  accion: string;
}

export const RECHAZOS: Record<CodigoRechazo, TextoRechazo> = {
  LIMITE_PESO_EXCEDIDO: {
    detalle: (d) =>
      `El paquete pesa ${d.peso} kg y el máximo por envío es 20 kg.`,
    accion: "Divide el contenido en paquetes de hasta 20 kg y cotiza cada uno.",
  },
  LIMITE_MONTO_EXCEDIDO: {
    detalle: (d) =>
      `El valor declarado es ${dinero(d.monto_declarado)} y el máximo asegurable es $1,000.`,
    accion:
      "Declara un valor de hasta $1,000 o envía el contenido en varios paquetes.",
  },
};

export function esCodigoRechazo(codigo: string): codigo is CodigoRechazo {
  return codigo in RECHAZOS;
}

export const RECHAZO_MENSAJES: Record<CodigoRechazo, string> = {
  LIMITE_PESO_EXCEDIDO: "El peso del paquete excede el límite permitido (máx. 20 kg).",
  LIMITE_MONTO_EXCEDIDO: "El valor declarado excede el límite máximo asegurable ($1,000).",
};
