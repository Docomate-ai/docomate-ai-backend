import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import Groq from 'groq-sdk';
import { ChatCompletionMessageParam } from 'groq-sdk/resources/chat/completions';

@Injectable()
export class GroqService {
  constructor(private configService: ConfigService) {}

  async generateWithContext(system: string, context: string, prompt: string) {
    try {
      const messages: ChatCompletionMessageParam[] = [
        { role: 'system', content: system },
        {
          role: 'user',
          content: `### CONTEXT START ###\n${context}\n### CONTEXT END ###\n### PROMPT START ###\n${prompt}\n### PROMPT END ### `,
        },
      ];

      const client = new Groq({
        apiKey: this.configService.get('GROQ_API'),
      });

      const res = await client.chat.completions.create({
        model: 'llama3-70b-8192',
        messages,
      });

      return res.choices[0].message.content;
    } catch (error) {
      console.error(
        `Error generating response from Groq at GroqSerice: in generateWithContext\n ${error.message}`,
      );
      throw new InternalServerErrorException(error.message);
    }
  }
}
