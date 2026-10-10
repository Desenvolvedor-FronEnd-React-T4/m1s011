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
  const cache = lerCache();
  const emCache = cache[cidade.nome];

  // Cache fresco e ninguém pediu atualização forçada → resposta instantânea
  if (!forcar && cacheFresco(emCache, VALIDADE_CACHE)) {
    esconderStatus();
    atualizarTela();
    return;
  }

  mostrarStatus('Carregando clima de ' + cidade.nome + '…', 'carregando');   // estado 1

  try {
    const clima = await buscarClima(cidade.latitude, cidade.longitude);
    salvarNoCache(cidade.nome, clima);
    mostrarStatus('Clima de ' + cidade.nome + ' atualizado.', 'sucesso');    // estado 2
    atualizarTela();
  } catch (erro) {
    if (emCache) {
      // Sem rede, mas temos o último dado salvo: mostrar com aviso honesto
      mostrarStatus('Sem conexão. Mostrando o último dado salvo de '
        + cidade.nome + ' (' + formatarHora(emCache.hora) + ').', 'erro');
      atualizarTela();
    } else {
      mostrarStatus(mensagemDeErro(erro), 'erro');                           // estado 3
    }
  }
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
  if (!navigator.geolocation) {
    mostrarStatus('Seu navegador não tem localização. Busque pelo nome da cidade.', 'erro');
    document.getElementById('input-cidade').focus();
    return;
  }

  mostrarStatus('Obtendo sua localização…', 'carregando');
  navigator.geolocation.getCurrentPosition(
    function (posicao) {                            // sucesso
      adicionarEMostrar({
        nome: 'Minha localização',
        latitude: posicao.coords.latitude,
        longitude: posicao.coords.longitude
      });
    },
    function () {                                   // permissão negada, tempo esgotado etc.
      mostrarStatus('Não foi possível obter sua localização. Busque pelo nome da cidade.', 'erro');
      document.getElementById('input-cidade').focus();   // fallback: busca manual
    },
    { timeout: 10000 }
  );
}

/* ------------------------------------------------------------------
   Atualização automática (setInterval) — UM timer só
   ------------------------------------------------------------------ */
async function atualizarTudo() {
  const cidades = carregarCidades();
  if (cidades.length === 0) {
    return;
  }
  mostrarStatus('Atualizando ' + cidades.length + ' cidade(s)…', 'carregando');

  // Promise.all dispara todas juntas; cada uma trata o PRÓPRIO erro (uma falha não derruba as outras)
  const resultados = await Promise.all(cidades.map(async function (cidade) {
    try {
      const clima = await buscarClima(cidade.latitude, cidade.longitude);
      salvarNoCache(cidade.nome, clima);
      return true;
    } catch (erro) {
      return false;
    }
  }));

  const falhas = resultados.filter(function (ok) { return !ok; }).length;
  atualizarTela();
  document.getElementById('ultima-atualizacao').textContent =
    'Última atualização às ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }) + '.';

  if (falhas > 0) {
    mostrarStatus(falhas + ' cidade(s) não puderam ser atualizadas.', 'erro');
  } else {
    mostrarAviso('Painel atualizado.');
  }
}

function pararAtualizacao() {
  clearInterval(timerAtualizacao);
  timerAtualizacao = null;
}

function iniciarAtualizacao() {
  pararAtualizacao();                               // nunca deixar 2 timers vivos
  timerAtualizacao = setInterval(atualizarTudo, 10 * MINUTO);
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
