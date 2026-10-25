"use client";

import type { TipoCliente, TipoEnvio } from "@/types/cotizacion";

import { BotonCotizar } from "./BotonCotizar";
import { CampoNumero } from "./CampoNumero";
import { SegmentosRadio } from "./SegmentosRadio";

const OPCIONES_CLIENTE = [
  { value: "NUEVO" as const, etiqueta: "Nuevo", detalle: "Sin descuento" },
  {
    value: "FRECUENTE" as const,
    etiqueta: "Frecuente",
    detalle: "10 % menos",
  },
  { value: "VIP" as const, etiqueta: "VIP", detalle: "20 % menos" },
];

const OPCIONES_ENVIO = [
  {
    value: "ESTANDAR" as const,
    etiqueta: "Estándar",
    detalle: "Sin recargo",
  },
  {
    value: "EXPRESS" as const,
    etiqueta: "Express",
    detalle: "25 % adicional",
  },
];

export interface CotizadorFormProps {
  peso: string;
  monto: string;
  tipoCliente: TipoCliente;
  tipoEnvio: TipoEnvio;
  errorPeso: string | null;
  errorMonto: string | null;
  cargando: boolean;
  onPesoChange: (v: string) => void;
  onMontoChange: (v: string) => void;
  onTipoClienteChange: (v: TipoCliente) => void;
  onTipoEnvioChange: (v: TipoEnvio) => void;
  onClearErrorPeso: () => void;
  onClearErrorMonto: () => void;
  onSubmit: () => void;
}

export function CotizadorForm({
  peso,
  monto,
  tipoCliente,
  tipoEnvio,
  errorPeso,
  errorMonto,
  cargando,
  onPesoChange,
  onMontoChange,
  onTipoClienteChange,
  onTipoEnvioChange,
  onClearErrorPeso,
  onClearErrorMonto,
  onSubmit,
}: CotizadorFormProps) {
  return (
    <>
      <h1 id="titulo">Cotiza tu envío</h1>
      <p className="intro">
        Ingresa los datos del paquete y obtén el valor con descuentos, recargos
        y seguro.
      </p>

      <form
        id="form-cotizacion"
        noValidate
        data-testid="form-cotizacion"
        onSubmit={(e) => {
          e.preventDefault();
          onSubmit();
        }}
      >
        <CampoNumero
          id="peso"
          label="Peso del paquete"
          name="peso"
          value={peso}
          placeholder="2.50"
          ayuda="Hasta 20 kg, con máximo 2 decimales."
          error={errorPeso}
          testId="input-peso"
          errorTestId="error-peso"
          unidadDespues="kg"
          onChange={onPesoChange}
          onClearError={onClearErrorPeso}
        />

        <CampoNumero
          id="monto"
          label="Valor declarado del contenido"
          name="monto_declarado"
          value={monto}
          placeholder="80.00"
          ayuda="Hasta $1,000. Si supera $100 se cobra un seguro del 2 %."
          error={errorMonto}
          testId="input-monto"
          errorTestId="error-monto"
          unidadAntes="$"
          unidadDespues="USD"
          onChange={onMontoChange}
          onClearError={onClearErrorMonto}
        />

        <SegmentosRadio
          legend="Tipo de cliente"
          name="tipo_cliente"
          testId="grupo-cliente"
          value={tipoCliente}
          opciones={OPCIONES_CLIENTE}
          onChange={onTipoClienteChange}
        />

        <SegmentosRadio
          legend="Tipo de envío"
          name="tipo_envio"
          testId="grupo-envio"
          value={tipoEnvio}
          opciones={OPCIONES_ENVIO}
          onChange={onTipoEnvioChange}
        />

        <BotonCotizar cargando={cargando} />
      </form>
    </>
  );
}
