/* ==========================================================================
   Exercício 2 — Validação ACESSÍVEL (terça 06/10)
   Ideia: erro não é só "ficar vermelho". Precisa (1) dizer em TEXTO o que está errado,
   (2) estar LIGADO ao campo (aria-describedby / aria-invalid) e (3) ser ANUNCIADO (role="alert").
   ========================================================================== */

const form = document.getElementById('form-rota');
const resumo = document.getElementById('resumo');
const sucesso = document.getElementById('sucesso');

// Regras: id do campo → mensagem quando estiver vazio
const regras = {
  origem: 'Informe a cidade de origem.',
  destino: 'Informe a cidade de destino.',
  data: 'Escolha a data da coleta.',
  carga: 'Selecione o tipo de carga.'
};

/* Mostra OU limpa o erro de UM campo */
function marcarCampo(id, mensagem) {
  const campo = document.getElementById(id);
  const erro = document.getElementById('erro-' + id);

  if (mensagem) {
    erro.textContent = mensagem;
    erro.hidden = false;
    // TODO: marcar o campo como inválido: campo.setAttribute('aria-invalid', 'true') e ligar a mensagem com aria-describedby
  } else {
    erro.hidden = true;
    erro.textContent = '';
    campo.removeAttribute('aria-invalid');
    campo.removeAttribute('aria-describedby');
  }
}

form.addEventListener('submit', function (evento) {
  evento.preventDefault();                  // impede o envio/recarregamento da página
  sucesso.hidden = true;

  const invalidos = [];                     // ids dos campos com problema

  Object.keys(regras).forEach(function (id) {
    const valor = document.getElementById(id).value.trim();
    if (valor === '') {
      marcarCampo(id, regras[id]);
      invalidos.push(id);
    } else {
      marcarCampo(id, '');
    }
  });

  // Regra extra: origem e destino não podem ser a mesma cidade
  const origem = document.getElementById('origem').value.trim().toLowerCase();
  const destino = document.getElementById('destino').value.trim().toLowerCase();
  if (origem !== '' && origem === destino) {
    marcarCampo('destino', 'O destino precisa ser diferente da origem.');
    invalidos.push('destino');
  }

  if (invalidos.length > 0) {
    // TODO: preencher o resumo (resumo.textContent) com a quantidade de erros, mostrar (hidden = false) e focar o 1º campo inválido (.focus())
    return;
  }

  // Caminho feliz
  resumo.hidden = true;
  sucesso.textContent = 'Rota cadastrada com sucesso: ' + document.getElementById('origem').value
    + ' → ' + document.getElementById('destino').value + '.';
  sucesso.hidden = false;
  form.reset();
});
