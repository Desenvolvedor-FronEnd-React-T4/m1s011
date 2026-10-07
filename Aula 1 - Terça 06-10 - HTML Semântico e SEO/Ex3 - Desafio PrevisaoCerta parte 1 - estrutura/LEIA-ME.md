# Exercício 3 — Desafio PrevisaoCerta, parte 1: a estrutura semântica

**Aula:** terça 06/10 · **Tempo:** 50 min (live coding com o professor) · **Slides:** 5–23

Este é o exercício de conteúdo **e** o início do Desafio AgroLog: você aplica, no projeto real, tudo o que viu hoje
(landmarks, títulos, `label for`, `alt`, skip link, `aria-live`, SEO e contraste). O CSS (identidade visual) e as imagens **já vêm prontos** em `exercicio/`.

## Antes de codar (3 min) — Excalidraw
Desenhe no [Excalidraw](https://excalidraw.com/) as regiões: `header › nav`, `main › section(buscar) · section(cidades) · article(card) · aside`, `footer`.
**Cada caixa do desenho vira uma tag.**

## Passo a passo (siga os `TODO` de `exercicio/index.html`)
| Min | Etapa |
|-----|-------|
| 0–5 | Abrir a pasta no VS Code, Live Server, ligar o CSS |
| 5–13 | `<head>`: lang, viewport, title, description, Open Graph, favicon |
| 13–20 | Skip link + `<header>` + `<nav>` |
| 20–32 | `<main>`: status (aria-live), busca (form role="search"), sugestões, unidade |
| 32–40 | Cidades, card de clima (article/dl/time), aside, footer |
| 40–47 | Lighthouse (Acessibilidade e SEO), teste com Tab e Narrador, contraste |
| 47–50 | Comparar com `gabarito/` e salvar |

## O mapa do exercício (era → vira)
| Em vez de… | Use… | Por quê |
|------------|------|---------|
| `div.cabecalho` | `header` | landmark "banner" |
| `div.menu` + `span` | `nav aria-label` + `a` | links navegáveis e região rotulada |
| 2º `h1` | `p` | um só `h1` por página |
| `div.conteudo` | `main` | conteúdo principal (um por página) |
| `div` de formulário | `form role="search"` + `label for` | campo com nome anunciado |
| `div.btn` | `button` | foco, Enter e Espaço de graça |
| vários `div.item` | `ul > li` | "lista com 3 itens" |
| card do clima | `article` + `dl` + `time` | conteúdo independente e datado |
| `alt="logo"` / `alt="imagem"` | `alt=""` (decorativo) / `alt="Céu limpo"` (informativo) | cada imagem com o papel certo |

**Pronto quando:** Lighthouse de Acessibilidade e SEO ≥ 90, um só `h1`, e você navega tudo só com Tab.
Quem não terminar copia `gabarito/` e começa a quinta dele.

## ⭐ Estrela
- Teste a prévia do Open Graph colando o link no WhatsApp Web.
- Confira o contraste do texto cinza (`--texto-suave`) no DevTools: deve ser ≥ 4,5 : 1.
