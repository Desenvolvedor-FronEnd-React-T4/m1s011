/* api.js — CHECKPOINT DE QUINTA: só os auxiliares de formatação.
   Na sexta entram buscarJSON, buscarCoordenadas e buscarClima (fetch). */

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
