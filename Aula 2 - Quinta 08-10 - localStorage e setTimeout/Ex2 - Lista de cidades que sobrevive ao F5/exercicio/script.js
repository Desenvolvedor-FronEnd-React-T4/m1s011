/* ==========================================================================
   Exercício 2 — Lista de cidades que sobrevive ao F5 (quinta 08/10)
   Conceitos: JSON.stringify / JSON.parse, o null da 1ª visita (|| []),
   filter para remover, removeItem para limpar, renderizar a partir do "banco".
   ========================================================================== */

const CHAVE = 'previsaocerta:cidades';

const form = document.getElementById('form-cidade');
const campo = document.getElementById('input-cidade');
const lista = document.getElementById('lista');
const vazio = document.getElementById('msg-vazio');
const bruto = document.getElementById('bruto');
const elStatus = document.getElementById('status');

/* ---------- "Banco de dados" (localStorage) ---------- */

// TODO: escrever carregarCidades(): getItem + JSON.parse, devolvendo [] na 1ª visita (JSON.parse(null) é null!)

// TODO: escrever salvarCidades(cidades): setItem com JSON.stringify (o localStorage só guarda texto)

function adicionarCidade(nome) {
  const cidades = carregarCidades();
  // Evita duplicata ignorando maiúsculas/minúsculas
  const existe = cidades.some(function (c) {
    return c.nome.toLowerCase() === nome.toLowerCase();
  });
  if (existe) {
    return false;
  }
  cidades.push({ nome: nome, adicionadaEm: new Date().toISOString() });
  salvarCidades(cidades);
  return true;
}

// TODO: escrever removerCidade(nome): filtrar fora a cidade, salvar o que sobrou

function limparTudo() {
  localStorage.removeItem(CHAVE);              // apaga só ESTA chave (clear() apagaria todas do site)
}

/* ---------- Tela ---------- */

function mostrarStatus(texto) {
  elStatus.textContent = texto;                  // a região aria-live anuncia a mudança
  elStatus.hidden = false;
}

// TODO: escrever renderizarLista(): limpar a <ul>, criar um <li> por cidade (createElement/classList/textContent) com botão Remover (aria-label com o nome)

/* ---------- Eventos ---------- */

form.addEventListener('submit', function (evento) {
  evento.preventDefault();
  const nome = campo.value.trim();
  if (nome === '') {
    mostrarStatus('Digite o nome de uma cidade.');
    campo.focus();
    return;
  }
  if (adicionarCidade(nome)) {
    mostrarStatus(nome + ' adicionada.');
  } else {
    mostrarStatus(nome + ' já está na lista.');
  }
  campo.value = '';
  campo.focus();                               // devolve o foco ao campo (teclado)
  renderizarLista();
});

document.getElementById('btn-limpar').addEventListener('click', function () {
  limparTudo();
  renderizarLista();
  mostrarStatus('Lista limpa.');
});

// Início: desenha o que estava salvo (a lista sobrevive ao F5)
renderizarLista();
