interface GuiaFalloProps {
  mensaje: string;
}

export function GuiaFallo({ mensaje }: GuiaFalloProps) {
  return (
    <div className="guia guia-vacia" aria-live="polite" data-testid="guia">
      <p className="guia-vacia-texto" data-testid="mensaje-fallo">
        {mensaje}
      </p>
    </div>
  );
}
