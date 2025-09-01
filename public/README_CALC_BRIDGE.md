
# README: Ponte de Integração da Calculadora Solar

Este documento descreve como configurar e usar a ponte de integração (`bridge.js`) para conectar a calculadora solar (rodando em um iframe) com uma página pai (ex: GoHighLevel).

O objetivo desta ponte é coletar os dados inseridos pelo usuário na calculadora e enviá-los para a página pai via `postMessage` no momento da submissão, **sem fazer qualquer alteração visual na calculadora.**

---

## 1. Configuração dos Seletores

A ponte depende de seletores CSS para "enxergar" os elementos da calculadora e ler seus valores.

**Arquivo-chave:** `/js/selectors.js`

**Sua tarefa:**
1.  Abra a calculadora no seu navegador.
2.  Use a ferramenta "Inspecionar Elemento" (clique com o botão direito -> Inspecionar) para encontrar os seletores CSS únicos para cada campo, botão ou valor de resultado.
3.  Edite o arquivo `/js/selectors.js` e substitua os placeholders (ex: `#SELETOR_...`) pelos seletores reais que você encontrou.

**Exemplo:**
Se o botão para finalizar tem o id `btn-enviar-orcamento`, a linha em `selectors.js` deve ser:
```javascript
final: '#btn-enviar-orcamento'
```

---

## 2. Configuração do Domínio de Destino

Por segurança, o `postMessage` só enviará dados para um domínio específico.

**Arquivo-chave:** `/js/bridge.js`

**Sua tarefa:**
- No topo do arquivo, encontre a constante `PARENT_ORIGIN`.
- Altere o valor para o domínio exato da sua Landing Page onde o iframe será hospedado.

**Exemplo:**
```javascript
const PARENT_ORIGIN = 'https://sua-empresa.com.br';
```

---

## 3. Inclusão do Script na Página

Para que a ponte funcione, ela precisa ser carregada junto com a calculadora. O projeto já está configurado para fazer isso, mas se você precisar fazer manualmente, o processo é:

**Onde:** No arquivo HTML principal da sua calculadora.

**Como:** Adicione a seguinte linha antes do fechamento da tag `</body>`:

```html
<script src="/js/bridge.js" type="module" defer></script>
```
**Nenhuma outra alteração no HTML ou CSS é necessária.**

---

## 4. Publicação no Netlify

1.  Após configurar os seletores e o domínio, envie suas alterações para o repositório do GitHub.
2.  O Netlify detectará automaticamente as mudanças e fará o deploy da nova versão da calculadora.
3.  O arquivo `netlify.toml` já está configurado para permitir que a calculadora seja embutida no domínio especificado em `PARENT_ORIGIN` com segurança.

---

## Como Funciona

1.  **Persistência:** Conforme o usuário avança nas etapas, `bridge.js` usa os seletores para ler os valores dos campos e os salva no `localStorage` do navegador. Isso garante que, se a página for recarregada, os dados não sejam perdidos.
2.  **Submissão:** Ao clicar no botão final (mapeado em `selectors.js`), o `bridge.js`:
    a. Coleta os últimos dados (nome/whatsapp).
    b. Lê os valores dos resultados na tela (economia, etc).
    c. Monta um payload JSON limpo.
    d. Envia este payload para a página pai usando `window.parent.postMessage`.
3.  **Redimensionamento:** O script também monitora a altura da calculadora e envia mensagens para a página pai, permitindo que o `iframe` se ajuste dinamicamente ao conteúdo.
