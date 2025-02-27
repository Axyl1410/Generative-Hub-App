# Generative Hub App: Powered by Forma NFTs

A decentralized platform for managing and securing NFT using blockchain technology and zero-knowledge proofs.

## 🌟 Overview

Leveraging onchain data:
Generative art will use different types of onchain data such as:

Transaction hashes.
Wallet addresses.
These data will influence the resulting image generated by the algorithm.
Specific technology:
Forma provides the ability to compile custom metadata, to be stored on-chain. Create new inputs for generative algorithms.

For example, NFTs with specific attributes may have a higher probability of generating rare works from a collection.

## 🏗️ Architecture

The project consists of two components:

### Frontend (Client)

- Built with Nextjs
- Use App router for routing
- Integrates with Thirdweb for wallet connection
- Modern UI with Tailwind CSS and Shadcn
- TypeScript for type safety

### Backend (Server)

- Written with TypeSrcipt
- Uses Api router powered by Nextjs
- MongoDB database with MySQL
- JWT-based authentication

## 📁 Folder Structure

```
root/
├── app/          # Frontend React application
│   ├── [locale]/   # Source code for the frontend
│   └── api/        # API routes and handlers
├── components/     # Reusable React components
│   ├── common/     # Common component
│   ├── form/       # Form field
│   ├── layout/     # Main layout
│   ├── nft/        # NFT listing
│   ├── sale-info/  # NFT sale info
│   ├── skeleton/   # Skeleton placeholder
│   ├── theme/      # Theme Providers
│   ├── thirdweb/   # Thirdweb custom component
│   ├── token/      # Token UI
│   └── ui/         # Common UI application
├── contracts/    # Process Contracts
├── font/         # Fonts style for application
├── hooks/        # Custom React hooks
├── i18n/         # i18 providers
├── lib/          # Helper functions
├── messages/     # Messages for i18n
├── public/       # Static assets
├── scripts/      # Script examble for p5js
├── styles/       # Style of Frontend application
└── types/        # Types
```

## 📋 Prerequisites

- Node.js
- MongoDB

## 🚀 Getting Started

### Clone the Repository

```sh
git clone https://github.com/Axyl1410/Generative-Hub-App
cd Generative-Hub-App
```

### Frontend Setup

#### Download package

```sh
npm i
# or
pnpm i
```

#### Run the development server:

```bash
npm run dev
# or
pnpm dev
```

### Backend Setup

#### Copy .env.example into .env.local

```bash
cp .env.example .env.local
```

The frontend will be available at [http://localhost:3000](http://localhost:3000)

## 🛠️ Tech Stack

### Frontend

- React 19
- Nextjs 15
- TypeScript
- Thirdweb
- Tailwind CSS
- Shadcn
- Framer Motion

### Backend

- MongoDB
- Api router
- Forma NFTs Protocol
- Axios

## 🚀 Future Plans

We are actively working on improve UI and securing for account and database

Technical: Ensure efficient onchain metadata processing without increasing costs.
User Experience: Build an interface that is intuitive enough for non-tech artists.
Competitive Market: Compete with other innovative NFT platforms. Add more new type of contract and have supply per token

Stay tuned for updates on our development progress!

## 👥 About Us

We are a team of software engineers specializing in Web3 development, with a focus on:

- Building high-load, scalable solutions
- Expertise in fintech and cybersecurity
- Passion for decentralization and user empowerment
- Commitment to blockchain technology innovation

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

Made with ❤️ by the Generative Hub App Team
