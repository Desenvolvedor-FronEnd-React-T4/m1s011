/* ==========================================================================
   Exercício 2 — Atualização automática com setInterval (sexta 09/10)
   Conceitos: setInterval / clearInterval, "um timer só", guardar o id,
   Page Visibility API (visibilitychange), relógio "atualizado há N s".
   Regra de ouro: criou um timer → pense em QUEM vai limpar.
   ========================================================================== */

const INTERVALO_MS = 15 * 1000;    // 15 s para a aula (em produção: 10 * 60 * 1000)
const LAT = -27.5954;              // Florianópolis
const LON = -48.5480;

const elStatus = document.getElementById('status');
const elTemp = document.getElementById('temperatura');
const elCond = document.getElementById('condicao');
const elIdade = document.getElementById('idade');
const elInfo = document.getElementById('info-timers');
const btnAlternar = document.getElementById('btn-alternar');

// Guardamos o ID de cada timer. Sem o id, não há como parar.
let timerAtualizacao = null;       // setInterval da busca (a cada 15 s)
let timerRelogio = null;           // setInterval do contador (a cada 1 s)
let ultimaAtualizacao = null;      // Date.now() da última atualização bem-sucedida
let timersCriados = 0;             // contador didático: nunca deve passar de 2 ativos

/* ---------- Busca (resumida: o foco aqui são os timers) ---------- */

async function buscarClima() {
  const url = 'https://api.open-meteo.com/v1/forecast?latitude=' + LAT + '&longitude=' + LON
    + '&current=temperature_2m,weather_code&timezone=auto';
  const resposta = await fetch(url);
  if (!resposta.ok) {
    throw new Error('Servidor respondeu ' + resposta.status);
  }
  return resposta.json();
}

async function atualizar() {
  try {
    const dados = await buscarClima();
    elTemp.textContent = Math.round(dados.current.temperature_2m) + '°C';
    elCond.textContent = 'Código do tempo (WMO): ' + dados.current.weather_code;
    ultimaAtualizacao = Date.now();
    elStatus.className = 'status sucesso';
    elStatus.textContent = 'Painel atualizado.';
    elStatus.hidden = false;
  } catch (erro) {
    elStatus.className = 'status erro';
    elStatus.textContent = 'Não foi possível atualizar. Tentaremos de novo no próximo ciclo.';
    elStatus.hidden = false;
  }
  desenharIdade();
}

/* ---------- Relógio "atualizado há N s" (setInterval de 1 s) ---------- */

function desenharIdade() {
  if (ultimaAtualizacao === null) {
    elIdade.textContent = 'Ainda não atualizado.';
    return;
  }
  const segundos = Math.round((Date.now() - ultimaAtualizacao) / 1000);
  elIdade.textContent = 'Atualizado há ' + segundos + ' s.';
}

/* ---------- Iniciar / parar (o coração do exercício) ---------- */

function atualizarInfo() {
  const ativos = (timerAtualizacao !== null ? 1 : 0) + (timerRelogio !== null ? 1 : 0);
  elInfo.textContent = 'Timers ativos: ' + ativos + ' · criados desde que a página abriu: ' + timersCriados;
  btnAlternar.textContent = timerAtualizacao === null
    ? 'Ligar atualização automática'
    : 'Desligar atualização automática';
}

// TODO: escrever pararAtualizacao(): clearInterval nos dois ids e voltar as variáveis para null

// TODO: escrever iniciarAtualizacao(): PRIMEIRO pararAtualizacao() (nunca 2 timers vivos), chamar atualizar() já, depois guardar em timerAtualizacao o setInterval(atualizar, INTERVALO_MS) e em timerRelogio o setInterval(desenharIdade, 1000)

/* ---------- Eventos ---------- */

btnAlternar.addEventListener('click', function () {
  if (timerAtualizacao === null) {
    iniciarAtualizacao();
  } else {
    pararAtualizacao();
  }
});

document.getElementById('btn-agora').addEventListener('click', atualizar);

// TODO: usar o evento 'visibilitychange' do document: se document.hidden → pararAtualizacao(); se voltou e o usuário tinha ligado a atualização → iniciarAtualizacao()

atualizarInfo();
