# Exercício 3 — Aviso que some (setTimeout), rascunho (sessionStorage) e limites

**Aula:** quinta 08/10 · **Tempo:** 25 min · **Individual** · **Slides:** localStorage × sessionStorage, "setTimeout" e "setTimeout no painel"

## Situação
Na central da AgroLog, o supervisor escreve um **aviso para os despachantes**.
- Enquanto digita, o texto vira **rascunho** (se a aba fechar sem querer, ele perde — é de propósito).
- Ao clicar em **Publicar**, o aviso é **gravado de forma permanente** e aparece "Aviso publicado." por **3 segundos**.

## O que fazer (procure os `TODO` em `exercicio/script.js`)
1. `clearTimeout(timerAviso)` antes de mostrar um aviso novo.
2. `setTimeout(..., 3000)` que esconde o aviso de sucesso.
3. Gravar o rascunho em `sessionStorage` a cada digitação (`input`).
4. Publicar usando `salvarSeguro` (que já tem `try/catch`).

## Como testar
| Teste | Resultado esperado |
|-------|--------------------|
| Publicar um aviso | mensagem verde, **some em 3 s**; texto aparece em "Aviso publicado" |
| Publicar 2 vezes seguidas, rápido | o 2º aviso **não** some antes de 3 s (por causa do `clearTimeout`) |
| Digitar um rascunho e dar **F5** | rascunho continua (sessionStorage sobrevive ao recarregar a mesma aba) |
| Digitar um rascunho, **fechar a aba** e abrir de novo | rascunho **some**; o aviso **publicado** continua |
| Botão "Testar limite" | mensagem de erro **que não some sozinha** e página não quebra |
| DevTools › Application | veja `Session Storage` e `Local Storage` separados |

**Pronto quando:** o aviso some sozinho em 3 s, o rascunho segue a regra do `sessionStorage` e o limite de armazenamento não quebra a página.

## Perguntas de fixação
1. O tempo do `setTimeout` é em segundos ou milissegundos? → **milissegundos** (`3000` = 3 s).
2. Por que o **erro** não desaparece sozinho? → acessibilidade: dê tempo de ler; erro importante não pode sumir.
3. Por que guardar o id do timer? → para poder cancelar com `clearTimeout`.

## ⭐ Estrela
- Faça uma contagem regressiva "some em 3… 2… 1…" usando `setInterval` e `clearInterval` (prévia da sexta).
- Mostre quantos caracteres já foram digitados (`campo.value.length`) com um `aria-live="polite"` discreto.
