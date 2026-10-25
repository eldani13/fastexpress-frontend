import type { ReactNode } from "react";

interface MesaLayoutProps {
  formulario: ReactNode;
  resultado: ReactNode;
}

export function MesaLayout({ formulario, resultado }: MesaLayoutProps) {
  return (
    <main className="mesa">
      <section className="cotizador" aria-labelledby="titulo">
        {formulario}
      </section>
      <section className="resultado" aria-label="Resultado de la cotización">
        {resultado}
      </section>
    </main>
  );
}
