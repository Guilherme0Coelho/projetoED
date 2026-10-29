# Loja ED — E-commerce Full-Stack

Spring Boot 3 (Java 17, H2, JWT) + React 18 (Vite, TypeScript, Tailwind).

## Estrutura
```
projetoED/
├── docs/            A-requisitos.md, B-uiux.md
├── backend/         pom.xml, src/main/java/com/ecommerce/{config,controller,dto,entity,repository,security,service}
└── frontend/        src/{components,context,pages,services}
```

## Executar
```powershell
# Backend (http://localhost:8080)
cd backend
mvn spring-boot:run

# Frontend (http://localhost:5173)
cd frontend
npm install
npm run dev
```
Documentação completa (PDF): [docs/Loja-ED-Documentacao.pdf](docs/Loja-ED-Documentacao.pdf) — fonte em `docs/Documentacao.md`; regenerar com `cd docs/pdf && npm install && npm run build`.
Seed: `admin@ecommerce.com` / `admin123` (ADMIN) e `user@ecommerce.com` / `user123` (USER). Console H2: `/h2-console` (JDBC `jdbc:h2:mem:ecommerce`, user `sa`).

## API
| Método | Rota | Acesso |
|---|---|---|
| POST | `/api/auth/register` | Público |
| POST | `/api/auth/login` | Público |
| GET | `/api/products?search=&page=0&size=8` | Autenticado |
| GET | `/api/products/{id}` | Autenticado |
| POST | `/api/products` | ADMIN |

## Teste rápido
```powershell
$t = (Invoke-RestMethod -Method Post http://localhost:8080/api/auth/login -ContentType application/json -Body '{"email":"admin@ecommerce.com","password":"admin123"}').token
Invoke-RestMethod -Method Post http://localhost:8080/api/products -ContentType application/json -Headers @{Authorization="Bearer $t"} -Body '{"name":"Item","price":10.5,"stock":3}'
```
