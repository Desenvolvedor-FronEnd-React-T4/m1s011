/* ==========================================================================
   Exercício 1 — Clima real com fetch e os 3 estados (sexta 09/10)
   Conceitos: fetch + await + .json(), URL com query string, response.ok,
   try/catch, os 3 estados (carregando / sucesso / erro), render no DOM.
   API: Open-Meteo (pública, sem chave) — https://open-meteo.com/
   ========================================================================== */

const elStatus = document.getElementById('status');
const card = document.getElementById('card-clima');

/* ---------- Os 3 estados ---------- */

// tipo: 'carregando' | 'sucesso' | 'erro'
function mostrarStatus(texto, tipo) {
  elStatus.className = 'status ' + (tipo === 'carregando' ? '' : tipo);
  elStatus.textContent = texto;       // aria-live anuncia a mudança ao leitor de tela
  elStatus.hidden = false;
}

/* ---------- Tradução do weather_code (padrão WMO) ---------- */

// ✔ Passo: escrever decodificarTempo(code): objeto-mapa { código: { texto, icone } } e devolver mapa[code] || { texto: 'Condição desconhecida', icone: '❓' }
function decodificarTempo(code) {
  const mapa = {
    0: { texto: 'Céu limpo', icone: '☀️' },
    1: { texto: 'Predominantemente limpo', icone: '🌤️' },
    2: { texto: 'Parcialmente nublado', icone: '⛅' },
    3: { texto: 'Nublado', icone: '☁️' },
    45: { texto: 'Nevoeiro', icone: '🌫️' },
    51: { texto: 'Garoa fraca', icone: '🌦️' },
    61: { texto: 'Chuva fraca', icone: '🌧️' },
    63: { texto: 'Chuva moderada', icone: '🌧️' },
    65: { texto: 'Chuva forte', icone: '🌧️' },
    80: { texto: 'Pancadas de chuva', icone: '🌦️' },
    95: { texto: 'Trovoada', icone: '⛈️' }
  };
  // Se a API devolver um código que não está no mapa, não quebramos: mostramos "desconhecida"
  return mapa[code] || { texto: 'Condição desconhecida', icone: '❓' };
}

/* ---------- Busca na API ---------- */

async function buscarClima(latitude, longitude) {
  // O laboratório troca o caminho por um inexistente → o servidor responde 404
  const caminho = document.getElementById('modo').value === 'errado' ? '/v1/forecastt' : '/v1/forecast';

  // ✔ Passo: montar a URL: 'https://api.open-meteo.com' + caminho + '?latitude=' + ... + '&longitude=' + ... + '&current=temperature_2m,weather_code&timezone=auto'
  const url = 'https://api.open-meteo.com' + caminho
    + '?latitude=' + latitude
    + '&longitude=' + longitude
    + '&current=temperature_2m,weather_code'   // quais dados queremos "agora"
    + '&timezone=auto';                         // hora local da cidade

  // ✔ Passo: fazer o pedido com await fetch(url); se !resposta.ok, lançar new Error('Servidor respondeu ' + resposta.status); depois await resposta.json()
  const resposta = await fetch(url);            // 1º await: espera o servidor responder
  if (!resposta.ok) {                           // 404/500 NÃO rejeitam o fetch — response.ok pega
    throw new Error('Servidor respondeu ' + resposta.status);
  }
  const dados = await resposta.json();          // 2º await: converte o corpo (JSON) em objeto

  return {
    temperatura: dados.current.temperature_2m,
    codigo: dados.current.weather_code,
    hora: dados.current.time                    // ex.: "2026-10-09T09:30"
  };
}

/* ---------- Render no DOM ---------- */

// ✔ Passo: escrever renderizarCard(nome, clima): preencher .card-cidade, .card-temp, .card-desc e o <time> (textContent + setAttribute('datetime', ...))
function renderizarCard(nome, clima) {
  const cond = decodificarTempo(clima.codigo);
  card.querySelector('.card-cidade').textContent = nome;
  card.querySelector('.card-temp').textContent = Math.round(clima.temperatura) + '°C';
  card.querySelector('.card-desc').textContent = cond.icone + ' ' + cond.texto;

  const hora = card.querySelector('.card-hora');
  hora.textContent = clima.hora.slice(11, 16);   // "2026-10-09T09:30" → "09:30"
  hora.setAttribute('datetime', clima.hora);     // formato legível por máquina
}

/* ---------- Fluxo completo com os 3 estados ---------- */

async function carregarCidade(nome, latitude, longitude) {
  mostrarStatus('Carregando clima de ' + nome + '…', 'carregando');   // estado 1

  // ✔ Passo: envolver a busca em try/catch: no try chamar buscarClima + renderizarCard + mostrarStatus(..., 'sucesso'); no catch mostrar 'Não foi possível carregar. Tente de novo.' com tipo 'erro'
  try {
    const clima = await buscarClima(latitude, longitude);
    renderizarCard(nome, clima);
    mostrarStatus('Clima de ' + nome + ' atualizado.', 'sucesso');     // estado 2
  } catch (erro) {
    // try/catch pega a rede que cai; o response.ok (acima) pega o 404. Juntos cobrem o "caminho triste".
    console.error(erro);                                               // detalhe técnico fica no Console
    mostrarStatus('Não foi possível carregar. Tente de novo.', 'erro'); // estado 3: mensagem amigável
  }
}

/* ---------- Eventos ---------- */

document.querySelectorAll('.btn-cidade').forEach(function (botao) {
  botao.addEventListener('click', function () {
    carregarCidade(
      botao.dataset.nome,
      Number(botao.dataset.lat),               // dataset sempre devolve string → converter
      Number(botao.dataset.lon)
    );
  });
});
