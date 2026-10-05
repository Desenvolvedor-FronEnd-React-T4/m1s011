# Exercício 2 — Atualização automática com setInterval (sem acumular timers)

**Aula:** sexta 09/10 · **Tempo:** 25 min · **Individual ou dupla** · **Slides:** "setInterval", "setTimeout × setInterval", "Atualização automática", "Pausar quando a aba esconde", "Demo IA #4"

## Situação
O despachante deixa o painel aberto o dia todo. Ele quer que o clima **se atualize sozinho**
(em aula, a cada **15 s**; em produção, a cada 10 min) e que dê para **desligar** a rotina.

## O que fazer (procure os `TODO` em `exercicio/script.js`)
1. `pararAtualizacao()` → `clearInterval` nos **dois** ids e voltar para `null`.
2. `iniciarAtualizacao()` → **primeiro** parar o anterior; chamar `atualizar()` já;
   criar `setInterval(atualizar, INTERVALO_MS)` e `setInterval(desenharIdade, 1000)`.
3. `visibilitychange` → pausar quando a aba escondida; retomar ao voltar (se estava ligado).

## Como testar
| Teste | Resultado esperado |
|-------|--------------------|
| Clicar **Ligar** | atualiza na hora; "Atualizado há 0 s…1 s…2 s…"; a cada 15 s atualiza de novo |
| **DevTools › Network** | um pedido `forecast` a cada 15 s — **nunca dois ao mesmo tempo** |
| Experimento: comente a 1ª linha de `iniciarAtualizacao()` (o `pararAtualizacao()`) e rode `iniciarAtualizacao()` 3× no Console | quantos pedidos por ciclo na aba Network? ← o vazamento da *Demo IA #4*. Desfaça depois |
| Clicar **Desligar** | o contador e os pedidos **param** |
| Trocar de aba e voltar | pausa ao sair, atualiza na hora ao voltar |
| Painel "Timers ativos" | nunca passa de **2** |

**Pronto quando:** o painel atualiza sozinho, para quando desligado e nunca existem mais de 2 timers ativos.

## Perguntas de fixação
1. Diferença entre `setTimeout` e `setInterval`? → o primeiro roda **uma vez**; o segundo **repete** até o `clearInterval`.
2. Por que chamar `atualizar()` antes do `setInterval`? → ele só dispara depois do 1º intervalo.
3. Por que o contador de segundos **não** usa `aria-live`? → o leitor de tela falaria a cada segundo, sem parar.
4. Por que pausar com `visibilitychange`? → economiza rede e a cota da API quando ninguém está olhando.

## ⭐ Estrela
- Troque o intervalo fixo por um campo "intervalo (s)" (mínimo 5) — ao mudar, chame `iniciarAtualizacao()` de novo.
- Use `setTimeout` encadeado (cada rodada agenda a próxima **depois** de terminar) e discuta a diferença para o `setInterval`.
