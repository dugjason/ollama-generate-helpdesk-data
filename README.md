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

The following environment variables are required:

- `FRONT_API_KEY`: Your Front.com API key

## Usage

```bash
# Run once
npm start

# Run in development mode (with watch)
npm run dev
```

## Project Structure

```
.
├── lib/
│   ├── helpdesks/       # Helpdesk provider integrations
│   │   ├── index.ts     # Base Helpdesk class
│   │   └── front.ts     # Front.com implementation
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

## License

MIT
