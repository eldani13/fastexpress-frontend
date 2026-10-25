/** Formato monetario USD con 2 decimales. */
export function dinero(valor: string | number): string {
  return (
    "$" +
    Number(valor).toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })
  );
}
