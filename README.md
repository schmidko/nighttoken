An approachable Midnight DApp for creating tokens, distributing them, and launching claim campaigns.

## First implementation step

This repository contains a Next.js/TypeScript application shell and a static dashboard prototype. It establishes product navigation, visual language, and the boundaries for wallet-driven actions. No private keys, wallet integration, token minting, or ledger transactions are implemented yet.

## Run locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Next iteration

Introduce the Midnight DApp Connector behind a wallet-adapter interface, then replace sample dashboard data with wallet-scoped reads. The complete product concept is in [docs/concept.md](docs/concept.md).

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
