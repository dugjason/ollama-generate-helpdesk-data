import crypto from "node:crypto";
import { z } from "zod";

import { env } from "../env";
import { Person } from "../person";
import { emailSchema } from "../prompts";
import { Helpdesk, type Recipient } from "./index";


/**
 * The ticket to create in Zendesk
 */
interface ZendeskImportMessage {
  // The ticket to create.
  ticket: {
    subject: string;
    // The body of the message.
    comment: { body: string };
    // The requester of the message.
    requester: { name: string; email: string };
    assignee_email?: string;
    // The external ID of the message. (One will be generated if not provided)
    external_id?: string;
    // The creation date of the message. (One will be generated if not provided as the current timestamp)
    created_at?: string;
    // List of Tag Names to add to the conversation
    tags?: Array<string>;
  };
}

/**
 * Helpdesk integration for Zendesk
 */
export class ZendeskHelpdesk extends Helpdesk {
  private apiKey: string;
  private email: string;
  private subdomain: string;

  constructor() {
    const requiredEnvVars = ["ZENDESK_API_KEY", "ZENDESK_EMAIL", "ZENDESK_SUBDOMAIN"];
    requiredEnvVars.forEach((varName) => {
      if (!env[varName as keyof typeof env]) {
        throw new Error(`${varName} is not set - please set the ${varName} environment variable`);
      }
    });

    super();
    this.apiKey = env.ZENDESK_API_KEY!;
    this.email = env.ZENDESK_EMAIL!;
    this.subdomain = env.ZENDESK_SUBDOMAIN!;
  }

  async sendMessage(
    sender: Person,
    recipient: Recipient,
    message: z.infer<typeof emailSchema>
  ): Promise<void> {
    const body: ZendeskImportMessage = {
      ticket: {
        subject: message.subject,
        comment: { body: message.text },
        requester: {
          name: `${sender.firstName} ${sender.lastName}`,
          email: sender.email,
        },
        ...(recipient.to[0] && { assignee_email: recipient.to[0] }),
      },
    };

    await this.importZendeskMessage(JSON.stringify(body));
  }

  /**
   * Calls the Zendesk API to import this message into the helpdesk.
   * @param body - The JSON stringified message to import.
   * @returns The response from the import.
   * @see https://developer.zendesk.com/api-reference/ticketing/tickets/tickets/
   */
  private async importZendeskMessage(body: string): Promise<Response> {
    let response: Response;
    try {
      const authString = `${Buffer.from(
        `${this.email}/token:${this.apiKey}`
      ).toString("base64")}`;
      response = await fetch(
        `https://${this.subdomain}.zendesk.com/api/v2/tickets.json`,
        {
          method: "POST",
          body,
          headers: {
            Authorization: `Basic ${authString}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (!response.ok) {
        throw new Error(
          `Failed to import message to Zendesk: ${response.statusText}`
        );
      }

      return response;
    } catch (error) {
      // TODO: handle rate limiting
      console.error("Error importing message to Zendesk", error);
      throw error;
    }
  }
}
