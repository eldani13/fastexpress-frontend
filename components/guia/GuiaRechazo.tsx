import { RECHAZOS } from "@/lib/constants";
import type { CodigoRechazo, CotizacionRequest } from "@/types/cotizacion";

interface GuiaRechazoProps {
  codigo: CodigoRechazo;
  datos: CotizacionRequest;
}

export function GuiaRechazo({ codigo, datos }: GuiaRechazoProps) {
  const rechazo = RECHAZOS[codigo];

  return (
    <div
      className="guia guia-rechazada"
      aria-live="polite"
      data-testid="guia"
    >
      <div className="guia-cabecera">
        <strong>FastExpress</strong>
        <span>Guía de cotización</span>
      </div>
      <div className="guia-cuerpo">
        <div className="sello" data-testid="sello-rechazo">
          Rechazado
        </div>
        <p>
          <strong>{rechazo.detalle(datos)}</strong>
        </p>
        <p>{rechazo.accion}</p>
        <p className="codigo">Código {codigo}</p>
      </div>
    </div>
  );
}
