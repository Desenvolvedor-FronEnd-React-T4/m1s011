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

// TODO: escrever decodificarTempo(code): objeto-mapa { código: { texto, icone } } e devolver mapa[code] || { texto: 'Condição desconhecida', icone: '❓' }

/* ---------- Busca na API ---------- */

async function buscarClima(latitude, longitude) {
  // O laboratório troca o caminho por um inexistente → o servidor responde 404
  const caminho = document.getElementById('modo').value === 'errado' ? '/v1/forecastt' : '/v1/forecast';

  // TODO: montar a URL: 'https://api.open-meteo.com' + caminho + '?latitude=' + ... + '&longitude=' + ... + '&current=temperature_2m,weather_code&timezone=auto'

  // TODO: fazer o pedido com await fetch(url); se !resposta.ok, lançar new Error('Servidor respondeu ' + resposta.status); depois await resposta.json()

  return {
    temperatura: dados.current.temperature_2m,
    codigo: dados.current.weather_code,
    hora: dados.current.time                    // ex.: "2026-10-09T09:30"
  };
}

/* ---------- Render no DOM ---------- */

// TODO: escrever renderizarCard(nome, clima): preencher .card-cidade, .card-temp, .card-desc e o <time> (textContent + setAttribute('datetime', ...))

/* ---------- Fluxo completo com os 3 estados ---------- */

async function carregarCidade(nome, latitude, longitude) {
  mostrarStatus('Carregando clima de ' + nome + '…', 'carregando');   // estado 1

  // TODO: envolver a busca em try/catch: no try chamar buscarClima + renderizarCard + mostrarStatus(..., 'sucesso'); no catch mostrar 'Não foi possível carregar. Tente de novo.' com tipo 'erro'
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
