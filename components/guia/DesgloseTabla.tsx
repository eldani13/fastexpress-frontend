import { dinero, NOMBRES, porcentaje } from "@/lib/format";
import type { CotizacionResponse } from "@/types/cotizacion";

interface FilaDesglose {
  titulo: string;
  detalle: string;
  valor: string;
  clase?: string;
  extra?: string;
}

interface DesgloseTablaProps {
  cotizacion: CotizacionResponse;
}

function construirFilas(c: CotizacionResponse): FilaDesglose[] {
  const filas: FilaDesglose[] = [
    { titulo: "Tarifa base", detalle: "", valor: dinero(c.tarifa_base) },
    {
      titulo: "Peso",
      detalle: `${c.peso} kg × ${dinero(c.tarifa_kg)} por kg`,
      valor: dinero(c.cargo_peso),
    },
    {
      titulo: "Subtotal",
      detalle: "",
      valor: dinero(c.subtotal),
      extra: "fila-subtotal",
    },
  ];

  if (Number(c.descuento) > 0) {
    filas.push({
      titulo: `Descuento ${NOMBRES[c.tipo_cliente]}`,
      detalle: porcentaje(c.porcentaje_descuento),
      valor: `?${dinero(c.descuento)}`,
      clase: "negativo",
    });
  }

  if (Number(c.recargo) > 0) {
    filas.push({
      titulo: "Recargo Express",
      detalle: `${porcentaje(c.porcentaje_recargo)} sobre el subtotal con descuento`,
      valor: `+${dinero(c.recargo)}`,
    });
  }

  if (Number(c.seguro) > 0) {
    filas.push({
      titulo: "Seguro",
      detalle: `2 % de ${dinero(c.monto_declarado)} declarados`,
      valor: `+${dinero(c.seguro)}`,
    });
  }

  return filas;
}

export function DesgloseTabla({ cotizacion }: DesgloseTablaProps) {
  const filas = construirFilas(cotizacion);

  return (
    <table className="desglose" data-testid="desglose">
      <tbody>
        {filas.map((fila) => (
          <tr key={fila.titulo} className={fila.extra}>
            <th scope="row">
              {fila.titulo}
              {fila.detalle ? <small>{fila.detalle}</small> : null}
            </th>
            <td className={fila.clase}>{fila.valor}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
}
