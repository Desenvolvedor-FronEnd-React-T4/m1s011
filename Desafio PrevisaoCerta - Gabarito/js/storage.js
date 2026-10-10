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
  try {
    // 1ª visita: getItem → null; JSON.parse(null) → null; "|| []" devolve array vazio
    return JSON.parse(localStorage.getItem(CHAVE_CIDADES)) || [];
  } catch (erro) {
    // JSON corrompido (alguém editou no DevTools) ou armazenamento bloqueado
    return [];
  }
}

function salvarCidades(cidades) {
  try {
    localStorage.setItem(CHAVE_CIDADES, JSON.stringify(cidades));
    return true;
  } catch (erro) {
    // Cota cheia ou navegador com armazenamento bloqueado
    return false;
  }
}

// Devolve false se a cidade já estava na lista (evita duplicata)
function adicionarCidade(cidade) {
  const cidades = carregarCidades();
  const jaExiste = cidades.some(function (c) {
    return c.nome.toLowerCase() === cidade.nome.toLowerCase();
  });
  if (jaExiste) {
    return false;
  }
  cidades.push(cidade);
  return salvarCidades(cidades);
}

function removerCidade(nome) {
  // filter devolve um array novo SEM a cidade removida
  const restantes = carregarCidades().filter(function (c) {
    return c.nome !== nome;
  });
  salvarCidades(restantes);
}

function limparTudo() {
  // removeItem apaga só as chaves do painel; clear() apagaria TODAS as chaves do site
  localStorage.removeItem(CHAVE_CIDADES);
  localStorage.removeItem(CHAVE_CACHE);
}

/* ---------- Preferência de unidade (string simples) ---------- */

function carregarUnidade() {
  try {
    return localStorage.getItem(CHAVE_UNIDADE) || 'celsius';   // default na 1ª visita
  } catch (erro) {
    return 'celsius';
  }
}

function salvarUnidade(unidade) {
  try {
    localStorage.setItem(CHAVE_UNIDADE, unidade);
  } catch (erro) {
    /* sem armazenamento: a preferência vale só nesta visita */
  }
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
  try {
    return JSON.parse(localStorage.getItem(CHAVE_CACHE)) || {};
  } catch (erro) {
    return {};
  }
}

function salvarNoCache(nome, dado) {
  const cache = lerCache();
  // "salvoEm" permite saber se o dado está fresco (ver cacheFresco)
  cache[nome] = Object.assign({}, dado, { salvoEm: Date.now() });
  try {
    localStorage.setItem(CHAVE_CACHE, JSON.stringify(cache));
  } catch (erro) {
    /* cota cheia: seguimos sem cache */
  }
}

// Fresco = salvo há menos de "limiteMs" milissegundos
function cacheFresco(entrada, limiteMs) {
  return Boolean(entrada) && Date.now() - entrada.salvoEm < limiteMs;
}
