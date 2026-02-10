# Cloudflare AI Chat Agent

A stateful AI chat application built on Cloudflare using Workers AI, Durable Objects, and the Cloudflare Agents SDK.

## Overview

This project demonstrates how to build a complete AI-powered application using Cloudflare's platform primitives, including:

* Large Language Model (LLM) - Workers AI with Llama 3.3
* Workflow and Coordination Layer - Cloudflare Agents SDK
* User Input - Chat UI with streaming responses
* Persistent Memory and State - Durable Objects

## Architecture

```
Browser Chat UI
      ↓
Cloudflare Worker (API + Routing)
      ↓
Cloudflare Agent (Durable Object)
      ↓
Workers AI (Llama 3.3)
```

## Components

| Component | Purpose |
|-----------|---------|
| Cloudflare Workers | API layer and request routing |
| Cloudflare Agents SDK | Real-time AI chat and workflow orchestration |
| Durable Objects | Persistent conversation memory and coordination |
| Workers AI (Llama 3.3) | Large Language Model |
| Vite Frontend | Chat UI for user input |

## Features

### AI Chat powered by Workers AI

The application uses Llama 3.3 via Workers AI as the LLM provider.

Benefits:
* No external API keys required
* Runs entirely on Cloudflare's edge network
* Low latency responses

### Persistent Memory using Durable Objects

Each chat session is handled by a Durable Object instance, which stores conversation history.

This enables:
* Session memory across messages
* Stateful workflows
* Strong consistency

Example:

```
User: Hello! What can you do?

Assistant: I'm a helpful assistant, which means I can assist with a wide range of tasks and questions. I can provide information, answer questions, and help with topics such as history, science, technology, and more. I can also engage in conversation, provide definitions, and offer suggestions. If you have a specific question or topic in mind, feel free to ask, and I'll do my best to help!

User: what is chatgpt?

Assistant: ChatGPT is an AI chatbot developed by the company OpenAI. ChatGPT stands for "Chat Generative Pre-trained Transformer." It's a type of language model that uses natural language               processing to generate human-like text responses to user input.

            ChatGPT is designed to engage in conversation, answer questions, and provide information on a wide range of topics. It can understand and respond to natural language input, using             context and understanding to generate relevant and accurate responses.
            
            Some of the key features of ChatGPT include:
            
            Conversational interface: ChatGPT allows users to interact with it in a conversational manner, using natural language to ask questions or provide input.
            Language understanding: ChatGPT can understand and interpret natural language, including nuances and context.
            Text generation: ChatGPT can generate human-like text responses to user input, using a range of styles and tones.
            Knowledge base: ChatGPT has been trained on a massive dataset of text from the internet, books, and other sources, giving it a broad knowledge base to draw upon.
            ChatGPT has many potential applications, including:
            
            Customer service: ChatGPT can be used to provide automated customer support, answering frequent questions and helping users with basic issues.
```

### Agent Workflow and Tool Orchestration

The app uses the Cloudflare Agents SDK to:
* Stream AI responses in real-time
* Manage conversation state
* Execute tools and workflows
* Support scheduled tasks

Note: Scheduling tools are only enabled when the user explicitly asks for scheduling-related actions.

### Streaming Responses

Responses are streamed token-by-token to the UI for a real-time chat experience.

## Why Durable Objects?

Cloudflare Workers are stateless by design. Durable Objects provide:

* Persistent storage - Retain conversation history
* Single-instance coordination - One object per session
* Perfect fit for chat sessions - Naturally maps to user sessions

Each user session maps to one Durable Object instance, ensuring consistency and state persistence.

## Getting Started

### Prerequisites

* Node.js 18 or higher
* npm
* Cloudflare Wrangler CLI

### Installation

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm start
```

Open your browser and navigate to:

```
http://localhost:5173
```

## Project Structure

```
src/
 ├── server.ts        → Worker + Agent entrypoint
 ├── tools.ts         → Agent tools
 ├── utils.ts         → Tool orchestration helpers
 ├── app.tsx          → Chat UI
 ├── components/      → UI components
 └── styles.css       → Styling
```

## Design Decisions

### Why Workers AI?

* Native Cloudflare integration - Seamless platform integration
* No external API keys required - Simplified setup
* Edge-native inference - Low latency worldwide
* Simplifies deployment - Single platform for entire stack

### Why Agents SDK?

* Built-in streaming - Real-time response delivery
* Tool orchestration - Easy integration of custom tools
* Durable Object integration - Natural state management

### Why Session Memory?

Session-scoped memory demonstrates persistent state while keeping implementation simple and focused.

## Future Improvements

Possible enhancements to consider:

* Voice input using Cloudflare Realtime
* Long-term memory using Vectorize or D1
* Multi-agent workflows
* Background tasks using Cloudflare Workflows
* User authentication and per-user memory
* Analytics and usage tracking
* Multi-language support

## Technology Stack

* Runtime: Cloudflare Workers
* AI Model: Llama 3.3 via Workers AI
* State Management: Durable Objects
* Agent Framework: Cloudflare Agents SDK
* Frontend: React + Vite
* Styling: CSS

## License

MIT License

## Author

Poorna Sai Karthik Lallaboyina

## Learn More

* Cloudflare Workers Documentation: https://developers.cloudflare.com/workers/
* Durable Objects Documentation: https://developers.cloudflare.com/durable-objects/
* Workers AI Documentation: https://developers.cloudflare.com/workers-ai/
* Cloudflare Agents SDK: https://developers.cloudflare.com/agents/


