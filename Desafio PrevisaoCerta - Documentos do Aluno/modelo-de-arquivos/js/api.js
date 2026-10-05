/* ==========================================================================
   api.js — conversa com a internet (fetch)  | Aula de sexta (09/10)
   API: Open-Meteo (pública, sem chave) — https://open-meteo.com/
   Duas chamadas encadeadas: Geocoding (nome → lat/long) → Forecast (lat/long → clima)
   ========================================================================== */

const URL_GEOCODING = 'https://geocoding-api.open-meteo.com/v1/search';
const URL_FORECAST = 'https://api.open-meteo.com/v1/forecast';
const LIMITE_MS = 8000;   // tempo máximo de espera por requisição (8 s)

/* Faz um fetch com TEMPO LIMITE: sem isso, rede lenta = "Carregando…" para sempre.
   AbortController cancela o fetch; setTimeout dispara o cancelamento. */
async function buscarJSON(url) {
  // TODO: criar AbortController + setTimeout(LIMITE_MS) para abortar; await fetch(url, { signal }); se !resposta.ok lançar Error; devolver await resposta.json(); clearTimeout no finally.
}

/* ⭐ Geocoding: "Florianópolis" → { nome, latitude, longitude } (ou null) */
async function buscarCoordenadas(nome) {
  // TODO: montar a URL do Geocoding com encodeURIComponent(nome); se não existir dados.results (ou vier vazio) devolver null; senão devolver { nome, latitude, longitude } do 1º resultado.
}

/* Forecast: lat/long → clima atual { temperatura (°C), codigo, vento, hora } */
async function buscarClima(latitude, longitude) {
  // TODO: montar a URL do Forecast (current=temperature_2m,weather_code,wind_speed_10m&timezone=auto) e devolver { temperatura, codigo, vento, hora } a partir de dados.current.
}

/* weather_code (WMO) → texto em pt-BR + emoji */
function decodificarTempo(code) {
  // TODO: mapa { código: { texto, icone } } com os códigos WMO do documento funcional; devolver mapa[code] || { texto: 'Condição desconhecida', icone: '❓' }.
}

/* A API devolve °C; a conversão para °F é feita aqui (sem novo fetch) */
function formatarTemperatura(celsius, unidade) {
  if (unidade === 'fahrenheit') {
    return Math.round(celsius * 9 / 5 + 32) + '°F';
  }
  return Math.round(celsius) + '°C';
}
