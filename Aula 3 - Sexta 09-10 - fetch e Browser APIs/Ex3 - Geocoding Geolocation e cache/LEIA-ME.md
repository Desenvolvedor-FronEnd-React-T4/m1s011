# Exercício 3 — Geocoding → Forecast, Geolocation com fallback e cache

**Aula:** sexta 09/10 · **Tempo:** 30 min · **Individual** · **Slides:** Cache no localStorage, Geolocation, Geocoding → Forecast, Timeout no fetch (⭐)

## Situação
Até agora as cidades tinham coordenadas fixas. O despachante quer **digitar o nome** de qualquer cidade
ou usar **"minha localização"** — e o app precisa continuar útil se ele **recusar** a permissão ou se a rede estiver lenta.

## O que fazer (procure os `TODO` em `exercicio/script.js`)
1. `buscarJSON(url)` — `AbortController` + `setTimeout` para **cancelar** depois de 8 s; `clearTimeout` no `finally`.
2. `buscarCoordenadas(nome)` — Geocoding com `encodeURIComponent`; cidade inexistente → `results` **some** → devolva `null`.
3. `salvarNoCache(nome, clima)` — guardar com carimbo `salvoEm`.
4. Geolocation — `getCurrentPosition(sucesso, erro)`; no erro, **fallback**: avisar e focar o campo de busca.

## Como testar
| Teste | Resultado esperado |
|-------|--------------------|
| Buscar "Chapecó" | Geocoding → Forecast; origem do dado: **internet (agora)** |
| Buscar "Chapecó" de novo | resposta **instantânea**; origem: **cache (salvo há N s)**; **nenhum** pedido na aba Network |
| Buscar "Atlantida de Marte" | "Cidade não encontrada" (**sem** `TypeError` no Console) |
| Buscar "São Paulo" | funciona com acento/espaço (graças ao `encodeURIComponent`) |
| "Usar minha localização" → **Permitir** | clima do lugar onde você está |
| "Usar minha localização" → **Bloquear** | mensagem + foco no campo de busca |
| Network › **Slow 3G** (ou `LIMITE_MS = 1`) | "A busca demorou demais" (`AbortError`) |
| Application › Local Storage | chave `previsaocerta:cache-ex3` com `salvoEm` |

**Pronto quando:** buscar por nome funciona (e cidade inexistente não quebra), a 2ª busca vem do cache e a localização negada leva ao fallback.

## Perguntas de fixação
1. Por que `encodeURIComponent(nome)`? → acentos e espaços quebram a URL.
2. Por que checar `dados.results` antes de `results[0]`? → quando a cidade não existe o campo **some** (TypeError).
3. Por que **não** insistir em pedir a localização? → abusivo; o navegador passa a bloquear. Aceite a recusa e ofereça outro caminho.
4. Por que um cache com **validade**? → dado velho de clima engana o despachante.

## ⭐ Estrela
- Em `mostrarClimaDe`, se a rede falhar e existir um cache **vencido**, mostre-o com o aviso "Sem conexão. Mostrando o último dado salvo."
- Use `AbortSignal.timeout(8000)` (navegadores modernos) no lugar do `AbortController` + `setTimeout` e compare.
