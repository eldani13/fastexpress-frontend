"use client";

export interface OpcionSegmento<T extends string> {
  value: T;
  etiqueta: string;
  detalle: string;
}

interface SegmentosRadioProps<T extends string> {
  legend: string;
  name: string;
  testId: string;
  value: T;
  opciones: OpcionSegmento<T>[];
  onChange: (valor: T) => void;
}

export function SegmentosRadio<T extends string>({
  legend,
  name,
  testId,
  value,
  opciones,
  onChange,
}: SegmentosRadioProps<T>) {
  return (
    <fieldset className="campo">
      <legend>{legend}</legend>
      <div className="segmentos" data-testid={testId}>
        {opciones.map((opcion) => (
          <label key={opcion.value}>
            <input
              type="radio"
              name={name}
              value={opcion.value}
              checked={value === opcion.value}
              onChange={() => onChange(opcion.value)}
            />
            <span>
              {opcion.etiqueta}
              <small>{opcion.detalle}</small>
            </span>
          </label>
        ))}
      </div>
    </fieldset>
  );
}
