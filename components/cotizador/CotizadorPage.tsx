"use client";

import { CotizadorForm } from "@/components/cotizador/CotizadorForm";
import { GuiaPanel } from "@/components/guia";
import { MesaLayout } from "@/components/layout";
import { useCotizacion } from "@/hooks";

/** Orquesta formulario + guía. Un solo componente cliente de página. */
export function CotizadorPage() {
  const c = useCotizacion();

  return (
    <MesaLayout
      formulario={
        <CotizadorForm
          peso={c.peso}
          monto={c.monto}
          tipoCliente={c.tipoCliente}
          tipoEnvio={c.tipoEnvio}
          errorPeso={c.errores.peso}
          errorMonto={c.errores.monto}
          cargando={c.cargando}
          onPesoChange={c.setPeso}
          onMontoChange={c.setMonto}
          onTipoClienteChange={c.setTipoCliente}
          onTipoEnvioChange={c.setTipoEnvio}
          onClearErrorPeso={() => c.limpiarError("peso")}
          onClearErrorMonto={() => c.limpiarError("monto")}
          onSubmit={c.enviar}
        />
      }
      resultado={<GuiaPanel resultado={c.guia} />}
    />
  );
}
