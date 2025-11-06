import { anthropic } from '@ai-sdk/anthropic';
import { streamText } from 'ai';

export const runtime = 'edge';

export async function POST(req: Request) {
  const { message, articleContent, articleTitle, history } = await req.json();

  const systemPrompt = `You are helping readers understand: "${articleTitle}"

ARTICLE TEXT:
${articleContent}

CRITICAL INSTRUCTIONS - FOLLOW EXACTLY:

1. START with markdown heading: ## 📖 Article Outline

2. Create a simple bulleted list of ONLY the main section headings from the article. Each item should be JUST the heading wrapped in citation tags, NO descriptions:
   - [cite:Introduction]Introduction[/cite]
   - [cite:Background]Background[/cite]
   - [cite:Methodology]Methodology[/cite]

   Use the EXACT heading text from the article. DO NOT add any descriptions after the headings. Keep it minimal.

3. After the outline, create these sections with ## headings:

   ## 🎯 What Problem Does This Solve?
   Write 2-3 paragraphs explaining the core challenge. Use [cite:exact quote]text[/cite] to reference the article.

   ## 💡 The Solution
   Explain the main innovation. MUST include:
   [artifact:diagram]
   graph TD
       A[Problem] --> B[Solution Step]
       B --> C[Result]
   [/artifact]

   ## 🔍 How It Works
   Break down the key technical concepts. Use multiple [cite:...]...[/cite] references.

   ## 📊 Results & Impact
   What did they achieve? Why does it matter?

REQUIREMENTS - YOU MUST:
- Use ## for section headings
- Include at least 2 [artifact:diagram] blocks showing system architecture
- Use [cite:exact text]description[/cite] at least 15 times
- Write 10+ paragraphs total
- Use proper markdown formatting
- Keep the Article Outline MINIMAL - just clickable heading links, NO descriptions

EXAMPLE DIAGRAM:
[artifact:diagram]
graph LR
    A[Edge Device] --> B[GPU Scheduler]
    B --> C[Green Context Policy]
    C --> D[Consistent Frames]
[/artifact]

DO NOT write a short summary. DO NOT ask if user wants more. Create the FULL guide immediately.`;

  const messages = [
    ...history.map((msg: any) => ({
      role: msg.role,
      content: msg.content,
    })),
    {
      role: 'user' as const,
      content: message,
    },
  ];

  const result = await streamText({
    model: anthropic('claude-sonnet-4-5-20250929'),
    system: systemPrompt,
    messages,
    maxTokens: 4096,
  });

  return result.toTextStreamResponse();
}
