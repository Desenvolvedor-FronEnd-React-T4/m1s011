# Exercício 1 — Clima real com fetch e os 3 estados

**Aula:** sexta 09/10 · **Tempo:** 30 min · **Individual ou dupla** · **Slides:** fetch + await, Open-Meteo, render no DOM, 3 estados, try/catch + response.ok, status HTTP

## Situação
A temperatura "24°C" estava **chumbada** no HTML. Agora o despachante precisa do **clima real**,
vindo de um servidor pela internet — e a página **não pode travar** quando a rede falha.

## O que fazer (procure os `TODO` em `exercicio/script.js`)
1. `decodificarTempo(code)` — a API devolve um **número** (padrão WMO); traduza para texto + emoji.
2. `buscarClima` — montar a URL, `await fetch(url)`, checar `resposta.ok`, `await resposta.json()`.
3. `renderizarCard` — preencher o card com `textContent`; `<time datetime>` com a hora.
4. `try/catch` com os **3 estados**: carregando → sucesso → erro.

## Como testar (faça TODOS — é o que separa um tutorial de um produto)
| Teste | Como | Resultado esperado |
|-------|------|--------------------|
| Caminho feliz | clicar em uma cidade | "Carregando…" → card preenchido → "atualizado" |
| Aba **Network** | F12 › Network › clicar de novo | ver o pedido `forecast?...` e o JSON da resposta (status 200) |
| **404** | select "Errado (provoca 404)" e clicar | mensagem de erro amigável (**não** "undefined°C") |
| **Rede caída** | Network › **Offline** e clicar | mensagem de erro (**não** tela em branco) |
| Leitor de tela | Narrador ligado | os 3 estados são anunciados (aria-live) |

**Pronto quando:** derrubar a rede (Network › Offline) e aparecer uma mensagem, não tela branca.

## Conceitos para comentar em voz alta
- `fetch` devolve uma **Promise**; `await` espera. São **dois** `await`: um para a resposta, outro para o `.json()`.
- `fetch` **só rejeita** quando a rede falha. 404 e 500 chegam como resposta "normal" → por isso o `response.ok`.
- `dataset` devolve **string** → `Number(...)` para as coordenadas.

## ⭐ Estrela
- Troque `console.error(erro)` por uma mensagem que mostre o **código** (`404`, `500`) apenas no Console, nunca na tela.
- Mostre também a velocidade do vento (`wind_speed_10m`) no card.

## Observação
Os testes exigem internet. Sem rede, todo clique cai no estado de erro — o que também é um bom teste.
