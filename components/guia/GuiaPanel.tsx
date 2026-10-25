import type { ResultadoGuia } from "@/types/cotizacion";

import { GuiaCotizacion } from "./GuiaCotizacion";
import { GuiaFallo } from "./GuiaFallo";
import { GuiaRechazo } from "./GuiaRechazo";
import { GuiaVacia } from "./GuiaVacia";

interface GuiaPanelProps {
  resultado: ResultadoGuia;
}

export function GuiaPanel({ resultado }: GuiaPanelProps) {
  switch (resultado.tipo) {
    case "ok":
      return <GuiaCotizacion cotizacion={resultado.cotizacion} />;
    case "rechazo":
      return (
        <GuiaRechazo codigo={resultado.codigo} datos={resultado.datos} />
      );
    case "fallo":
      return <GuiaFallo mensaje={resultado.mensaje} />;
    default:
      return <GuiaVacia />;
  }
}
