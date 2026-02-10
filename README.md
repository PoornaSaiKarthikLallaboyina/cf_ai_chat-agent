Cloudflare AI Chat Agent
A stateful AI chat application built on Cloudflare using Workers AI, Durable Objects, and the Cloudflare Agents SDK.
Overview
This project demonstrates how to build a complete AI-powered application using Cloudflare's platform primitives, including:

Large Language Model (LLM) - Workers AI with Llama 3.3
Workflow and Coordination Layer - Cloudflare Agents SDK
User Input - Chat UI with streaming responses
Persistent Memory and State - Durable Objects

Architecture
Browser Chat UI → Cloudflare Worker (API + Routing) → Cloudflare Agent (Durable Object) → Workers AI (Llama 3.3)
Components

Cloudflare Workers - API layer and request routing
Cloudflare Agents SDK - Real-time AI chat and workflow orchestration
Durable Objects - Persistent conversation memory and coordination
Workers AI (Llama 3.3) - Large Language Model
Vite Frontend - Chat UI for user input

Features
AI Chat powered by Workers AI
The application uses Llama 3.3 via Workers AI as the LLM provider.
Benefits:

No external API keys required
Runs entirely on Cloudflare's edge network
Low latency responses

Persistent Memory using Durable Objects
Each chat session is handled by a Durable Object instance, which stores conversation history.
This enables:

Session memory across messages
Stateful workflows
Strong consistency

Agent Workflow and Tool Orchestration
The app uses the Cloudflare Agents SDK to:

Stream AI responses in real-time
Manage conversation state
Execute tools and workflows
Support scheduled tasks

Note: Scheduling tools are only enabled when the user explicitly asks for scheduling-related actions.
Streaming Responses
Responses are streamed token-by-token to the UI for a real-time chat experience.
Why Durable Objects?
Cloudflare Workers are stateless by design. Durable Objects provide:

Persistent storage - Retain conversation history
Single-instance coordination - One object per session
Perfect fit for chat sessions - Naturally maps to user sessions

Each user session maps to one Durable Object instance, ensuring consistency and state persistence.
Getting Started
Prerequisites

Node.js 18 or higher
npm
Cloudflare Wrangler CLI

Installation
Install dependencies:
npm install
Start the development server:
npm start
Open your browser and navigate to:
http://localhost:5173
Project Structure

src/server.ts - Worker + Agent entrypoint
src/tools.ts - Agent tools
src/utils.ts - Tool orchestration helpers
src/app.tsx - Chat UI
src/components/ - UI components
src/styles.css - Styling

Design Decisions
Why Workers AI?

Native Cloudflare integration - Seamless platform integration
No external API keys required - Simplified setup
Edge-native inference - Low latency worldwide
Simplifies deployment - Single platform for entire stack

Why Agents SDK?

Built-in streaming - Real-time response delivery
Tool orchestration - Easy integration of custom tools
Durable Object integration - Natural state management

Why Session Memory?
Session-scoped memory demonstrates persistent state while keeping implementation simple and focused.
Future Improvements
Possible enhancements to consider:

Voice input using Cloudflare Realtime
Long-term memory using Vectorize or D1
Multi-agent workflows
Background tasks using Cloudflare Workflows
User authentication and per-user memory
Analytics and usage tracking
Multi-language support

Technology Stack

Runtime: Cloudflare Workers
AI Model: Llama 3.3 via Workers AI
State Management: Durable Objects
Agent Framework: Cloudflare Agents SDK
Frontend: React + Vite
Styling: CSS

Contributing
Contributions are welcome! Please feel free to submit a Pull Request.
License
MIT License
Author
Poorna Sai Karthik Lallaboyina
