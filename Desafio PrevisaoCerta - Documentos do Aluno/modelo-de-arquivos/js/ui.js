/* ==========================================================================
   ui.js — desenha na tela (DOM)  | usa createElement, classList, textContent (S08)
   Nada aqui busca dados nem salva: só recebe informação e mostra.
   ========================================================================== */

const elStatus = document.getElementById('status');
let timerAviso = null;   // id do setTimeout do aviso (para poder cancelar)

/* ---------- Os 3 estados: carregando / sucesso / erro ---------- */

// tipo: 'carregando' | 'sucesso' | 'erro'
function mostrarStatus(texto, tipo) {
  clearTimeout(timerAviso);                 // cancela um aviso anterior que ainda ia sumir
  elStatus.className = 'status ' + tipo;
  elStatus.textContent = texto;             // a região aria-live anuncia a mudança
  elStatus.hidden = false;
}

function esconderStatus() {
  clearTimeout(timerAviso);
  elStatus.hidden = true;
  elStatus.textContent = '';
}

/* Aviso de sucesso que SOME sozinho depois de 3 s (setTimeout).
   Erros NÃO usam esta função: mensagem de erro não deve desaparecer sozinha. */
function mostrarAviso(texto) {
  // TODO: mostrar o texto com mostrarStatus(texto, "sucesso") e agendar com setTimeout (3000 ms) a chamada de esconderStatus; guardar o id em timerAviso.
}

/* ---------- Lista de cidades ---------- */

function formatarHora(iso) {
  // "2026-10-09T09:30" → "09:30" (a API já devolve a hora local da cidade)
  return iso ? iso.slice(11, 16) : '—';
}

/* Redesenha a <ul> inteira a partir do array (a "verdade" está no localStorage). */
function renderizarLista(cidades, ativa, unidade, cache, aoSelecionar, aoRemover) {
  // TODO: limpar a <ul>; para cada cidade criar <li> com nome, resumo do cache, botão "Ver clima" e botão "Remover" (com aria-label); use createElement/classList/textContent/addEventListener.
}

/* ---------- Card de clima ---------- */

function renderizarCard(dado, unidade) {
  // TODO: preencher .card-cidade, .card-temp, .card-desc e o <time> (textContent + datetime) a partir de dado e unidade.
}

function limparCard() {
  const card = document.getElementById('card-clima');
  card.querySelector('.card-cidade').textContent = 'Selecione uma cidade';
  card.querySelector('.card-temp').textContent = '—';
  card.querySelector('.card-desc').textContent = '—';
  const hora = card.querySelector('.card-hora');
  hora.textContent = '—';
  hora.removeAttribute('datetime');
}
