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
  mostrarStatus(texto, 'sucesso');
  timerAviso = setTimeout(esconderStatus, 3000);   // 3000 ms = 3 s
}

/* ---------- Lista de cidades ---------- */

function formatarHora(iso) {
  // "2026-10-09T09:30" → "09:30" (a API já devolve a hora local da cidade)
  return iso ? iso.slice(11, 16) : '—';
}

/* Redesenha a <ul> inteira a partir do array (a "verdade" está no localStorage). */
function renderizarLista(cidades, ativa, unidade, cache, aoSelecionar, aoRemover) {
  const lista = document.getElementById('lista-cidades');
  lista.innerHTML = '';                     // limpa antes de recriar
  document.getElementById('msg-vazio').hidden = cidades.length > 0;

  cidades.forEach(function (cidade) {
    const item = document.createElement('li');
    item.classList.add('cidade-item');
    if (cidade.nome === ativa) {
      item.classList.add('ativa');
    }

    const nome = document.createElement('span');
    nome.classList.add('cidade-nome');
    nome.textContent = cidade.nome;

    // Resumo curto vindo do cache (se já buscamos o clima desta cidade)
    const mini = document.createElement('span');
    mini.classList.add('cidade-mini');
    const dado = cache[cidade.nome];
    if (dado) {
      const cond = decodificarTempo(dado.codigo);
      mini.textContent = cond.icone + ' ' + formatarTemperatura(dado.temperatura, unidade)
        + ' · ' + cond.texto;
    } else {
      mini.textContent = 'Clima ainda não carregado';
    }

    const acoes = document.createElement('div');
    acoes.classList.add('cidade-acoes');

    const btnVer = document.createElement('button');
    btnVer.type = 'button';
    btnVer.classList.add('btn', 'btn-secundario');
    btnVer.textContent = 'Ver clima';
    // aria-label dá um nome único ao botão (vários "Ver clima" na mesma tela)
    btnVer.setAttribute('aria-label', 'Ver clima de ' + cidade.nome);
    btnVer.addEventListener('click', function () { aoSelecionar(cidade); });

    const btnRemover = document.createElement('button');
    btnRemover.type = 'button';
    btnRemover.classList.add('btn', 'btn-perigo', 'btn-remover');
    btnRemover.textContent = 'Remover';
    btnRemover.setAttribute('aria-label', 'Remover ' + cidade.nome);
    btnRemover.addEventListener('click', function () { aoRemover(cidade); });

    acoes.append(btnVer, btnRemover);
    item.append(nome, mini, acoes);
    lista.appendChild(item);
  });
}

/* ---------- Card de clima ---------- */

function renderizarCard(dado, unidade) {
  const card = document.getElementById('card-clima');
  const cond = decodificarTempo(dado.codigo);

  card.querySelector('.card-cidade').textContent = dado.nome || 'Clima atual';
  card.querySelector('.card-temp').textContent = formatarTemperatura(dado.temperatura, unidade);
  card.querySelector('.card-desc').textContent = cond.icone + ' ' + cond.texto;

  const hora = card.querySelector('.card-hora');
  hora.textContent = formatarHora(dado.hora);
  if (dado.hora) {
    hora.setAttribute('datetime', dado.hora);       // formato legível por máquina
  }
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
