# FastExpress Frontend (Next.js)

Interfaz del cotizador de envíos. Cada pieza vive en su carpeta; ningún archivo de
lógica supera ~200 líneas a propósito.

## Repos del proyecto

| Rol | Repositorio |
|---|---|
| API | https://github.com/eldani13/fastexpress-api |
| Frontend | https://github.com/eldani13/fastexpress-frontend |
| QA | https://github.com/eldani13/fastexpress-qa |

## Estructura

```
app/                    # App Router (layout + página)
components/
  brand/                # Cabecera / marca
  layout/               # Mesa (grid formulario + resultado)
  cotizador/            # Formulario y campos
  guia/                 # Guía vacía, OK, rechazo, fallo
hooks/                  # useCotizacion
lib/
  api/                  # Cliente HTTP
  validation/           # validarNumero
  format/               # dinero, porcentaje, nombres
  constants/            # textos de rechazo
styles/                 # CSS partido (variables, form, guía, responsive)
types/                  # Tipos del contrato API
public/                 # Estáticos
```

## Arranque

```bash
cp .env.example .env.local
npm install
npm run dev
```

Abre http://localhost:3000

La API debe estar en `NEXT_PUBLIC_API_URL` (por defecto `http://127.0.0.1:8000`).

## Scripts

| Comando | Qué hace |
|---|---|
| `npm run dev` | Desarrollo |
| `npm run build` | Build de producción |
| `npm start` | Servir build |
| `npm run lint` | Lint |

## Convención

- Un componente / util por archivo.
- Exportar desde `index.ts` de cada carpeta.
- Conservar `data-testid` para las pruebas E2E de QA.
- Defectos DEF-005 (error 500) y DEF-006 (separador de miles) ya contemplados
  en `lib/api/cotizar.ts` y `lib/validation/validarNumero.ts`.
