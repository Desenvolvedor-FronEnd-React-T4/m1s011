/* ==========================================================================
   Exercício 3 — setTimeout + sessionStorage × localStorage + limites (quinta 08/10)
   Conceitos: setTimeout/clearTimeout (Browser API), aviso acessível que some,
   rascunho (sessionStorage) × publicado (localStorage), try/catch no setItem.
   ========================================================================== */

const CHAVE_RASCUNHO = 'previsaocerta:rascunho-aviso';   // sessionStorage: some ao fechar a aba
const CHAVE_PUBLICADO = 'previsaocerta:aviso';           // localStorage: continua nas próximas visitas

const campo = document.getElementById('texto-aviso');
const elStatus = document.getElementById('status');
const elPublicado = document.getElementById('publicado');

/* ---------- setTimeout: aviso que SOME sozinho ---------- */

let timerAviso = null;     // guarda o id do timer para poder cancelar

function mostrarAviso(texto, tipo) {
  // ✔ Passo: cancelar o timer anterior com clearTimeout(timerAviso) — senão o aviso novo pode sumir cedo demais
  clearTimeout(timerAviso);
  elStatus.className = 'status ' + tipo;     // 'sucesso' ou 'erro'
  elStatus.textContent = texto;              // a região aria-live anuncia a mensagem
  elStatus.hidden = false;

  // Erro NÃO some sozinho: o usuário precisa ter tempo de ler (acessibilidade)
  if (tipo === 'sucesso') {
    // ✔ Passo: agendar com setTimeout (3000 ms) uma função que esconde o aviso (hidden = true) e guarde o id em timerAviso
    timerAviso = setTimeout(function () {
      elStatus.hidden = true;
      elStatus.textContent = '';
    }, 3000);                                // 3000 ms = 3 segundos (o tempo é em MILISSEGUNDOS)
  }
}

/* ---------- localStorage com proteção (try/catch) ---------- */

// setItem pode lançar erro: cota cheia (~5 MB) ou navegador com armazenamento bloqueado
function salvarSeguro(chave, valor) {
  try {
    localStorage.setItem(chave, valor);
    return true;
  } catch (erro) {
    return false;
  }
}

/* ---------- Rascunho (sessionStorage) ---------- */

// ✔ Passo: a cada digitação (evento 'input') gravar o texto em sessionStorage com a chave CHAVE_RASCUNHO
campo.addEventListener('input', function () {
  sessionStorage.setItem(CHAVE_RASCUNHO, campo.value);   // mesma API do localStorage, mas some ao fechar a aba
});

/* ---------- Publicar (localStorage) ---------- */

function mostrarPublicado() {
  elPublicado.textContent = localStorage.getItem(CHAVE_PUBLICADO) || '(nenhum aviso publicado ainda)';
}

document.getElementById('btn-publicar').addEventListener('click', function () {
  const texto = campo.value.trim();
  if (texto === '') {
    mostrarAviso('Escreva o aviso antes de publicar.', 'erro');
    campo.focus();
    return;
  }

  // ✔ Passo: publicar com salvarSeguro(CHAVE_PUBLICADO, texto): se der certo, mostrarAviso('Aviso publicado.', 'sucesso') e mostrarPublicado(); se falhar, mostrarAviso(..., 'erro')
  if (salvarSeguro(CHAVE_PUBLICADO, texto)) {
    mostrarAviso('Aviso publicado.', 'sucesso');
    mostrarPublicado();
    sessionStorage.removeItem(CHAVE_RASCUNHO);   // o rascunho já virou aviso
    campo.value = '';
  } else {
    mostrarAviso('Não foi possível salvar o aviso neste navegador.', 'erro');
  }
});

/* ---------- Testar o limite (~5 MB) ---------- */

document.getElementById('btn-limite').addEventListener('click', function () {
  const enorme = 'x'.repeat(12 * 1024 * 1024);   // ~12 milhões de caracteres: estoura a cota
  const ok = salvarSeguro('previsaocerta:teste-cota', enorme);
  localStorage.removeItem('previsaocerta:teste-cota');   // limpa a sujeira se por acaso coube
  if (ok) {
    mostrarAviso('Este navegador aceitou 12 milhões de caracteres (limite alto).', 'sucesso');
  } else {
    mostrarAviso('Limite atingido: o setItem falhou e o try/catch evitou que a página quebrasse.', 'erro');
  }
});

/* ---------- Início da página ---------- */

// Recupera o rascunho (só existe se a aba NÃO foi fechada) e o aviso publicado
campo.value = sessionStorage.getItem(CHAVE_RASCUNHO) || '';
mostrarPublicado();
