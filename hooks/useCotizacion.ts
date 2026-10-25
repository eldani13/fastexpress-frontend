"use client";

import { useCallback, useState } from "react";

import { cotizar } from "@/lib/api";
import { esCodigoRechazo, RECHAZO_MENSAJES } from "@/lib/constants";
import { validarNumero } from "@/lib/validation";
import { alerts } from "@/lib/ui/alerts";
import type {
  CotizacionRequest,
  ResultadoGuia,
  TipoCliente,
  TipoEnvio,
} from "@/types/cotizacion";

export interface ErroresCampos {
  peso: string | null;
  monto: string | null;
}

const erroresVacios: ErroresCampos = { peso: null, monto: null };

export function useCotizacion() {
  const [peso, setPeso] = useState("");
  const [monto, setMonto] = useState("");
  const [tipoCliente, setTipoCliente] = useState<TipoCliente>("NUEVO");
  const [tipoEnvio, setTipoEnvio] = useState<TipoEnvio>("ESTANDAR");
  const [errores, setErrores] = useState<ErroresCampos>(erroresVacios);
  const [guia, setGuia] = useState<ResultadoGuia>({ tipo: "vacia" });
  const [cargando, setCargando] = useState(false);

  const limpiarError = useCallback((campo: keyof ErroresCampos) => {
    setErrores((prev) => ({ ...prev, [campo]: null }));
  }, []);

  const enviar = useCallback(async () => {
    const vPeso = validarNumero(peso, {
      nombre: "el peso",
      ejemplo: "2.5",
    });
    const vMonto = validarNumero(monto, {
      nombre: "el valor declarado",
      ejemplo: "80",
      detectarMiles: true,
    });

    setErrores({ peso: vPeso.error, monto: vMonto.error });

    if (vPeso.error || vMonto.error) {
      setGuia({ tipo: "vacia" });
      return;
    }

    const datos: CotizacionRequest = {
      peso: vPeso.valor!,
      monto_declarado: vMonto.valor!,
      tipo_cliente: tipoCliente,
      tipo_envio: tipoEnvio,
    };

    const loadingAlert = alerts.loading("Calculando cotización...");
    setCargando(true);
    try {
      const resultado = await cotizar(datos);

      if (resultado.ok) {
        setGuia({ tipo: "ok", cotizacion: resultado.data });
        alerts.toast("success", "¡Cotización generada correctamente!");
        loadingAlert.then(() => alerts.close());
        return;
      }

      const { status, body } = resultado;
      const codigo = body?.codigo ?? "";

      if (!body || status >= 500) {
        setGuia({
          tipo: "fallo",
          mensaje: `El servidor tuvo un error inesperado (código ${status}). Intenta de nuevo; si se repite, reporta el problema.`,
        });
        alerts.error({
          title: "Error del servidor",
          text: `El servidor respondió con código ${status}. Intenta de nuevo más tarde.`,
          confirmButtonText: "Entendido",
        });
        loadingAlert.then(() => alerts.close());
        return;
      }

      if (esCodigoRechazo(codigo)) {
        setGuia({ tipo: "rechazo", codigo, datos });
        alerts.warning({
          title: "Cotización rechazada",
          text: RECHAZO_MENSAJES[codigo as keyof typeof RECHAZO_MENSAJES] || "La cotización no cumple con los requisitos.",
          confirmButtonText: "Entendido",
        });
        loadingAlert.then(() => alerts.close());
        return;
      }

      if (codigo === "PESO_INVALIDO") {
        setGuia({ tipo: "vacia" });
        setErrores((e) => ({ ...e, peso: body.mensaje ?? "Peso inválido." }));
        alerts.toast("error", body.mensaje ?? "Peso inválido");
        loadingAlert.then(() => alerts.close());
        return;
      }

      if (codigo === "MONTO_INVALIDO") {
        setGuia({ tipo: "vacia" });
        setErrores((e) => ({
          ...e,
          monto: body.mensaje ?? "Monto inválido.",
        }));
        alerts.toast("error", body.mensaje ?? "Monto inválido");
        loadingAlert.then(() => alerts.close());
        return;
      }

      setGuia({
        tipo: "fallo",
        mensaje: body.mensaje || "El servidor no pudo procesar la cotización.",
      });
      alerts.error({
        title: "Error",
        text: body.mensaje || "El servidor no pudo procesar la cotización.",
        confirmButtonText: "Entendido",
      });
      loadingAlert.then(() => alerts.close());
    } catch {
      setGuia({
        tipo: "fallo",
        mensaje:
          "No hay conexión con el servidor. Verifica que la API esté en ejecución en el puerto 8000.",
      });
      alerts.error({
        title: "Sin conexión",
        text: "No hay conexión con el servidor. Verifica que la API esté en ejecución en el puerto 8000.",
        confirmButtonText: "Reintentar",
      });
      loadingAlert.then(() => alerts.close());
    } finally {
      setCargando(false);
    }
  }, [peso, monto, tipoCliente, tipoEnvio]);

  return {
    peso,
    setPeso,
    monto,
    setMonto,
    tipoCliente,
    setTipoCliente,
    tipoEnvio,
    setTipoEnvio,
    errores,
    limpiarError,
    guia,
    cargando,
    enviar,
  };
}
