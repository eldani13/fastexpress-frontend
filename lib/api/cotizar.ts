import type {
  CotizacionRequest,
  CotizacionResponse,
  ErrorApiBody,
} from "@/types/cotizacion";

function baseUrl(): string {
  return (process.env.NEXT_PUBLIC_API_URL ?? "http://127.0.0.1:8000").replace(
    /\/$/,
    "",
  );
}

export type CotizarResultado =
  | { ok: true; data: CotizacionResponse }
  | { ok: false; status: number; body: ErrorApiBody | null };

/**
 * POST /api/v1/cotizaciones
 * Si el cuerpo no es JSON (p. ej. 500 en texto plano), body queda null.
 */
export async function cotizar(
  datos: CotizacionRequest,
): Promise<CotizarResultado> {
  const respuesta = await fetch(`${baseUrl()}/api/v1/cotizaciones`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(datos),
  });

  const body = (await respuesta.json().catch(() => null)) as ErrorApiBody | CotizacionResponse | null;

  if (respuesta.ok && body) {
    return { ok: true, data: body as CotizacionResponse };
  }

  return {
    ok: false,
    status: respuesta.status,
    body: body as ErrorApiBody | null,
  };
}
