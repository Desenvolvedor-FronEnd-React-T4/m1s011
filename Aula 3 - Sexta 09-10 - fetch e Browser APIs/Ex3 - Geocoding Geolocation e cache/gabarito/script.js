/* ==========================================================================
   Exercício 3 — Geocoding → Forecast, Geolocation com fallback e cache (sexta 09/10)
   Conceitos: encadear 2 fetch, encodeURIComponent, o campo "results" que SOME,
   navigator.geolocation (sucesso/erro), cache com validade no localStorage,
   tempo limite com AbortController + setTimeout.
   ========================================================================== */

const VALIDADE_CACHE_MS = 10 * 60 * 1000;     // dado com menos de 10 min é "fresco"
const LIMITE_MS = 8000;                        // espera máxima por requisição

const elStatus = document.getElementById('status');
const campo = document.getElementById('input-cidade');
const card = document.getElementById('card-clima');

function mostrarStatus(texto, tipo) {
  elStatus.className = 'status ' + (tipo === 'carregando' ? '' : tipo);
  elStatus.textContent = texto;
  elStatus.hidden = false;
}

/* ---------- fetch com TEMPO LIMITE ---------- */

async function buscarJSON(url) {
  // ✔ Passo: criar um AbortController e um setTimeout(LIMITE_MS) que chame controlador.abort(); passar { signal: controlador.signal } ao fetch; limpar o timer com clearTimeout no finally
  const controlador = new AbortController();
  const limite = setTimeout(function () {
    controlador.abort();                       // cancela o fetch depois de 8 s
  }, LIMITE_MS);

  try {
    const resposta = await fetch(url, { signal: controlador.signal });
    if (!resposta.ok) {
      throw new Error('Servidor respondeu ' + resposta.status);
    }
    return await resposta.json();
  } finally {
    clearTimeout(limite);                      // chegou (ou falhou): cancela o timer
  }
}

/* ---------- Passo 1: Geocoding (nome → coordenadas) ---------- */

async function buscarCoordenadas(nome) {
  // ✔ Passo: montar a URL do Geocoding com encodeURIComponent(nome) e '&count=1&language=pt&format=json'; se !dados.results ou estiver vazio, devolver null; senão devolver { nome, latitude, longitude } do 1º resultado
  const url = 'https://geocoding-api.open-meteo.com/v1/search'
    + '?name=' + encodeURIComponent(nome)      // protege acentos e espaços ("São Paulo")
    + '&count=1&language=pt&format=json';
  const dados = await buscarJSON(url);

  // Pegadinha: cidade inexistente → o campo "results" SOME (não vem array vazio)
  if (!dados.results || dados.results.length === 0) {
    return null;
  }
  const achado = dados.results[0];
  return { nome: achado.name, latitude: achado.latitude, longitude: achado.longitude };
}

/* ---------- Passo 2: Forecast (coordenadas → clima) ---------- */

async function buscarClima(latitude, longitude) {
  const url = 'https://api.open-meteo.com/v1/forecast'
    + '?latitude=' + latitude + '&longitude=' + longitude
    + '&current=temperature_2m,weather_code&timezone=auto';
  const dados = await buscarJSON(url);
  return { temperatura: dados.current.temperature_2m, codigo: dados.current.weather_code };
}

/* ---------- Cache no localStorage (com validade) ---------- */

function lerCache() {
  try {
    return JSON.parse(localStorage.getItem('previsaocerta:cache-ex3')) || {};
  } catch (erro) {
    return {};
  }
}

// ✔ Passo: escrever salvarNoCache(nome, clima): guardar { ...clima, salvoEm: Date.now() } dentro do objeto de cache, indexado pelo nome
function salvarNoCache(nome, clima) {
  const cache = lerCache();
  cache[nome] = Object.assign({}, clima, { salvoEm: Date.now() });   // salvoEm = carimbo de tempo
  localStorage.setItem('previsaocerta:cache-ex3', JSON.stringify(cache));
}

// Fresco = salvo há menos de VALIDADE_CACHE_MS
function cacheFresco(entrada) {
  return Boolean(entrada) && Date.now() - entrada.salvoEm < VALIDADE_CACHE_MS;
}

/* ---------- Tela ---------- */

function decodificarTempo(code) {
  const mapa = {
    0: '☀️ Céu limpo', 1: '🌤️ Predominantemente limpo', 2: '⛅ Parcialmente nublado', 3: '☁️ Nublado',
    45: '🌫️ Nevoeiro', 51: '🌦️ Garoa fraca', 61: '🌧️ Chuva fraca', 63: '🌧️ Chuva moderada',
    65: '🌧️ Chuva forte', 80: '🌦️ Pancadas de chuva', 95: '⛈️ Trovoada'
  };
  return mapa[code] || '❓ Condição desconhecida';
}

function renderizarCard(nome, clima, origem) {
  card.querySelector('.card-cidade').textContent = nome;
  card.querySelector('.card-temp').textContent = Math.round(clima.temperatura) + '°C';
  card.querySelector('.card-desc').textContent = decodificarTempo(clima.codigo);
  card.querySelector('.card-origem').textContent = origem;
}

/* ---------- Fluxo: coordenadas → clima (com cache) ---------- */

async function mostrarClimaDe(cidade) {
  const emCache = lerCache()[cidade.nome];

  if (cacheFresco(emCache)) {
    // 2ª visita: resposta INSTANTÂNEA, sem rede
    renderizarCard(cidade.nome, emCache, 'cache (salvo há ' + Math.round((Date.now() - emCache.salvoEm) / 1000) + ' s)');
    mostrarStatus('Clima de ' + cidade.nome + ' (do cache).', 'sucesso');
    return;
  }

  mostrarStatus('Carregando clima de ' + cidade.nome + '…', 'carregando');
  try {
    const clima = await buscarClima(cidade.latitude, cidade.longitude);
    salvarNoCache(cidade.nome, clima);
    renderizarCard(cidade.nome, clima, 'internet (agora)');
    mostrarStatus('Clima de ' + cidade.nome + ' atualizado.', 'sucesso');
  } catch (erro) {
    if (erro.name === 'AbortError') {
      mostrarStatus('A busca demorou demais. Tente de novo.', 'erro');      // estourou o tempo limite
    } else {
      mostrarStatus('Não foi possível carregar. Tente de novo.', 'erro');
    }
  }
}

/* ---------- Busca por nome (Geocoding → Forecast) ---------- */

document.getElementById('form-busca').addEventListener('submit', async function (evento) {
  evento.preventDefault();
  const nome = campo.value.trim();
  if (nome === '') {
    mostrarStatus('Digite o nome de uma cidade.', 'erro');
    campo.focus();
    return;
  }

  mostrarStatus('Procurando "' + nome + '"…', 'carregando');
  try {
    const cidade = await buscarCoordenadas(nome);
    if (cidade === null) {
      mostrarStatus('Cidade "' + nome + '" não encontrada. Confira a grafia.', 'erro');
      campo.focus();
      return;
    }
    await mostrarClimaDe(cidade);
  } catch (erro) {
    mostrarStatus('Não foi possível buscar a cidade. Tente de novo.', 'erro');
  }
});

/* ---------- Geolocation com fallback ---------- */

document.getElementById('btn-localizacao').addEventListener('click', function () {
  // ✔ Passo: se !navigator.geolocation avisar e focar o campo; senão chamar navigator.geolocation.getCurrentPosition(sucesso, erro, { timeout: 10000 }) — no sucesso usar posicao.coords.latitude/longitude, no erro avisar e focar o campo (fallback: busca manual)
  if (!navigator.geolocation) {
    mostrarStatus('Seu navegador não tem localização. Busque pelo nome da cidade.', 'erro');
    campo.focus();
    return;
  }

  mostrarStatus('Obtendo sua localização…', 'carregando');
  navigator.geolocation.getCurrentPosition(
    function (posicao) {                       // SUCESSO: o usuário permitiu
      mostrarClimaDe({
        nome: 'Minha localização',
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude
      });
    },
    function () {                              // ERRO: permissão negada, sem sinal ou tempo esgotado
      mostrarStatus('Não foi possível obter sua localização. Busque pelo nome da cidade.', 'erro');
      campo.focus();                           // caminho alternativo: busca manual
    },
    { timeout: 10000 }
  );
});
