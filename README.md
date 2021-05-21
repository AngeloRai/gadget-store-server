## Check out the site throguh this link: [PRIME GADGET](https://prime-gadgets.netlify.app/)

## [Client Side Repo](https://github.com/AngeloRai/gadget-store-client)

## [Here](https://docs.google.com/presentation/d/1S4o0DojhbV2nGNsa86-YobuvAQpd0jPye91y3DTE0ow/edit?ts=60a6a850#slide=id.gd39d7d08c1_1_54) you can understand a bit about the project by checking out [this slide](https://docs.google.com/presentation/d/1S4o0DojhbV2nGNsa86-YobuvAQpd0jPye91y3DTE0ow/edit?ts=60a6a850#slide=id.gd39d7d08c1_1_54)


![logo_ironhack_blue 7](https://user-images.githubusercontent.com/23629340/40541063-a07a0a8a-601a-11e8-91b5-2f13e4e6b441.png)

# IronREST Boilerplate

Esse boilerplate para API RESTful já inclui:

- Autenticação por tokens JWT
- Conexão com banco de dados MongoDB usando Mongoose
- Servidor Web usando Express pré-configurado com CORS e aceitando requisições JSON e Multipart Form
- Upload de arquivos usando Cloudinary e Multer

## Para Começar

- Faça o fork e clone deste repositório

## Instalação

```shell
$ npm install
```

## Desenvolvimento

Para iniciar o servidor web localmente execute no seu terminal:

```shell
$ npm run dev
```

## Deploy do MongoDB

1. Faça login no https://account.mongodb.com/account/login?nds=true
2. Crie um cluster gratuito
3. Siga as instruções e obtenha a string de conexão com o banco
4. Crie uma variável de ambiente MONGODB_URI no Heroku com a string de conexão copiada do Atlas

## Deploy no Heroku

1. Faça login no Heroku e selecione seu repositório
2. Habilite 'automatic deploys'
3. No seu terminal, execute os seguintes comandos:

```shell
$ git add .
$ git commit -m 'deploying'
$ heroku git:remote -a nome-do-repo-no-heroku
$ git push heroku master
```

4. Adicione uma variável de ambiente no Heroku para cada variável de ambiente presente no arquivo .env (não precisa criar a PORT no Heroku)
5. Adicione a URL da sua API hospedada no Heroku nas variáveis de ambiente do app React no Netlify

Happy coding! 💙
