# savetodate

Pequeno app React (Vite) contendo o convite "Save the Date" da Isabella.

Como usar
 - Instalar dependências:

```powershell
npm ci
```

 - Rodar em desenvolvimento:

```powershell
npm run dev
```

 - Build para produção:

```powershell
npm run build
```

Docker (pronto para EasyPanel)

O repositório inclui um `Dockerfile` multi-stage que cria o build e serve via `nginx`.

Build de imagem local:

```powershell
# a partir da raiz do projeto
docker build -t savetodate:latest .
```

Testar localmente (executa container na porta 8080):

```powershell
docker run --rm -p 8080:80 savetodate:latest
# abra http://localhost:8080
```

Deploy no EasyPanel

 - No painel do EasyPanel, crie um novo app Docker e aponte para este repositório (ou faça push da imagem para um registro e aponte o EasyPanel para a imagem). O `Dockerfile` será usado para construir a imagem.
 - Porta exposta pelo container: `80`.
