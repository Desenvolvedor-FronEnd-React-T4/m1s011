/* ==========================================================================
   storage.js — a "memória" do painel (localStorage)  | Aula de quinta (08/10)
   Regras de ouro:
   1) o localStorage só guarda STRING → JSON.stringify ao salvar, JSON.parse ao ler
   2) na 1ª visita a chave não existe → getItem devolve null → use "|| []"
   3) nunca guardar token, senha ou CPF aqui (qualquer um lê no DevTools)
   ========================================================================== */

// Prefixo "previsaocerta:" evita colisão com outras chaves do mesmo site
const CHAVE_CIDADES = 'previsaocerta:cidades';
const CHAVE_UNIDADE = 'previsaocerta:unidade';
const CHAVE_CACHE = 'previsaocerta:cache';
const CHAVE_AUTO = 'previsaocerta:auto';

/* ---------- Cidades monitoradas (array de objetos) ---------- */

function carregarCidades() {
  // TODO: ler a chave CHAVE_CIDADES com getItem, converter com JSON.parse e devolver [] na 1ª visita (JSON.parse(null) é null!). Use try/catch para JSON corrompido.
}

function salvarCidades(cidades) {
  // TODO: gravar com setItem + JSON.stringify; devolver true/false (try/catch: cota cheia ou armazenamento bloqueado).
}

// Devolve false se a cidade já estava na lista (evita duplicata)
function adicionarCidade(cidade) {
  // TODO: carregar a lista, impedir duplicata (nome sem diferenciar maiúsculas) com some(), dar push e salvar. Devolva false se já existia.
}

function removerCidade(nome) {
  // TODO: usar filter para manter todas as cidades menos a removida e salvar o resultado.
}

function limparTudo() {
  // TODO: removeItem das chaves de cidades e de cache (NÃO use localStorage.clear()).
}

/* ---------- Preferência de unidade (string simples) ---------- */

function carregarUnidade() {
  // TODO: devolver o valor salvo em CHAVE_UNIDADE ou 'celsius' quando não houver nada (||).
}

function salvarUnidade(unidade) {
  // TODO: gravar a unidade com setItem (dentro de try/catch).
}

/* ---------- Atualização automática ligada/desligada ---------- */

function carregarAuto() {
  try {
    return localStorage.getItem(CHAVE_AUTO) === 'true';
  } catch (erro) {
    return false;
  }
}

function salvarAuto(ligado) {
  try {
    localStorage.setItem(CHAVE_AUTO, String(ligado));
  } catch (erro) {
    /* ignora */
  }
}

/* ---------- Cache da última resposta da API (objeto indexado por cidade) ---------- */

function lerCache() {
  // TODO: ler o objeto de cache (JSON.parse(...) || {}) com try/catch.
}

function salvarNoCache(nome, dado) {
  // TODO: guardar o dado indexado pelo nome da cidade com o carimbo salvoEm: Date.now().
}

// Fresco = salvo há menos de "limiteMs" milissegundos
function cacheFresco(entrada, limiteMs) {
  return Boolean(entrada) && Date.now() - entrada.salvoEm < limiteMs;
}
