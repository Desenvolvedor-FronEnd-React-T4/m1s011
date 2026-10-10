/* app.js — CHECKPOINT DE QUINTA: memória (localStorage) + aviso com setTimeout.
   Ainda SEM fetch: o botão "Ver clima" só avisa que o clima real chega na sexta. */

let cidadeAtual = null;
let unidade = carregarUnidade();

function atualizarTela() {
  renderizarLista(carregarCidades(), cidadeAtual && cidadeAtual.nome, unidade, lerCache(), selecionarCidade, excluirCidade);
}

function selecionarCidade(cidade) {
  cidadeAtual = cidade;
  atualizarTela();
  mostrarAviso('Clima real de ' + cidade.nome + ' chega na sexta (fetch).');
}

function excluirCidade(cidade) {
  removerCidade(cidade.nome);
  if (cidadeAtual && cidadeAtual.nome === cidade.nome) {
    cidadeAtual = null;
  }
  atualizarTela();
  mostrarAviso(cidade.nome + ' removida.');
}

function iniciar() {
  document.querySelector('input[name="unidade"][value="' + unidade + '"]').checked = true;

  document.querySelectorAll('.btn-sugestao').forEach(function (botao) {
    botao.addEventListener('click', function () {
      const cidade = { nome: botao.dataset.nome, latitude: Number(botao.dataset.lat), longitude: Number(botao.dataset.lon) };
      if (adicionarCidade(cidade)) {
        mostrarAviso(cidade.nome + ' adicionada.');
      } else {
        mostrarAviso(cidade.nome + ' já está na lista.');
      }
      atualizarTela();
    });
  });

  document.querySelectorAll('input[name="unidade"]').forEach(function (radio) {
    radio.addEventListener('change', function () {
      unidade = radio.value;
      salvarUnidade(unidade);
      atualizarTela();
    });
  });

  document.getElementById('btn-limpar').addEventListener('click', function () {
    limparTudo();
    cidadeAtual = null;
    atualizarTela();
    mostrarAviso('Lista limpa.');
  });

  // Formulário de busca por nome: na sexta (Geocoding)
  document.getElementById('form-busca').addEventListener('submit', function (evento) {
    evento.preventDefault();
    mostrarStatus('Busca por nome chega na sexta (Geocoding).', 'carregando');
  });

  atualizarTela();
}

iniciar();
