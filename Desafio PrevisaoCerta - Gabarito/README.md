# PrevisaoCerta — Gabarito (professor)

Versão **completa e comentada** do Desafio da M1S11: painel climático operacional da AgroLog.

## Como rodar
Abra a pasta no VS Code e use o **Live Server** em `index.html` (a Geolocation exige contexto seguro; `localhost`/Live Server servem).

## Arquivos
| Arquivo | Papel |
|---------|-------|
| `index.html` | Estrutura semântica (landmarks, skip link, `label for`, região `aria-live`, card com `dl`/`time`) |
| `css/style.css` | Identidade visual (tokens), mobile-first, foco visível, Grid `auto-fit`, `prefers-reduced-motion` |
| `js/storage.js` | `localStorage`: cidades, unidade, auto-atualização e cache (JSON, `\|\| []`, `try/catch`) |
| `js/api.js` | `fetch` com tempo limite (`AbortController` + `setTimeout`), `response.ok`, Geocoding, Forecast, WMO |
| `js/ui.js` | Status (3 estados), aviso que some em 3 s (`setTimeout`), lista e card |
| `js/app.js` | Eventos, cache, Geolocation com fallback, `setInterval` (um timer só), `visibilitychange` |

## O que foi testado
Em Edge (Chromium) com a API simulada: 1ª visita sem erro, adicionar/remover/limpar, F5, °C/°F, cidade inexistente, 404, rede caída, aviso de 3 s, geolocalização permitida/negada e liga/desliga da atualização automática.
Os testes com a Open-Meteo **real** devem ser repetidos em sala (o ambiente de geração não tinha internet).

Documentos para o aluno: `../Desafio PrevisaoCerta - Documentos do Aluno/`.
