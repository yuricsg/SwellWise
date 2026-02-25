# SwellWise Backend - Scripts de Desenvolvimento

Este diretório contém scripts úteis para desenvolvimento e deployment.

## Scripts Disponíveis

### desenvolvimento.bat
Inicia o ambiente de desenvolvimento completo (API + PostgreSQL + pgAdmin)

### parar.bat
Para todos os containers Docker

### limpar.bat
Remove containers, volumes e limpa o ambiente

### migrations.bat
Cria uma nova migration do Alembic

### test.bat
Executa os testes da aplicação

## Uso

```bash
# Windows
.\scripts\desenvolvimento.bat

# Linux/Mac
chmod +x scripts/*.sh
./scripts/desenvolvimento.sh
```
