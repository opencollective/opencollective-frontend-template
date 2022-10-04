# Open Collective Frontend boilerplate

This project is meant to provide the base layer to kickstart a new frontend project at Open Collective. The goal is to provide a solid foundation to build upon, while making sure we can bring back the code to the main Open Collective codebase whenever we need.

## Currently included

- [Next.js](https://nextjs.org/) for server-side rendering and routing
- [Styled Components](https://www.styled-components.com/) for styling, with our custom design system plugged in
- [Apollo](https://www.apollographql.com/) for GraphQL queries
- [ESLint](https://eslint.org/) for linting, with our [custom config](https://github.com/opencollective/eslint-config-opencollective) & Prettier
- [Renovate](https://renovatebot.com/) for automated dependency updates
- A minimal Github Actions CI config
- A Vercel configuration for deployment and preview

To do:

- [React Intl](https://formatjs.io/docs/react-intl/) for internationalization
- Tools to update GraphQL schemas. Not doing it for the 1st release as the way we do it is going to change with https://github.com/opencollective/opencollective/issues/5710.
- Cypress for end-to-end testing
- [Jest](https://jestjs.io/) for testing

## Getting Started

### 1. Fork the repository and install dependencies

Fork the repository, then clone it:

```
git clone https://github.com/opencollective/opencollective-frontend-boilerplate.git
cd opencollective-frontend-boilerplate
npm install
```

### 2. Configure your local environment

Copy the .env.local.example file in this directory to .env.local (which will be ignored by Git):

```
cp .env.local.example .env.local
```

Add details for one or more providers (e.g. Google, Twitter, GitHub, Email, etc).

### 3. Start the application

To run your site locally, use:

```
npm run dev
```

To run it in production mode, use:

```
npm run build
npm run start
```

## Deploy

1. Create a [new project](https://vercel.com/docs/concepts/projects/overview#creating-a-project) on [Vercel](https://vercel.com/new/opencollective)
2. TODO
