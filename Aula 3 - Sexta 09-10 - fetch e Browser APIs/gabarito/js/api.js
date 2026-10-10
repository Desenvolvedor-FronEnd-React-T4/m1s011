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
  const controlador = new AbortController();
  const limite = setTimeout(function () {
    controlador.abort();
  }, LIMITE_MS);

  try {
    const resposta = await fetch(url, { signal: controlador.signal });
    // fetch só REJEITA quando a rede cai; 404/500 chegam como resposta "normal".
    // response.ok (200–299) pega o 404 que finge sucesso.
    if (!resposta.ok) {
      throw new Error('Servidor respondeu ' + resposta.status);
    }
    return await resposta.json();   // 2º await: converter o corpo em objeto
  } finally {
    clearTimeout(limite);           // chegou (ou falhou) — cancela o timer
  }
}

/* ⭐ Geocoding: "Florianópolis" → { nome, latitude, longitude } (ou null) */
async function buscarCoordenadas(nome) {
  const url = URL_GEOCODING
    + '?name=' + encodeURIComponent(nome)          // protege acentos e espaços
    + '&count=1&language=pt&format=json';
  const dados = await buscarJSON(url);

  // Pegadinha: cidade inexistente → o campo "results" SOME (não vem array vazio)
  if (!dados.results || dados.results.length === 0) {
    return null;
  }
  const achado = dados.results[0];
  return { nome: achado.name, latitude: achado.latitude, longitude: achado.longitude };
}

/* Forecast: lat/long → clima atual { temperatura (°C), codigo, vento, hora } */
async function buscarClima(latitude, longitude) {
  const url = URL_FORECAST
    + '?latitude=' + latitude
    + '&longitude=' + longitude
    + '&current=temperature_2m,weather_code,wind_speed_10m'
    + '&timezone=auto';
  const dados = await buscarJSON(url);

  return {
    temperatura: dados.current.temperature_2m,   // sempre em °C vindo da API
    codigo: dados.current.weather_code,          // número no padrão WMO
    vento: dados.current.wind_speed_10m,         // km/h
    hora: dados.current.time                     // ex.: "2026-10-09T09:30"
  };
}

/* weather_code (WMO) → texto em pt-BR + emoji */
function decodificarTempo(code) {
  const mapa = {
    0: { texto: 'Céu limpo', icone: '☀️' },
    1: { texto: 'Predominantemente limpo', icone: '🌤️' },
    2: { texto: 'Parcialmente nublado', icone: '⛅' },
    3: { texto: 'Nublado', icone: '☁️' },
    45: { texto: 'Nevoeiro', icone: '🌫️' },
    48: { texto: 'Nevoeiro com geada', icone: '🌫️' },
    51: { texto: 'Garoa fraca', icone: '🌦️' },
    53: { texto: 'Garoa moderada', icone: '🌦️' },
    55: { texto: 'Garoa intensa', icone: '🌦️' },
    61: { texto: 'Chuva fraca', icone: '🌧️' },
    63: { texto: 'Chuva moderada', icone: '🌧️' },
    65: { texto: 'Chuva forte', icone: '🌧️' },
    80: { texto: 'Pancadas de chuva fracas', icone: '🌦️' },
    81: { texto: 'Pancadas de chuva moderadas', icone: '🌧️' },
    82: { texto: 'Pancadas de chuva fortes', icone: '⛈️' },
    95: { texto: 'Trovoada', icone: '⛈️' },
    96: { texto: 'Trovoada com granizo fraco', icone: '⛈️' },
    99: { texto: 'Trovoada com granizo forte', icone: '⛈️' }
  };
  return mapa[code] || { texto: 'Condição desconhecida', icone: '❓' };
}

/* A API devolve °C; a conversão para °F é feita aqui (sem novo fetch) */
function formatarTemperatura(celsius, unidade) {
  if (unidade === 'fahrenheit') {
    return Math.round(celsius * 9 / 5 + 32) + '°F';
  }
  return Math.round(celsius) + '°C';
}
