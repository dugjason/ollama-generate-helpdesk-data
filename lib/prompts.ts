import { generateObject } from "ai";
import { ollama } from "ollama-ai-provider";
import { z } from "zod";

import { Person } from "./person";

export const emailSchema = z.object({
  text: z.string().min(100).max(2_000).describe("The email body"),
  subject: z.string().min(10).max(250).describe("The email subject"),
});

interface GenerateMessageOptions {
  // The prompt to use
  prompt: string;
  // The person who is sending the message
  person: Person;
  // An optional system prompt to use. If not provided, a default system prompt will be used.
  system?: string;
}

// Generate message using Ollama
export async function generateMessage({
  prompt,
  person,
  system,
}: GenerateMessageOptions) {
  const { object } = await generateObject({
    model: ollama("llama3.1"),
    temperature: 1,
    system:
      system ??
      `Your name is ${person.firstName} ${
        person.lastName
      }. The date is ${new Date().toISOString()}.
      Your job is to generate realistic, synthetic email messages to be used while testing a customer support helpdesk.
      Generate an email message as described by the prompt.
      Where appropriate, be creative and add a bit of personality - each message should be unique.
      You may choose to generate a name for the addressee. Alternatively, use a generic greeting like "Hi there" or "Hello".
      Be creative and generate content like IDs as needed. Avoid use of placeholders.
      Write the email in a ${person.tone} tone.
      Keep the email content brief - no more than 500 characters
    `,
    prompt,
    schema: emailSchema,
  });

  console.log(" == Generated message == ");
  console.log("Subject :: ", object.subject);
  console.log("Body :: ", object.text);
  console.log(" == == == == == == == ==\n");
  return object;
}
