# Exercício 1 — Auditoria do portal "Agro em Foco" (div soup)

**Aula:** terça 06/10 · **Tempo:** 25 min · **Em dupla** · **Slides:** 8–23 do deck M1S11

## Situação
A IA gerou uma página de notícias que **parece pronta**. Sua missão é auditar o HTML,
medir com o Lighthouse e consertar **sem mudar nenhum pixel** (o `style.css` é o mesmo nas duas versões).

## Passo a passo
1. Abra `exercicio/index.html` com o Live Server.
2. `F12` › aba **Lighthouse** › marque **Accessibility** e **SEO** › modo Desktop › **Analyze**.
   **Anote as duas notas** (antes).
3. Use o checklist abaixo e corrija o HTML:

| # | Pergunta de auditoria | Onde olhar |
|---|-----------------------|------------|
| 1 | A `<html>` tem `lang="pt-BR"`? | topo do arquivo |
| 2 | Existe `<title>` e `<meta name="description">`? | `<head>` |
| 3 | Existe **um só** `<h1>`? Os títulos descem sem pular nível? | corpo |
| 4 | As regiões usam `header`, `nav`, `main`, `footer` (e não só `div`)? | corpo |
| 5 | Todo `<input>` tem `<label for>` ligado ao `id`? | formulário |
| 6 | Imagem decorativa tem `alt=""` e a informativa tem `alt` descritivo? | `<img>` |
| 7 | Os "botões" e "links" são `<button>` e `<a>` de verdade? | menu e formulário |
| 8 | Dá para usar a página só com **Tab/Enter**? Onde está o foco? | teclado |

4. Rode o Lighthouse de novo. **Pronto quando:** Acessibilidade e SEO acima de **90**
   e vocês conseguem **justificar cada conserto** em uma frase.
5. Compare com `gabarito/index.html` (19 correções comentadas).

## ⭐ Estrela
- Navegue pela página usando **apenas o teclado** (Tab / Shift+Tab / Enter).
- Ligue o **Narrador** do Windows (`Ctrl + Win + Enter`) e ouça a página antes e depois.

## Pergunta de fechamento
> Por que a nota subiu se a página ficou **visualmente idêntica**?

*Resposta esperada:* a máquina (leitor de tela, Google) entende a **estrutura e o significado** das tags, não a pintura do CSS.

## Nota para o professor
Os atributos `href="#"` são só placeholders do exercício. O Lighthouse pode apontar "links sem destino
descritivo" em alguns casos; se isso acontecer, é um bom gancho para conversar sobre `href` real.
Cores usadas no `style.css`: branco sobre `#1b5e20`/`#2e7d32` (contraste ≥ 5,1:1).
