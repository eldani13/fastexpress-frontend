"use client";

interface CampoNumeroProps {
  id: string;
  label: string;
  name: string;
  value: string;
  placeholder: string;
  ayuda: string;
  error: string | null;
  testId: string;
  errorTestId: string;
  unidadAntes?: string;
  unidadDespues: string;
  onChange: (valor: string) => void;
  onClearError: () => void;
}

export function CampoNumero({
  id,
  label,
  name,
  value,
  placeholder,
  ayuda,
  error,
  testId,
  errorTestId,
  unidadAntes,
  unidadDespues,
  onChange,
  onClearError,
}: CampoNumeroProps) {
  const invalido = Boolean(error);

  return (
    <div className={`campo${invalido ? " campo-invalido" : ""}`}>
      <label htmlFor={id}>{label}</label>
      <div className="entrada-unidad">
        {unidadAntes ? (
          <span className="unidad unidad-inicio">{unidadAntes}</span>
        ) : null}
        <input
          id={id}
          name={name}
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder={placeholder}
          aria-describedby={`${id}-ayuda ${id}-error`}
          aria-invalid={invalido || undefined}
          data-testid={testId}
          value={value}
          onChange={(e) => {
            onChange(e.target.value);
            onClearError();
          }}
        />
        <span className="unidad">{unidadDespues}</span>
      </div>
      <p id={`${id}-ayuda`} className="ayuda">
        {ayuda}
      </p>
      <p
        id={`${id}-error`}
        className="error-campo"
        data-testid={errorTestId}
        hidden={!error}
      >
        {error}
      </p>
    </div>
  );
}
