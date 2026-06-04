# Ollama Generate Helpdesk Data

Generate realistic helpdesk email data using Ollama's local LLM models and Front.com as the helpdesk provider.

## Overview

This project generates synthetic helpdesk email data by:
1. Creating realistic user personas using Faker.js
2. Generating contextual email content using Ollama's local LLM models, based on your provided prompts.
3. Importing the generated emails into your helpdesk system.

## Prerequisites

- Node.js (v18+)
- [Ollama](https://ollama.ai) installed and running locally
- A helpdesk system with API access (currently only [Front.com](https://front.com) is supported)

## Installation

### Installing Ollama and a model

The folks at Kerlig have created a [great guide](https://www.kerlig.com/help/ollama/running-local-models) for installing Ollama and a model on your local machine.
I found using Ollama wih the `llama3.2:3b` model worked well for generating email content, and runs well on a Macbook Pro.

### Start your LLM server

```bash
ollama run llama3.2:3b
```

### Install dependencies

```bash
# Install dependencies
npm install

# Copy the example environment file
cp .env.example .env

# Edit .env and add your Front API key
# @see https://dev.frontapp.com/docs/create-and-revoke-api-tokens#create-an-api-token
```

## Configuration

1. The environment variable that relates to your corresponding Support platform is required.

- `FRONT_API_KEY`: Your Front.com API key
- `ZENDESK_API_KEY`: Your Zendesk API key
- `ZENDESK_EMAIL`: The email you'd like to create the Zendesk tickets from, minimum role level of agent

2. In [index.ts](https://github.com/dugjason/ollama-generate-helpdesk-data/blob/36e2438010a51234aba8442d75e46556a98a23e0/index.ts#L27), specify the inbox ID where you want the conversations to populate.

## Usage

```bash
# Run in development mode (with watch)
npm run dev
```

## Project Structure

```
.
├── lib/
│   ├── helpdesks/       # Helpdesk provider integrations
│   │   ├── index.ts     # Base Helpdesk class
│   │   └── front.ts     # Front.com helpdesk implementation
|   |   |__ zendesk.ts   # Zendesk.com implementation
│   ├── env.ts           # Environment variable validation
│   ├── person.ts        # User persona generation
│   └── prompts.ts       # LLM prompt definitions
└── index.ts             # Main application entry
```

## Features

- 🤖 Uses local LLM models via Ollama
- 👤 Generates realistic user personas
- 📧 Creates contextual email content
- 🔄 Imports directly into Front.com
- ✨ TypeScript with strict type checking
- 🔒 Environment variable validation using Zod

## Development

The project uses:
- TypeScript with ESM modules
- Biome for linting and formatting
- Zod for runtime type validation
- @t3-oss/env-core for environment variable management
- tsx for running TypeScript directly

## Contributing

Contributions are welcome! Please feel free to submit a PR to make this project better, or to add support for other helpdesk systems.

## License

MIT
