# Exercício 1 — Preferência °C/°F que lembra (localStorage básico)

**Aula:** quinta 08/10 · **Tempo:** 15 min · **Individual** · **Slides:** 28–32 (setItem/getItem, valor padrão)

## Situação
O despachante prefere Fahrenheit... mas a página esquece a escolha a cada **F5**. Dê memória a ela.

## O que fazer (procure os `TODO` em `exercicio/script.js`)
1. `carregarUnidade()` → `localStorage.getItem(CHAVE)` com valor padrão `'celsius'` (`||`).
2. `salvarUnidade(unidade)` → `localStorage.setItem(CHAVE, unidade)`.
3. No evento `change` do rádio: salvar e redesenhar.

## Como testar
- Escolha °F, dê **F5** → continua °F. Feche a aba, abra de novo → continua °F.
- `F12 › Application › Local Storage › http://127.0.0.1:5500` → a chave `previsaocerta:unidade` aparece **na hora**.
- Clique em **Apagar a chave** → volta para °C (é a "1ª visita" de novo).
- No Console: `localStorage.getItem('previsaocerta:unidade')` e depois `typeof` do resultado → sempre `'string'`.

**Pronto quando:** a unidade sobrevive ao F5 e a chave aparece na aba Application.

## Perguntas de fixação
1. O que `getItem` devolve quando a chave não existe? → `null` (por isso o `|| 'celsius'`).
2. Por que a chave começa com `previsaocerta:`? → evita colisão com outras chaves do mesmo site/origem.
3. Posso guardar o token de login aqui? → **Não**: qualquer pessoa lê no DevTools.

## ⭐ Estrela
- Salve também a **última cidade vista** (`previsaocerta:ultima-cidade`) e mostre no título.
- Explique por que `localStorage.clear()` seria um erro aqui.
