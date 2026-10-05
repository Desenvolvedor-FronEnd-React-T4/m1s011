/* ==========================================================================
   app.js — o "maestro": liga eventos, storage, API e tela
   Fluxo: evento → (storage/api) → renderizar
   ========================================================================== */

const MINUTO = 60 * 1000;
const VALIDADE_CACHE = 10 * MINUTO;   // dado com menos de 10 min é considerado fresco

let cidadeAtual = null;               // objeto { nome, latitude, longitude } selecionado
let unidade = carregarUnidade();      // 'celsius' | 'fahrenheit' (vem do localStorage)
let timerAtualizacao = null;          // id do setInterval (nunca criar 2!)

/* ------------------------------------------------------------------
   Mensagem amigável a partir do erro (o usuário não precisa ver stack)
   ------------------------------------------------------------------ */
function mensagemDeErro(erro) {
  if (erro && erro.name === 'AbortError') {
    return 'A busca demorou demais. Tente de novo.';
  }
  return 'Não foi possível carregar. Tente de novo.';
}

/* ------------------------------------------------------------------
   Redesenha lista + card a partir do que está salvo
   ------------------------------------------------------------------ */
function atualizarTela() {
  const cidades = carregarCidades();
  const cache = lerCache();
  renderizarLista(
    cidades,
    cidadeAtual && cidadeAtual.nome,
    unidade,
    cache,
    selecionarCidade,
    excluirCidade
  );

  const dado = cidadeAtual && cache[cidadeAtual.nome];
  if (dado) {
    renderizarCard({ nome: cidadeAtual.nome, ...dado }, unidade);
  } else {
    limparCard();
  }
}

/* ------------------------------------------------------------------
   Busca o clima de UMA cidade com os 3 estados + cache + fallback offline
   ------------------------------------------------------------------ */
async function carregarClima(cidade, forcar) {
  // TODO: usar cache fresco quando possível; senão mostrar "Carregando…", buscarClima, salvarNoCache e "sucesso"; no catch mostrar erro amigável (ou o dado em cache com aviso de "sem conexão").
}

/* ------------------------------------------------------------------
   Ações do usuário
   ------------------------------------------------------------------ */
function selecionarCidade(cidade) {
  cidadeAtual = cidade;
  carregarClima(cidade, false);
}

function excluirCidade(cidade) {
  removerCidade(cidade.nome);
  if (cidadeAtual && cidadeAtual.nome === cidade.nome) {
    cidadeAtual = null;
  }
  atualizarTela();
  mostrarAviso(cidade.nome + ' removida.');
}

// Adiciona à lista e já mostra o clima
function adicionarEMostrar(cidade) {
  const salvou = adicionarCidade(cidade);
  cidadeAtual = cidade;
  if (salvou) {
    atualizarTela();                                // mostra a cidade na lista já
  }
  carregarClima(cidade, false);
}

/* ⭐ Busca por nome: Geocoding → Forecast */
async function aoBuscar(evento) {
  evento.preventDefault();                          // não recarregar a página
  const campo = document.getElementById('input-cidade');
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
    campo.value = '';
    adicionarEMostrar(cidade);
  } catch (erro) {
    mostrarStatus(mensagemDeErro(erro), 'erro');
  }
}

/* Browser API: Geolocation (pede permissão; só funciona em contexto seguro) */
function usarMinhaLocalizacao() {
  // TODO: verificar navigator.geolocation; getCurrentPosition(sucesso, erro, { timeout: 10000 }); no erro avisar e focar o campo de busca (fallback).
}

/* ------------------------------------------------------------------
   Atualização automática (setInterval) — UM timer só
   ------------------------------------------------------------------ */
async function atualizarTudo() {
  // TODO: buscar o clima de TODAS as cidades em paralelo (Promise.all), cada uma com seu try/catch; salvar no cache, redesenhar e escrever a hora da última atualização.
}

function pararAtualizacao() {
  clearInterval(timerAtualizacao);
  timerAtualizacao = null;
}

function iniciarAtualizacao() {
  // TODO: chamar pararAtualizacao() antes (nunca 2 timers) e guardar em timerAtualizacao o setInterval(atualizarTudo, 10 * MINUTO).
}

/* ------------------------------------------------------------------
   Inicialização
   ------------------------------------------------------------------ */
function iniciar() {
  // Unidade salva → marcar o rádio certo
  document.querySelector('input[name="unidade"][value="' + unidade + '"]').checked = true;

  // Eventos
  document.getElementById('form-busca').addEventListener('submit', aoBuscar);
  document.getElementById('btn-localizacao').addEventListener('click', usarMinhaLocalizacao);

  document.querySelectorAll('.btn-sugestao').forEach(function (botao) {
    botao.addEventListener('click', function () {
      adicionarEMostrar({
        nome: botao.dataset.nome,
        latitude: Number(botao.dataset.lat),        // dataset sempre devolve string
        longitude: Number(botao.dataset.lon)
      });
    });
  });

  document.querySelectorAll('input[name="unidade"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      unidade = radio.value;
      salvarUnidade(unidade);                       // lembra após o F5
      atualizarTela();                              // sem novo fetch: só reformata
    });
  });

  document.getElementById('btn-limpar').addEventListener('click', function () {
    limparTudo();
    cidadeAtual = null;
    atualizarTela();
    mostrarAviso('Lista limpa.');
  });

  const chkAuto = document.getElementById('chk-auto');
  chkAuto.checked = carregarAuto();
  chkAuto.addEventListener('change', function () {
    salvarAuto(chkAuto.checked);
    if (chkAuto.checked) {
      iniciarAtualizacao();
    } else {
      pararAtualizacao();
    }
  });
  if (chkAuto.checked) {
    iniciarAtualizacao();
  }

  // Aba escondida → pausa o timer; ao voltar, atualiza na hora e recomeça
  document.addEventListener('visibilitychange', function () {
    if (!chkAuto.checked) {
      return;
    }
    if (document.hidden) {
      pararAtualizacao();
    } else {
      atualizarTudo();
      iniciarAtualizacao();
    }
  });

  // Primeira pintura a partir do que estava salvo (sobrevive ao F5)
  const cidades = carregarCidades();
  if (cidades.length > 0) {
    cidadeAtual = cidades[0];
  }
  atualizarTela();
  if (cidadeAtual) {
    carregarClima(cidadeAtual, false);
  }
}

iniciar();
