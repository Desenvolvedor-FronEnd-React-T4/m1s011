# Exercício 2 — Formulário de rota acessível (label/for, fieldset, aria)

**Aula:** terça 06/10 · **Tempo:** 25 min · **Individual ou dupla** · **Slides:** 11–14 e os novos "ARIA-LIVE" e "TECLADO"

## Situação
A AgroLog precisa de um formulário para o despachante cadastrar **rotas de coleta**.
O visual já está pronto (`style.css`); falta a **semântica e a acessibilidade**.

## O que você vai fazer (procure os `TODO` em `exercicio/`)
| Arquivo | TODO | Conceito |
|---------|------|----------|
| `index.html` | região de erros e de sucesso | `role="alert"` e `role="status"` — o leitor de tela **anuncia** o que o JavaScript escreve |
| `index.html` | `<label for="origem">` | liga o rótulo ao campo pelo `id` |
| `index.html` | `<fieldset>` + `<legend>` | agrupa os rádios com um nome ("Urgência") |
| `index.html` | `aria-describedby` na observação | dica lida depois do nome do campo |
| `script.js` | `aria-invalid` + `aria-describedby` no erro | liga a mensagem ao campo inválido |
| `script.js` | resumo de erros e foco no 1º inválido | teclado vai direto ao problema |

## Como testar
1. Abra `exercicio/index.html` no Live Server.
2. Clique em **Cadastrar rota** com tudo vazio → deve aparecer o resumo e **o foco deve pular para "Origem"**.
3. Ligue o **Narrador** (`Ctrl + Win + Enter`) e percorra com **Tab**: cada campo deve ser anunciado com o nome certo.
4. Digite a mesma cidade em origem e destino → mensagem "O destino precisa ser diferente da origem."
5. DevTools › **Elements**: veja `aria-invalid="true"` aparecer e sumir.
6. Rode o **Lighthouse** (Acessibilidade): meta ≥ 90.

**Pronto quando:** todos os campos têm nome anunciado, o erro é dito em texto (não só em vermelho) e dá para preencher e enviar **só com o teclado**.

## ⭐ Estrela
- Troque o `required` nativo por uma validação de e-mail (campo extra "E-mail do motorista" com `type="email"`).
- Use `autocomplete="email"` e explique por que ele ajuda quem tem dificuldade motora.

## Erros comuns
- `<label>` sem `for` (ou `for` com id diferente do `id` do campo).
- Criar a região `role="alert"` **depois** de escrever a mensagem (o leitor não anuncia).
- Mostrar erro só com cor vermelha (quem tem daltonismo não percebe).
- Esquecer de **remover** `aria-invalid` quando o campo volta a ficar válido.
