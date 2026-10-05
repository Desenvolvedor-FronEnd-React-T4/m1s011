# Exercício 2 — Lista de cidades que sobrevive ao F5 (JSON + o null da 1ª visita)

**Aula:** quinta 08/10 · **Tempo:** 25 min · **Individual ou dupla** · **Slides:** 33–38 e Exercício 2 (localStorage)

## Situação
O painel precisa **lembrar as cidades monitoradas**. Hoje a lista está só na memória do JavaScript:
adicione uma cidade, dê F5 → sumiu.

## O que fazer (procure os `TODO` em `exercicio/script.js`)
| Função | O que faz | Armadilha |
|--------|-----------|-----------|
| `carregarCidades()` | `getItem` + `JSON.parse` | na 1ª visita `JSON.parse(null)` é `null` → use `\|\| []` |
| `salvarCidades(cidades)` | `setItem` + `JSON.stringify` | sem `stringify` vira `"[object Object]"` |
| `removerCidade(nome)` | `filter` + salvar | não use `splice` por índice sem cuidado |
| `renderizarLista()` | cria `<li>` com `createElement` | limpar com `innerHTML = ''` **antes** de recriar |

`adicionarCidade`, `limparTudo` e os eventos já estão prontos para você ler e comentar.

## Como testar
1. Primeira abertura: **não pode** aparecer erro no console (`Cannot read properties of null`).
2. Adicione 3 cidades → **F5** → a lista continua. Feche e reabra a aba → continua.
3. Remova uma → F5 → continua removida.
4. **Application › Local Storage:** veja o texto JSON na chave `previsaocerta:cidades`; compare com o painel da página.
5. Experimento: troque `JSON.stringify(cidades)` por `cidades` → o painel mostra `[object Object]`. Desfaça.
6. Experimento: remova o `|| []` e apague a chave → o erro clássico aparece. Desfaça.

**Pronto quando:** adicionar cidades, dar F5 e a lista continuar; a chave aparece na aba Application.

## ⭐ Estrela
- Ordenar a lista por nome antes de renderizar (`sort` + `localeCompare`).
- Botão "Exportar" que mostra o JSON num `<textarea>` (cópia manual).
- E se o JSON for corrompido no DevTools (apague uma `}`)? Envolva o `JSON.parse` em `try/catch` e devolva `[]`.

## Pergunta de fechamento
> Por que o `localStorage` **não** é um banco de dados de verdade?

*Resposta esperada:* vive só neste navegador e computador, não sincroniza entre dispositivos, só guarda texto e some se o usuário limpar os dados do site.
