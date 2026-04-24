export async function onRequest(context) {
  // Leemos la clave específica del cliente
  const fecha = await context.env.KV_DATA.get("OLEYAJI/DATA_CADUCITAT");
  
  // Devolvemos el dato
  return new Response(fecha || "2026-01-01");
}