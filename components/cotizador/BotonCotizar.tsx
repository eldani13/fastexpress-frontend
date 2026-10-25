"use client";

interface BotonCotizarProps {
  cargando: boolean;
}

export function BotonCotizar({ cargando }: BotonCotizarProps) {
  return (
    <button
      type="submit"
      className="boton"
      data-testid="boton-cotizar"
      disabled={cargando}
    >
      {cargando ? "Cotizando…" : "Cotizar envío"}
    </button>
  );
}
