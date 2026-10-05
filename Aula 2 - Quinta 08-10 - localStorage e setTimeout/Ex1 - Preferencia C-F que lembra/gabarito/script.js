/* ==========================================================================
   Exercício 1 — Preferência °C/°F persistida (quinta 08/10)
   Conceitos: localStorage.setItem / getItem / removeItem, valor padrão com ||,
   chave com prefixo ("previsaocerta:") e inspeção no DevTools.
   ========================================================================== */

// Prefixo evita colisão com outras chaves do mesmo site
const CHAVE = 'previsaocerta:unidade';
const TEMPERATURA_C = 24;     // dado fixo, em Celsius (na sexta virá da API)

const saida = document.getElementById('temperatura');
const radios = document.querySelectorAll('input[name="unidade"]');
const espelho = document.getElementById('espelho');

// ✔ Passo: escrever carregarUnidade(): ler a chave com getItem e devolver 'celsius' quando ainda não houver nada (use ||)
function carregarUnidade() {
  // getItem devolve null se a chave não existe; "|| 'celsius'" vira o valor padrão da 1ª visita
  return localStorage.getItem(CHAVE) || 'celsius';
}

// ✔ Passo: escrever salvarUnidade(unidade): gravar a escolha com setItem
function salvarUnidade(unidade) {
  // O valor do localStorage é SEMPRE string — aqui já é uma string, então não precisa de JSON
  localStorage.setItem(CHAVE, unidade);
}

// Converte e formata: 24 °C → "24°C" ou "75°F"
function formatar(unidade) {
  if (unidade === 'fahrenheit') {
    return Math.round(TEMPERATURA_C * 9 / 5 + 32) + '°F';
  }
  return TEMPERATURA_C + '°C';
}

// Mostra no painel o que o localStorage guarda de verdade
function atualizarEspelho() {
  const valor = localStorage.getItem(CHAVE);
  // JSON.stringify(valor) mostra aspas em strings e "null" quando a chave não existe
  espelho.textContent = CHAVE + ' = ' + JSON.stringify(valor);
}

function aplicar(unidade) {
  saida.textContent = formatar(unidade);
  radios.forEach(function (radio) {
    radio.checked = radio.value === unidade;     // marca o rádio da unidade ativa
  });
  atualizarEspelho();
}

// Evento: ao trocar o rádio → salvar e redesenhar
radios.forEach(function (radio) {
  radio.addEventListener('change', function () {
    // ✔ Passo: ao trocar o rádio: salvar a unidade escolhida e chamar aplicar(radio.value)
    salvarUnidade(radio.value);
    aplicar(radio.value);
  });
});

document.getElementById('btn-apagar').addEventListener('click', function () {
  localStorage.removeItem(CHAVE);                // apaga SÓ esta chave (clear() apagaria tudo do site)
  aplicar(carregarUnidade());                    // volta ao padrão 'celsius'
});

// Início da página: lê o que estava salvo (sobrevive ao F5 e ao fechar a aba)
aplicar(carregarUnidade());
