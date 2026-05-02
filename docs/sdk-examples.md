---
title: SDK Examples
sidebar_label: SDK Examples
description: Code examples for using Osaurus from Python, JavaScript, Swift, Rust, Go, Ruby — plus Anthropic SDK, Open Responses, and the memory header.
---

# SDK Examples

Osaurus is OpenAI-, Anthropic-, Open Responses-, and Ollama-compatible at the same port. Pick whichever your stack already uses; this page has working snippets for the common ones.

For local clients, any value works as the API key. For LAN, Relay, or any non-loopback caller, use an [`osk-v1` access key](/identity#access-keys) — the snippets below show both forms.

## Quick Setup

Before running any examples:

1. **Start Osaurus**: `osaurus serve` or use the UI
2. **Download a model**: Use the Model Manager
3. **Note your URL**: Default is `http://127.0.0.1:1337`

## Python Examples

### Installation

```bash
pip install openai
```

### Basic Chat Completion

```python
from openai import OpenAI

# Initialize client
client = OpenAI(
    base_url="http://127.0.0.1:1337/v1",
    api_key="osaurus"  # any value works for loopback; use an osk-v1 key for LAN/Relay
)

# Simple completion
response = client.chat.completions.create(
    model="gemma-4-e2b-it-4bit",
    messages=[
        {"role": "user", "content": "What is Python best used for?"}
    ]
)

print(response.choices[0].message.content)
```

### Streaming Response

```python
# Stream tokens as they're generated
stream = client.chat.completions.create(
    model="gemma-4-e2b-it-4bit",
    messages=[
        {"role": "user", "content": "Write a story about a brave knight"}
    ],
    stream=True,
    max_tokens=500
)

for chunk in stream:
    if chunk.choices[0].delta.content:
        print(chunk.choices[0].delta.content, end="", flush=True)
```

### With System Prompt

```python
response = client.chat.completions.create(
    model="gemma-4-e2b-it-4bit",
    messages=[
        {"role": "system", "content": "You are a helpful coding tutor. Explain concepts simply."},
        {"role": "user", "content": "What is recursion?"}
    ],
    temperature=0.7,
    max_tokens=300
)

print(response.choices[0].message.content)
```

### Function Calling

```python
import json

# Define available tools
tools = [
    {
        "type": "function",
        "function": {
            "name": "calculate",
            "description": "Perform mathematical calculations",
            "parameters": {
                "type": "object",
                "properties": {
                    "expression": {
                        "type": "string",
                        "description": "Mathematical expression to evaluate"
                    }
                },
                "required": ["expression"]
            }
        }
    },
    {
        "type": "function",
        "function": {
            "name": "get_weather",
            "description": "Get weather for a location",
            "parameters": {
                "type": "object",
                "properties": {
                    "location": {
                        "type": "string",
                        "description": "City name"
                    },
                    "unit": {
                        "type": "string",
                        "enum": ["celsius", "fahrenheit"],
                        "description": "Temperature unit"
                    }
                },
                "required": ["location"]
            }
        }
    }
]

# Make request with tools
response = client.chat.completions.create(
    model="gemma-4-e2b-it-4bit",
    messages=[
        {"role": "user", "content": "What's 25 * 4? Also, how's the weather in Tokyo?"}
    ],
    tools=tools,
    tool_choice="auto"
)

# Process tool calls
if response.choices[0].message.tool_calls:
    messages = [
        {"role": "user", "content": "What's 25 * 4? Also, how's the weather in Tokyo?"},
        response.choices[0].message
    ]

    for tool_call in response.choices[0].message.tool_calls:
        function_name = tool_call.function.name
        arguments = json.loads(tool_call.function.arguments)

        # Simulate tool execution
        if function_name == "calculate":
            result = {"result": eval(arguments["expression"])}
        elif function_name == "get_weather":
            result = {
                "location": arguments["location"],
                "temperature": 22,
                "condition": "Sunny",
                "unit": arguments.get("unit", "celsius")
            }

        # Add tool result to conversation
        messages.append({
            "role": "tool",
            "tool_call_id": tool_call.id,
            "content": json.dumps(result)
        })

    # Get final response
    final_response = client.chat.completions.create(
        model="gemma-4-e2b-it-4bit",
        messages=messages
    )

    print(final_response.choices[0].message.content)
```

### Error Handling

```python
from openai import OpenAI, APIError, APIConnectionError

client = OpenAI(base_url="http://127.0.0.1:1337/v1", api_key="osaurus")

try:
    response = client.chat.completions.create(
        model="gemma-4-e2b-it-4bit",
        messages=[{"role": "user", "content": "Hello!"}],
        timeout=30  # 30 second timeout
    )
    print(response.choices[0].message.content)

except APIConnectionError as e:
    print(f"Connection error: {e}")
    print("Is Osaurus running? Check with: osaurus status")

except APIError as e:
    print(f"API error: {e}")
    print("Check if the model is downloaded")

except Exception as e:
    print(f"Unexpected error: {e}")
```

### Conversation Memory

```python
class ChatBot:
    def __init__(self, model="gemma-4-e2b-it-4bit"):
        self.client = OpenAI(base_url="http://127.0.0.1:1337/v1", api_key="osaurus")
        self.model = model
        self.messages = [
            {"role": "system", "content": "You are a helpful assistant."}
        ]

    def chat(self, user_input):
        # Add user message
        self.messages.append({"role": "user", "content": user_input})

        # Get response
        response = self.client.chat.completions.create(
            model=self.model,
            messages=self.messages
        )

        # Extract assistant message
        assistant_message = response.choices[0].message
        self.messages.append({
            "role": "assistant",
            "content": assistant_message.content
        })

        return assistant_message.content

    def reset(self):
        self.messages = self.messages[:1]  # Keep system message

# Usage
bot = ChatBot()
print(bot.chat("What's the capital of France?"))
print(bot.chat("What's its population?"))  # Remembers context
print(bot.chat("Name 3 famous landmarks there"))  # Continues context
```

### Anthropic SDK

Use the Anthropic Python SDK directly — Osaurus speaks the Messages API at `/anthropic/v1/messages`.

```bash
pip install anthropic
```

```python
import anthropic

client = anthropic.Anthropic(
    base_url="http://127.0.0.1:1337/anthropic",
    api_key="osaurus",  # or an osk-v1 key
)

message = client.messages.create(
    model="gemma-4-e2b-it-4bit",
    max_tokens=1024,
    messages=[
        {"role": "user", "content": "Hello!"}
    ],
)

print(message.content[0].text)
```

Streaming and tool use are fully supported. The same model name namespace as `/v1/chat/completions` applies — you can target `foundation`, any local model, or any cloud model you've configured.

### Open Responses API

```python
import requests

resp = requests.post(
    "http://127.0.0.1:1337/v1/responses",
    json={
        "model": "gemma-4-e2b-it-4bit",
        "input": "What is the capital of France?",
        "instructions": "You are a helpful geography assistant.",
    },
).json()

# The "output" array is a sequence of typed items
for item in resp["output"]:
    if item["type"] == "message":
        for content in item["content"]:
            if content["type"] == "output_text":
                print(content["text"])
```

For multi-turn input, pass an array of items:

```python
resp = requests.post(
    "http://127.0.0.1:1337/v1/responses",
    json={
        "model": "gemma-4-e2b-it-4bit",
        "input": [
            {"type": "message", "role": "user", "content": "What is the capital of France?"},
            {"type": "message", "role": "assistant", "content": "Paris."},
            {"type": "message", "role": "user", "content": "And its population?"},
        ],
    },
).json()
```

### Memory injection (`X-Osaurus-Agent-Id`)

Add the header to any chat request and Osaurus prepends relevant memory automatically.

```python
from openai import OpenAI

client = OpenAI(
    base_url="http://127.0.0.1:1337/v1",
    api_key="osaurus",
    default_headers={"X-Osaurus-Agent-Id": "my-agent"},
)

response = client.chat.completions.create(
    model="gemma-4-e2b-it-4bit",
    messages=[{"role": "user", "content": "What did we talk about last week?"}],
)
```

The header value is an arbitrary string — typically the agent ID you got from `GET /agents`. When the header is missing, the request runs without memory injection. [Memory →](/memory)

### Bulk memory ingestion

Seeding memory from existing chat logs:

```python
import requests

requests.post(
    "http://127.0.0.1:1337/memory/ingest",
    json={
        "agent_id": "my-agent",
        "conversation_id": "old-session-1",
        "turns": [
            {"user": "I'm Alice, I work at Acme.", "assistant": "Got it, Alice."},
            {"user": "I prefer Python over JS.", "assistant": "Noted."},
        ],
    },
).json()
```

Distillation flushes immediately at the end of the batch, so the next chat can reference the imported context right away.

### Using an `osk-v1` access key (LAN / Relay)

Mint a key from **Identity → Access Keys** and pass it as the API key string:

```python
client = OpenAI(
    base_url="http://your-mac.local:1337/v1",
    api_key="osk-v1.eyJpc3M…",
)
```

Anthropic SDK uses `x-api-key` instead of `Authorization`, but the SDK handles that for you when you pass `api_key`:

```python
client = anthropic.Anthropic(
    base_url="http://your-mac.local:1337/anthropic",
    api_key="osk-v1.eyJpc3M…",
)
```

## JavaScript/TypeScript Examples

### Installation

```bash
npm install openai
# or
yarn add openai
```

### Basic Usage (Node.js)

```javascript
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "http://127.0.0.1:1337/v1",
  apiKey: "osaurus",
});

async function main() {
  const completion = await openai.chat.completions.create({
    model: "gemma-4-e2b-it-4bit",
    messages: [{ role: "user", content: "Explain JavaScript closures" }],
  });

  console.log(completion.choices[0].message.content);
}

main();
```

### Streaming (Node.js)

```javascript
async function streamChat() {
  const stream = await openai.chat.completions.create({
    model: "gemma-4-e2b-it-4bit",
    messages: [{ role: "user", content: "Write a poem about coding" }],
    stream: true,
  });

  for await (const chunk of stream) {
    const content = chunk.choices[0]?.delta?.content || "";
    process.stdout.write(content);
  }
}

streamChat();
```

### Browser Usage (Vanilla JS)

```html
<!DOCTYPE html>
<html>
  <head>
    <title>Osaurus Chat</title>
  </head>
  <body>
    <div id="chat"></div>
    <input id="input" type="text" placeholder="Type a message..." />
    <button onclick="sendMessage()">Send</button>

    <script>
      async function sendMessage() {
        const input = document.getElementById("input");
        const chat = document.getElementById("chat");
        const message = input.value;

        // Add user message to chat
        chat.innerHTML += `<p><strong>You:</strong> ${message}</p>`;
        input.value = "";

        try {
          const response = await fetch(
            "http://127.0.0.1:1337/v1/chat/completions",
            {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({
                model: "gemma-4-e2b-it-4bit",
                messages: [{ role: "user", content: message }],
              }),
            },
          );

          const data = await response.json();
          const aiMessage = data.choices[0].message.content;

          // Add AI response to chat
          chat.innerHTML += `<p><strong>AI:</strong> ${aiMessage}</p>`;
        } catch (error) {
          chat.innerHTML += `<p><strong>Error:</strong> ${error.message}</p>`;
        }
      }

      // Send on Enter key
      document.getElementById("input").addEventListener("keypress", (e) => {
        if (e.key === "Enter") sendMessage();
      });
    </script>
  </body>
</html>
```

### React Component

```jsx
import { useState, useCallback } from "react";
import OpenAI from "openai";

const openai = new OpenAI({
  baseURL: "http://127.0.0.1:1337/v1",
  apiKey: "osaurus",
  dangerouslyAllowBrowser: true, // Only for demo, use backend in production
});

function ChatComponent() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);

  const sendMessage = useCallback(async () => {
    if (!input.trim()) return;

    const userMessage = { role: "user", content: input };
    const newMessages = [...messages, userMessage];
    setMessages(newMessages);
    setInput("");
    setLoading(true);

    try {
      const response = await openai.chat.completions.create({
        model: "gemma-4-e2b-it-4bit",
        messages: newMessages,
      });

      const aiMessage = response.choices[0].message;
      setMessages([...newMessages, aiMessage]);
    } catch (error) {
      console.error("Error:", error);
      setMessages([
        ...newMessages,
        {
          role: "assistant",
          content: "Sorry, I encountered an error.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  }, [input, messages]);

  return (
    <div style={{ padding: "20px", maxWidth: "600px", margin: "0 auto" }}>
      <div
        style={{
          height: "400px",
          overflowY: "scroll",
          border: "1px solid #ccc",
          padding: "10px",
          marginBottom: "10px",
        }}
      >
        {messages.map((msg, idx) => (
          <div key={idx} style={{ marginBottom: "10px" }}>
            <strong>{msg.role === "user" ? "You: " : "AI: "}</strong>
            {msg.content}
          </div>
        ))}
        {loading && <div>AI is typing...</div>}
      </div>
      <div style={{ display: "flex", gap: "10px" }}>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyPress={(e) => e.key === "Enter" && sendMessage()}
          placeholder="Type your message..."
          style={{ flex: 1, padding: "5px" }}
          disabled={loading}
        />
        <button onClick={sendMessage} disabled={loading}>
          Send
        </button>
      </div>
    </div>
  );
}

export default ChatComponent;
```

### TypeScript with Type Safety

```typescript
import OpenAI from "openai";
import type { ChatCompletionMessageParam } from "openai/resources/chat";

interface ChatConfig {
  model: string;
  temperature?: number;
  maxTokens?: number;
}

class OsaurusClient {
  private client: OpenAI;
  private config: ChatConfig;

  constructor(config: ChatConfig = { model: "gemma-4-e2b-it-4bit" }) {
    this.client = new OpenAI({
      baseURL: "http://127.0.0.1:1337/v1",
      apiKey: "osaurus",
    });
    this.config = config;
  }

  async chat(messages: ChatCompletionMessageParam[]): Promise<string> {
    const response = await this.client.chat.completions.create({
      model: this.config.model,
      messages,
      temperature: this.config.temperature,
      max_tokens: this.config.maxTokens,
    });

    return response.choices[0].message.content || "";
  }

  async *streamChat(
    messages: ChatCompletionMessageParam[],
  ): AsyncGenerator<string> {
    const stream = await this.client.chat.completions.create({
      model: this.config.model,
      messages,
      stream: true,
    });

    for await (const chunk of stream) {
      const content = chunk.choices[0]?.delta?.content;
      if (content) yield content;
    }
  }
}

// Usage
async function example() {
  const client = new OsaurusClient({
    model: "gemma-4-e2b-it-4bit",
    temperature: 0.7,
    maxTokens: 500,
  });

  // Regular chat
  const response = await client.chat([
    { role: "user", content: "What is TypeScript?" },
  ]);
  console.log(response);

  // Streaming
  const messages: ChatCompletionMessageParam[] = [
    { role: "user", content: "Write a haiku about programming" },
  ];

  for await (const chunk of client.streamChat(messages)) {
    process.stdout.write(chunk);
  }
}
```

## Swift Examples

### Using URLSession

```swift
import Foundation

struct ChatMessage: Codable {
    let role: String
    let content: String
}

struct ChatRequest: Codable {
    let model: String
    let messages: [ChatMessage]
    let stream: Bool = false
}

struct ChatResponse: Codable {
    struct Choice: Codable {
        struct Message: Codable {
            let content: String
        }
        let message: Message
    }
    let choices: [Choice]
}

class OsaurusClient {
    let baseURL = "http://127.0.0.1:1337/v1"

    func chat(message: String) async throws -> String {
        let url = URL(string: "\(baseURL)/chat/completions")!
        var request = URLRequest(url: url)
        request.httpMethod = "POST"
        request.setValue("application/json", forHTTPHeaderField: "Content-Type")

        let chatRequest = ChatRequest(
            model: "gemma-4-e2b-it-4bit",
            messages: [ChatMessage(role: "user", content: message)]
        )

        request.httpBody = try JSONEncoder().encode(chatRequest)

        let (data, _) = try await URLSession.shared.data(for: request)
        let response = try JSONDecoder().decode(ChatResponse.self, from: data)

        return response.choices.first?.message.content ?? ""
    }
}

// Usage
let client = OsaurusClient()
let response = try await client.chat(message: "Hello, Osaurus!")
print(response)
```

### SwiftUI Chat View

```swift
import SwiftUI

struct ContentView: View {
    @State private var messages: [(role: String, content: String)] = []
    @State private var inputText = ""
    @State private var isLoading = false

    let client = OsaurusClient()

    var body: some View {
        VStack {
            ScrollView {
                VStack(alignment: .leading, spacing: 10) {
                    ForEach(Array(messages.enumerated()), id: \.offset) { _, message in
                        HStack {
                            Text(message.role == "user" ? "You:" : "AI:")
                                .fontWeight(.bold)
                            Text(message.content)
                            Spacer()
                        }
                        .padding(.horizontal)
                    }
                }
            }

            HStack {
                TextField("Type a message...", text: $inputText)
                    .textFieldStyle(RoundedBorderTextFieldStyle())
                    .disabled(isLoading)
                    .onSubmit {
                        Task { await sendMessage() }
                    }

                Button("Send") {
                    Task { await sendMessage() }
                }
                .disabled(isLoading || inputText.isEmpty)
            }
            .padding()
        }
    }

    func sendMessage() async {
        let message = inputText
        guard !message.isEmpty else { return }

        messages.append((role: "user", content: message))
        inputText = ""
        isLoading = true

        do {
            let response = try await client.chat(message: message)
            messages.append((role: "assistant", content: response))
        } catch {
            messages.append((role: "assistant", content: "Error: \(error.localizedDescription)"))
        }

        isLoading = false
    }
}
```

## Rust Example

```rust
use reqwest;
use serde::{Deserialize, Serialize};

#[derive(Serialize)]
struct ChatMessage {
    role: String,
    content: String,
}

#[derive(Serialize)]
struct ChatRequest {
    model: String,
    messages: Vec<ChatMessage>,
}

#[derive(Deserialize)]
struct ChatResponse {
    choices: Vec<Choice>,
}

#[derive(Deserialize)]
struct Choice {
    message: Message,
}

#[derive(Deserialize)]
struct Message {
    content: String,
}

#[tokio::main]
async fn main() -> Result<(), Box<dyn std::error::Error>> {
    let client = reqwest::Client::new();

    let request = ChatRequest {
        model: "gemma-4-e2b-it-4bit".to_string(),
        messages: vec![
            ChatMessage {
                role: "user".to_string(),
                content: "What is Rust best for?".to_string(),
            }
        ],
    };

    let response = client
        .post("http://127.0.0.1:1337/v1/chat/completions")
        .json(&request)
        .send()
        .await?
        .json::<ChatResponse>()
        .await?;

    if let Some(choice) = response.choices.first() {
        println!("AI: {}", choice.message.content);
    }

    Ok(())
}
```

## Go Example

```go
package main

import (
    "bytes"
    "encoding/json"
    "fmt"
    "net/http"
)

type ChatMessage struct {
    Role    string `json:"role"`
    Content string `json:"content"`
}

type ChatRequest struct {
    Model    string        `json:"model"`
    Messages []ChatMessage `json:"messages"`
}

type ChatResponse struct {
    Choices []struct {
        Message struct {
            Content string `json:"content"`
        } `json:"message"`
    } `json:"choices"`
}

func main() {
    request := ChatRequest{
        Model: "gemma-4-e2b-it-4bit",
        Messages: []ChatMessage{
            {Role: "user", Content: "What is Go best for?"},
        },
    }

    jsonData, err := json.Marshal(request)
    if err != nil {
        panic(err)
    }

    resp, err := http.Post(
        "http://127.0.0.1:1337/v1/chat/completions",
        "application/json",
        bytes.NewBuffer(jsonData),
    )
    if err != nil {
        panic(err)
    }
    defer resp.Body.Close()

    var chatResp ChatResponse
    if err := json.NewDecoder(resp.Body).Decode(&chatResp); err != nil {
        panic(err)
    }

    if len(chatResp.Choices) > 0 {
        fmt.Println("AI:", chatResp.Choices[0].Message.Content)
    }
}
```

## Ruby Example

```ruby
require 'net/http'
require 'json'
require 'uri'

class OsaurusClient
  def initialize(base_url = 'http://127.0.0.1:1337/v1')
    @base_url = base_url
  end

  def chat(message, model = 'gemma-4-e2b-it-4bit')
    uri = URI.parse("#{@base_url}/chat/completions")

    request = Net::HTTP::Post.new(uri)
    request.content_type = 'application/json'
    request.body = JSON.dump({
      model: model,
      messages: [{ role: 'user', content: message }]
    })

    response = Net::HTTP.start(uri.hostname, uri.port) do |http|
      http.request(request)
    end

    result = JSON.parse(response.body)
    result['choices'][0]['message']['content']
  end
end

# Usage
client = OsaurusClient.new
response = client.chat("What is Ruby best for?")
puts response
```

## Common Patterns

### Retry Logic

```python
import time
from typing import Optional

def chat_with_retry(client, messages, max_retries=3, delay=1) -> Optional[str]:
    for attempt in range(max_retries):
        try:
            response = client.chat.completions.create(
                model="gemma-4-e2b-it-4bit",
                messages=messages
            )
            return response.choices[0].message.content
        except Exception as e:
            if attempt < max_retries - 1:
                time.sleep(delay * (attempt + 1))
                continue
            raise e
    return None
```

### Rate Limiting

```javascript
class RateLimitedClient {
  constructor(maxRequestsPerMinute = 60) {
    this.queue = [];
    this.processing = false;
    this.interval = 60000 / maxRequestsPerMinute;
  }

  async request(messages) {
    return new Promise((resolve, reject) => {
      this.queue.push({ messages, resolve, reject });
      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing || this.queue.length === 0) return;

    this.processing = true;
    const { messages, resolve, reject } = this.queue.shift();

    try {
      const response = await fetch(
        "http://127.0.0.1:1337/v1/chat/completions",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            model: "gemma-4-e2b-it-4bit",
            messages,
          }),
        },
      );

      const data = await response.json();
      resolve(data.choices[0].message.content);
    } catch (error) {
      reject(error);
    }

    setTimeout(() => {
      this.processing = false;
      this.processQueue();
    }, this.interval);
  }
}
```

## Best Practices

1. **Always handle errors gracefully**
2. **Set appropriate timeouts for long-running requests**
3. **Use streaming for better user experience**
4. **Implement retry logic for production**
5. **Monitor token usage with `max_tokens`**
6. **Use system prompts for consistent behavior**
7. **Keep conversation context reasonable in size**

## Additional Resources

- [HTTP API](/api) — endpoint reference
- [Models](/models) — choosing the right model
- [Integrations](/integrations) — framework-specific guides
- [Memory](/memory) — what your AI remembers
- [Memory Internals](/memory-internals) — what `X-Osaurus-Agent-Id` does
- [Identity](/identity) — minting and revoking `osk-v1` keys
