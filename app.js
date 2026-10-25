// FastExpress – cliente del cotizador.
// Validaciones del cliente: solo formato (campo vacío, número, decimales, mayor a 0).
// Los límites de negocio (20 kg, $1,000) los decide el backend.

const API_BASE = location.protocol.startsWith("http") ? "" : "http://127.0.0.1:8000";
const URL_COTIZAR = `${API_BASE}/api/v1/cotizaciones`;

const form = document.getElementById("form-cotizacion");
const guia = document.getElementById("guia");
const boton = form.querySelector("button[type=submit]");

const NOMBRES = {
  NUEVO: "Nuevo",
  FRECUENTE: "Frecuente",
  VIP: "VIP",
  ESTANDAR: "Estándar",
  EXPRESS: "Express",
};

// ------------------------------------------------------------- Validación
/**
 * Valida el texto de un campo numérico.
 * Acepta coma o punto como separador decimal ("2,5" o "2.5").
 * @returns {{valor: string|null, error: string|null}}
 */
function validarNumero(texto, { nombre, ejemplo }) {
  const limpio = texto.trim().replace(",", ".");
  if (limpio === "") {
    return { valor: null, error: `Ingresa ${nombre}.` };
  }
  if (!/^\d+(\.\d+)?$/.test(limpio)) {
    return { valor: null, error: `Escribe solo números, por ejemplo ${ejemplo}.` };
  }
  if (!/^\d+(\.\d{1,2})?$/.test(limpio)) {
    return { valor: null, error: "Usa máximo 2 decimales." };
  }
  if (Number(limpio) <= 0) {
    return { valor: null, error: `${nombre[0].toUpperCase()}${nombre.slice(1)} debe ser mayor a 0.` };
  }
  return { valor: limpio, error: null };
}

function mostrarErrorCampo(id, mensaje) {
  const input = document.getElementById(id);
  const error = document.getElementById(`${id}-error`);
  const campo = input.closest(".campo");
  if (mensaje) {
    error.textContent = mensaje;
    error.hidden = false;
    campo.classList.add("campo-invalido");
    input.setAttribute("aria-invalid", "true");
  } else {
    error.textContent = "";
    error.hidden = true;
    campo.classList.remove("campo-invalido");
    input.removeAttribute("aria-invalid");
  }
}

// ------------------------------------------------------------- Formatos
const dinero = (valor) =>
  "$" + Number(valor).toLocaleString("en-US", { minimumFractionDigits: 2, maximumFractionDigits: 2 });
const porcentaje = (fraccion) => `${Math.round(Number(fraccion) * 100)} %`;

function escapar(texto) {
  const div = document.createElement("div");
  div.textContent = String(texto);
  return div.innerHTML;
}

// ------------------------------------------------------------- Render
function renderCotizacion(c) {
  const express = c.tipo_envio === "EXPRESS";
  const filas = [
    ["Tarifa base", "", dinero(c.tarifa_base)],
    ["Peso", `${c.peso} kg × ${dinero(c.tarifa_kg)} por kg`, dinero(c.cargo_peso)],
  ];
  const filaSubtotal = ["Subtotal", "", dinero(c.subtotal)];
  const ajustes = [];
  if (Number(c.descuento) > 0) {
    ajustes.push([`Descuento ${NOMBRES[c.tipo_cliente]}`, porcentaje(c.porcentaje_descuento), `−${dinero(c.descuento)}`, "negativo"]);
  }
  if (Number(c.recargo) > 0) {
    ajustes.push(["Recargo Express", `${porcentaje(c.porcentaje_recargo)} sobre el subtotal con descuento`, `+${dinero(c.recargo)}`]);
  }
  if (Number(c.seguro) > 0) {
    ajustes.push(["Seguro", `2 % de ${dinero(c.monto_declarado)} declarados`, `+${dinero(c.seguro)}`]);
  }

  const fila = ([titulo, detalle, valor, clase], extra = "") => `
    <tr class="${extra}">
      <th scope="row">${escapar(titulo)}${detalle ? `<small>${escapar(detalle)}</small>` : ""}</th>
      <td class="${clase || ""}">${escapar(valor)}</td>
    </tr>`;

  guia.className = "guia";
  guia.innerHTML = `
    ${express ? '<div class="cinta" data-testid="cinta-express">Express</div>' : ""}
    <div class="guia-cabecera">
      <strong>FastExpress</strong>
      <span>Guía de cotización</span>
    </div>
    <dl class="guia-datos">
      <div><dt>Peso</dt><dd>${escapar(c.peso)} kg</dd></div>
      <div><dt>Valor declarado</dt><dd>${dinero(c.monto_declarado)}</dd></div>
      <div><dt>Cliente</dt><dd>${NOMBRES[c.tipo_cliente]}</dd></div>
      <div><dt>Envío</dt><dd>${NOMBRES[c.tipo_envio]}</dd></div>
    </dl>
    <table class="desglose" data-testid="desglose">
      <tbody>
        ${filas.map((f) => fila(f)).join("")}
        ${fila(filaSubtotal, "fila-subtotal")}
        ${ajustes.map((f) => fila(f)).join("")}
      </tbody>
    </table>
    <div class="guia-total">
      <span>Total a pagar</span>
      <output data-testid="total">${dinero(c.total)}</output>
    </div>`;
}

const RECHAZOS = {
  LIMITE_PESO_EXCEDIDO: {
    detalle: (d) => `El paquete pesa ${d.peso} kg y el máximo por envío es 20 kg.`,
    accion: "Divide el contenido en paquetes de hasta 20 kg y cotiza cada uno.",
  },
  LIMITE_MONTO_EXCEDIDO: {
    detalle: (d) => `El valor declarado es ${dinero(d.monto_declarado)} y el máximo asegurable es $1,000.`,
    accion: "Declara un valor de hasta $1,000 o envía el contenido en varios paquetes.",
  },
};

function renderRechazo(codigo, datos) {
  const r = RECHAZOS[codigo];
  guia.className = "guia guia-rechazada";
  guia.innerHTML = `
    <div class="guia-cabecera">
      <strong>FastExpress</strong>
      <span>Guía de cotización</span>
    </div>
    <div class="guia-cuerpo">
      <div class="sello" data-testid="sello-rechazo">Rechazado</div>
      <p><strong>${escapar(r.detalle(datos))}</strong></p>
      <p>${escapar(r.accion)}</p>
      <p class="codigo">Código ${escapar(codigo)}</p>
    </div>`;
}

function renderVacia() {
  guia.className = "guia guia-vacia";
  guia.innerHTML = '<p class="guia-vacia-texto">Tu guía de envío aparecerá aquí cuando cotices.</p>';
}

function renderFallo(mensaje) {
  guia.className = "guia guia-vacia";
  guia.innerHTML = `<p class="guia-vacia-texto" data-testid="mensaje-fallo">${escapar(mensaje)}</p>`;
}

// ------------------------------------------------------------- Envío
form.addEventListener("submit", async (evento) => {
  evento.preventDefault();

  const peso = validarNumero(form.peso.value, { nombre: "el peso", ejemplo: "2.5" });
  const monto = validarNumero(form.monto_declarado.value, { nombre: "el valor declarado", ejemplo: "80" });
  mostrarErrorCampo("peso", peso.error);
  mostrarErrorCampo("monto", monto.error);
  if (peso.error || monto.error) {
    // Una guía anterior ya no corresponde a los datos actuales
    renderVacia();
    document.getElementById(peso.error ? "peso" : "monto").focus();
    return;
  }

  const datos = {
    peso: peso.valor,
    monto_declarado: monto.valor,
    tipo_cliente: form.tipo_cliente.value,
    tipo_envio: form.tipo_envio.value,
  };

  boton.disabled = true;
  boton.textContent = "Cotizando…";
  try {
    const respuesta = await fetch(URL_COTIZAR, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(datos),
    });
    const cuerpo = await respuesta.json();

    if (respuesta.ok) {
      renderCotizacion(cuerpo);
    } else if (RECHAZOS[cuerpo.codigo]) {
      renderRechazo(cuerpo.codigo, datos);
    } else if (cuerpo.codigo === "PESO_INVALIDO") {
      renderVacia();
      mostrarErrorCampo("peso", cuerpo.mensaje);
    } else if (cuerpo.codigo === "MONTO_INVALIDO") {
      renderVacia();
      mostrarErrorCampo("monto", cuerpo.mensaje);
    } else {
      renderFallo(cuerpo.mensaje || "El servidor no pudo procesar la cotización.");
    }
  } catch {
    renderFallo("No hay conexión con el servidor. Verifica que la API esté en ejecución en el puerto 8000.");
  } finally {
    boton.disabled = false;
    boton.textContent = "Cotizar envío";
  }
});

// Al corregir un campo, se limpia su error
["peso", "monto"].forEach((id) => {
  document.getElementById(id).addEventListener("input", () => mostrarErrorCampo(id, null));
});
