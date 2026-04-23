export async function onRequest(context) {
  // Leemos la clave que creamos antes desde el binding KV_DATA
  const valorKV = await context.env.KV_DATA.get("SALUDO_PRUEBA");
  
  return new Response(valorKV || "No se encontró el dato");
}
