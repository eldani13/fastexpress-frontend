import { dinero, NOMBRES } from "@/lib/format";
import type { CotizacionResponse } from "@/types/cotizacion";

import { DesgloseTabla } from "./DesgloseTabla";

interface GuiaCotizacionProps {
  cotizacion: CotizacionResponse;
}

export function GuiaCotizacion({ cotizacion: c }: GuiaCotizacionProps) {
  const express = c.tipo_envio === "EXPRESS";

  return (
    <div className="guia" aria-live="polite" data-testid="guia">
      {express ? (
        <div className="cinta" data-testid="cinta-express">
          Express
        </div>
      ) : null}

      <div className="guia-cabecera">
        <strong>FastExpress</strong>
        <span>Guía de cotización</span>
      </div>

      <dl className="guia-datos">
        <div>
          <dt>Peso</dt>
          <dd>{c.peso} kg</dd>
        </div>
        <div>
          <dt>Valor declarado</dt>
          <dd>{dinero(c.monto_declarado)}</dd>
        </div>
        <div>
          <dt>Cliente</dt>
          <dd>{NOMBRES[c.tipo_cliente]}</dd>
        </div>
        <div>
          <dt>Envío</dt>
          <dd>{NOMBRES[c.tipo_envio]}</dd>
        </div>
      </dl>

      <DesgloseTabla cotizacion={c} />

      <div className="guia-total">
        <span>Total a pagar</span>
        <output data-testid="total">{dinero(c.total)}</output>
      </div>
    </div>
  );
}
