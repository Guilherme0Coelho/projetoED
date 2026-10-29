# SEÇÃO A — Requisitos e Histórias de Usuário

## 1. Visão Geral
**Objetivo:** e-commerce simplificado onde usuários autenticados navegam por um catálogo, consultam detalhes e simulam compra; administradores cadastram produtos.

**Escopo funcional**
| Incluído | Fora do escopo |
|---|---|
| Cadastro/login com JWT | Carrinho persistente, pagamento real |
| Catálogo paginado com busca por nome | Upload de imagem (usa URL) |
| Detalhe do produto + compra simulada | Edição/exclusão de produto, pedidos |
| Cadastro de produto (ADMIN, via API) | Tela administrativa |

**Perfis:** `USER` (padrão no cadastro), `ADMIN` (criado por seed: `admin@ecommerce.com` / `admin123`).

## 2. Histórias de Usuário
| ID | História |
|---|---|
| US01 | Como **visitante**, eu quero me cadastrar, para que eu possa acessar a loja. |
| US02 | Como **usuário cadastrado**, eu quero fazer login, para que eu acesse áreas protegidas com segurança. |
| US03 | Como **usuário autenticado**, eu quero listar produtos com paginação e busca, para que eu encontre o que desejo rapidamente. |
| US04 | Como **usuário autenticado**, eu quero ver os detalhes de um produto, para que eu decida a compra. |
| US05 | Como **usuário autenticado**, eu quero simular a compra, para que eu valide o fluxo de compra. |
| US06 | Como **administrador**, eu quero cadastrar produtos, para que o catálogo seja atualizado. |
| US07 | Como **usuário autenticado**, eu quero sair da conta, para que minha sessão seja encerrada. |

## 3. Critérios de Aceite (Gherkin)

### US01 — Cadastro
```gherkin
Cenário: Cadastro com sucesso
  Dado que sou um visitante na tela de cadastro
  Quando informo nome, e-mail inédito e senha com 6+ caracteres e envio
  Então a conta é criada com perfil USER
  E sou autenticado e redirecionado ao catálogo

Cenário: E-mail já cadastrado
  Dado que já existe usuário com o e-mail informado
  Quando envio o formulário de cadastro
  Então vejo a mensagem "E-mail já cadastrado" (HTTP 409)

Cenário: Dados inválidos
  Dado que informo e-mail malformado ou senha com menos de 6 caracteres
  Quando envio o formulário
  Então vejo mensagem de validação e nenhuma requisição inválida é aceita
```

### US02 — Autenticação
```gherkin
Cenário: Login válido
  Dado que possuo conta ativa
  Quando informo e-mail e senha corretos
  Então recebo um token JWT
  E sou redirecionado ao catálogo

Cenário: Credenciais inválidas
  Dado que informo senha incorreta
  Quando envio o login
  Então vejo "E-mail ou senha inválidos" (HTTP 401)
  E permaneço na tela de login

Cenário: Rota privada sem sessão
  Dado que não estou autenticado
  Quando acesso "/products"
  Então sou redirecionado para "/login"

Cenário: Token expirado ou inválido
  Dado que meu token expirou
  Quando faço uma requisição protegida
  Então recebo HTTP 401 e sou levado ao login
```

### US03 — Listagem de Produtos
```gherkin
Cenário: Listagem paginada
  Dado que estou autenticado e existem 10 produtos
  Quando acesso o catálogo
  Então vejo 8 cards (imagem, título, preço, botão)
  E controles de paginação "Página 1 de 2"

Cenário: Busca por nome
  Dado que estou no catálogo
  Quando digito "mouse" na busca
  Então apenas produtos cujo nome contém "mouse" (sem diferenciar maiúsculas) são exibidos

Cenário: Busca sem resultado
  Quando busco um termo inexistente
  Então vejo "Nenhum produto encontrado."
```

### US04/US05 — Detalhe e Compra Simulada
```gherkin
Cenário: Ver detalhe
  Dado que estou no catálogo
  Quando clico em "Ver detalhes" de um produto
  Então vejo imagem, nome, preço, descrição e estoque

Cenário: Produto inexistente
  Quando acesso "/products/9999"
  Então vejo "Produto não encontrado." (HTTP 404)

Cenário: Compra simulada
  Dado que estou no detalhe de um produto com estoque
  Quando clico em "Comprar"
  Então vejo "Compra simulada realizada com sucesso!"
```

### US06 — Cadastro de produto (ADMIN)
```gherkin
Cenário: Admin cria produto
  Dado que possuo token com perfil ADMIN
  Quando envio POST /api/products com dados válidos
  Então recebo HTTP 201 com o produto criado

Cenário: Usuário comum tenta criar
  Dado que possuo token com perfil USER
  Quando envio POST /api/products
  Então recebo HTTP 403
```
