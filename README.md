# Open Collective Frontend template

This project is meant to provide the base layer to kickstart a new frontend project at Open Collective. The goal is to provide a solid foundation to build upon, while making sure we can bring back the code to the main Open Collective codebase whenever we need.

## Currently included

- [Next.js](https://nextjs.org/) for server-side rendering and routing
- [Styled Components](https://www.styled-components.com/) for styling, with our custom design system plugged in
- [Apollo](https://www.apollographql.com/) for GraphQL queries
- [ESLint](https://eslint.org/) for linting, with our [custom config](https://github.com/opencollective/eslint-config-opencollective) & Prettier
- [Renovate](https://renovatebot.com/) for automated dependency updates
- A minimal Github Actions CI config
- A Vercel configuration for deployment and preview

# Varsayılan ileti: {action: 'want', data: ['blocks', ...] } iletmek istediğini belirt. Kullanılabilir alanlar: blocks, mempool-blocks, live-2h-chart ve stats.

Takip eden adresle ilişkili işlemleri ileterek: { 'track-address': '3PbJ...bF9B'} bu adresi içeren bütün giriş ve çıkış işlemlerini al. İşlemleri sırala. Yeni mempool işlemleri içinaddress-transactions ve yeni onaylı blok işlemleri için block-transcations kullan.

# npm
npm install @mempool/mempool.js --save

# yarn
yarn add @mempool/mempool.js

To do: <!DOCTYPE html>
<html>
  <head>
    <script src="https://mempool.space/mempool.js"></script>
    <script>
      const init = async () => {
        
        const { bitcoin: { websocket } } = mempoolJS({
          hostname: 'mempool.space'
        });

        const ws = websocket.initClient({
          options: ['blocks', 'stats', 'mempool-blocks', 'live-2h-chart'],
        });

        ws.addEventListener('message', function incoming({data}) {
          const res = JSON.parse(data.toString());
          if (res.block) {
            document.getElementById("result-blocks").textContent = JSON.stringify(res.block, undefined, 2);
          }
          if (res.mempoolInfo) {
            document.getElementById("result-mempool-info").textContent = JSON.stringify(res.mempoolInfo, undefined, 2);
          }
          if (res.transactions) {
            document.getElementById("result-transactions").textContent = JSON.stringify(res.transactions, undefined, 2);
          }
          if (res["mempool-blocks"]) {
            document.getElementById("result-mempool-blocks").textContent = JSON.stringify(res["mempool-blocks"], undefined, 2);
          }
        });
  
      };
      init();
    </script>
  </head>
  <body>
    <h2>Blocks</h2><pre id="result-blocks">Waiting for data</pre><br>
    <h2>Mempool Info</h2><pre id="result-mempool-info">Waiting for data</pre><br>
    <h2>Transactions</h2><pre id="result-transactions">Waiting for data</pre><br>
    <h2>Mempool Blocks</h2><pre id="result-mempool-blocks">Waiting for data</pre><br>
  </body>
</html>

- [Jest](https://jestjs.io/) for testing
- Depcheck
- Import frontend's fonts
- Husky pre-commit lint hook
- Replace all `<Link><a>` with our custom link component from frontend
- Invalidate OAuth tokens on logout

## Getting Started
import mempoolJS from "@mempool/mempool.js";

const init = async () => {
  
  const { bitcoin: { websocket } } = mempoolJS({
    hostname: 'mempool.space'
  });

  const ws = websocket.initServer({
    options: ["blocks", "stats", "mempool-blocks", "live-2h-chart"],
  });

  ws.on("message", function incoming(data) {
    const res = JSON.parse(data.toString());
    if (res.block) {
      console.log(res.block);
    }
    if (res.mempoolInfo) {
      console.log(res.mempoolInfo);
    }
    if (res.transactions) {
      console.log(res.transactions);
    }
    if (res["mempool-blocks"]) {
      console.log(res["mempool-blocks"]);
    }
  });
    
};

init();
### 1. Fork the repository and install dependencies

Click on ["Use this template"](https://github.com/opencollective/opencollective-frontend-template/generate) above (or alternatively, fork the repository) then clone it:

```
git clone https://github.com/opencollective/opencollective-frontend-template.git
cd opencollective-frontend-template
npm install
```

### 2. Configure your local environment

By default, the app will try to connect to the Open Collective staging API & frontend.

To run the template against your local frontend/api:

1. [Create](https://docs.opencollective.com/help/developers/oauth#creating-an-oauth-app) a new OAuth app
2. Run `cp .env.local.example .env.local`
3. Edit `.env.local` and set `OPENCOLLECTIVE_OAUTH_APP_ID` and `OPENCOLLECTIVE_OAUTH_APP_SECRET` to your OAuth app credentials

Learn more about the environment variables in NextJS: https://nextjs.org/docs/basic-features/environment-variables.

### 3. Start the application

To run your site locally (default: http://localhost:3004), use:

```
npm run dev
```

To run it in production mode, use:

```
npm run build
npm run start
```

## Development process

- To update GraphQL schemas after an API change, run `npm run graphql:update`.

## Deploy

1. Create a [new project](https://vercel.com/docs/concepts/projects/overview#creating-a-project) on [Vercel](https://vercel.com/new/opencollective), pick your forked repository.
2. On the "Configure Project" step, keep the default settings (NextJS), set the required Environment variables and click "Deploy":
   - `NEXTAUTH_SECRET`: a random string used to encrypt JWTs
   - `OPENCOLLECTIVE_OAUTH_APP_ID`: the ID of the OAuth app you created on the API
   - `OPENCOLLECTIVE_OAUTH_APP_SECRET`: the secret of the OAuth app you created on the API
   - `NEXT_PUBLIC_OPENCOLLECTIVE_OAUTH_SCOPES`: a comma separated list of OAuth scopes you want to request from the API (e.g. `account,transactions`)
