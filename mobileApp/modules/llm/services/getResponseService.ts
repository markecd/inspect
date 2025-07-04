export type Message = {
  role: "user" | "assistant";
  content: string;
}

export async function getModelResponse(messages: Message[]) {
  const response = await fetch(
    "https://api.groq.com/openai/v1/chat/completions",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer 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`, 
      },
      body: JSON.stringify({
        model: "llama-3.3-70b-versatile",
        messages: messages,
      }),
    }
    
  );
  const data = await response.json();
  return data.choices[0].message.content;
}

  

  