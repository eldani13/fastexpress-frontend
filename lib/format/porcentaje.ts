/** Fracción 0–1 ? texto "N %". */
export function porcentaje(fraccion: string | number): string {
  return `${Math.round(Number(fraccion) * 100)} %`;
}
