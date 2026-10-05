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

// ✔ Passo: escrever carregarCidades(): getItem + JSON.parse, devolvendo [] na 1ª visita (JSON.parse(null) é null!)
function carregarCidades() {
  const texto = localStorage.getItem(CHAVE);   // 1ª visita: null
  return JSON.parse(texto) || [];              // null → [] (sem isso, o forEach quebra)
}

// ✔ Passo: escrever salvarCidades(cidades): setItem com JSON.stringify (o localStorage só guarda texto)
function salvarCidades(cidades) {
  // Sem stringify, o array viraria "[object Object]" — texto inútil
  localStorage.setItem(CHAVE, JSON.stringify(cidades));
}

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

// ✔ Passo: escrever removerCidade(nome): filtrar fora a cidade, salvar o que sobrou
function removerCidade(nome) {
  const restantes = carregarCidades().filter(function (c) {
    return c.nome !== nome;                    // mantém todas, menos a removida
  });
  salvarCidades(restantes);
}

function limparTudo() {
  localStorage.removeItem(CHAVE);              // apaga só ESTA chave (clear() apagaria todas do site)
}

/* ---------- Tela ---------- */

function mostrarStatus(texto) {
  elStatus.textContent = texto;                  // a região aria-live anuncia a mudança
  elStatus.hidden = false;
}

// ✔ Passo: escrever renderizarLista(): limpar a <ul>, criar um <li> por cidade (createElement/classList/textContent) com botão Remover (aria-label com o nome)
function renderizarLista() {
  const cidades = carregarCidades();
  lista.innerHTML = '';                        // limpa antes de recriar
  vazio.hidden = cidades.length > 0;           // mostra a mensagem só se a lista estiver vazia

  cidades.forEach(function (cidade) {
    const item = document.createElement('li');
    item.classList.add('item');

    const nome = document.createElement('span');
    nome.textContent = cidade.nome;            // textContent: seguro (não interpreta HTML)

    const botao = document.createElement('button');
    botao.type = 'button';
    botao.classList.add('btn', 'btn-perigo');
    botao.textContent = 'Remover';
    botao.setAttribute('aria-label', 'Remover ' + cidade.nome);   // nome único para o leitor de tela
    botao.addEventListener('click', function () {
      removerCidade(cidade.nome);
      renderizarLista();
      mostrarStatus(cidade.nome + ' removida.');
    });

    item.append(nome, botao);
    lista.appendChild(item);
  });

  // Painel didático: texto bruto guardado no localStorage
  bruto.textContent = localStorage.getItem(CHAVE) || '(chave inexistente → getItem devolveu null)';
}

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
