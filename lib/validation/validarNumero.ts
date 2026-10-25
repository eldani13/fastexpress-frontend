export interface ValidarNumeroOpciones {
  nombre: string;
  ejemplo: string;
  /** Solo activar en monto (DEF-006). El peso no lo usa. */
  detectarMiles?: boolean;
}

export interface ValidarNumeroResultado {
  valor: string | null;
  error: string | null;
}

/**
 * Validación de formato en cliente.
 * Acepta coma o punto decimal. Los límites de negocio los decide el backend.
 */
export function validarNumero(
  texto: string,
  { nombre, ejemplo, detectarMiles = false }: ValidarNumeroOpciones,
): ValidarNumeroResultado {
  if (
    detectarMiles &&
    /^\d{1,3}([.,]\d{3})+([.,]\d{1,2})?$/.test(texto.trim())
  ) {
    return {
      valor: null,
      error: "No uses separador de miles: escribe 1000, no 1,000 ni 1.000.",
    };
  }

  const limpio = texto.trim().replace(",", ".");
  if (limpio === "") {
    return { valor: null, error: `Ingresa ${nombre}.` };
  }
  if (!/^\d+(\.\d+)?$/.test(limpio)) {
    return {
      valor: null,
      error: `Escribe solo números, por ejemplo ${ejemplo}.`,
    };
  }
  if (!/^\d+(\.\d{1,2})?$/.test(limpio)) {
    return { valor: null, error: "Usa máximo 2 decimales." };
  }
  if (Number(limpio) <= 0) {
    return {
      valor: null,
      error: `${nombre[0].toUpperCase()}${nombre.slice(1)} debe ser mayor a 0.`,
    };
  }
  return { valor: limpio, error: null };
}
