import crypto from 'node:crypto';
import { z } from 'zod';

import { env } from '../env';
import { Person } from '../person';
import { emailSchema } from '../prompts';
import { Helpdesk, type Recipient } from './index';

interface FrontConfig {
  // The Front Inbox ID the message will be sent to (inb_...)
  inboxId: `inb_${string}`;
};

/**
 * The message to import into Front.com
 */
interface FrontImportMessage {
  // The sender of the message.
  sender: { handle: string, name?: string, author_id?: string };
  // The recipients of the message.
  to: Array<string>;
  // The email addresses the message is CC'd to.
  cc?: Array<string>;
  // The email addresses the message is BCC'd to.
  bcc?: Array<string>;
  // The subject of the message.
  subject: string;
  // The body of the message.
  body: string;
  // The format of the body.
  body_format?: 'markdown' | 'html';
  // The external ID of the message. (One will be generated if not provided)
  external_id?: string;
  // The creation date of the message. (One will be generated if not provided as the current timestamp)
  created_at?: number;
  // The type of the message.
  type?: 'email' | 'sms' | 'intercom' | 'custom';
  // Assignee ID
  assignee_id?: string;
  // List of Tag Names to add to the conversation
  tags?: Array<string>;
  // If supplied, Front will thread this message into conversation with the given ID. Note that including this parameter nullifies the thread_ref parameter completely.
  conversation_id?: string;
  // Metadata
  metadata?: {
    // Reference which will be used to thread messages. If omitted, Front threads by sender instead
    thread_ref?: string;
    // Determines if message is archived after import.
    is_archived: boolean;
    // Determines if message is received (inbound) or sent (outbound) by you.
    is_inbound: boolean;
    // Determines if rules should be skipped. `true` by default.
    should_skip_rules: boolean;
    // TODO: Support attachments
    // attachments?: Array<File>;
  }
}

/**
 * Helpdesk integration for Front.com
 */
export class FrontHelpdesk extends Helpdesk {
  private inboxId: `inb_${string}`;
  private apiKey: string;

  constructor(config: FrontConfig) {
    if (!env.FRONT_API_KEY) {
      throw new Error('FRONT_API_KEY is not set - please set the FRONT_API_KEY environment variable');
    }

    super();
    this.apiKey = env.FRONT_API_KEY;
    this.inboxId = config.inboxId;
  }

  async sendMessage(sender: Person, recipient: Recipient, message: z.infer<typeof emailSchema>): Promise<void> {
    const body: FrontImportMessage = {
      sender: { handle: sender.email },
      to: recipient.to,
      subject: message.subject,
      body: message.text,
      external_id: `${crypto.randomUUID()}-${Date.now()}`,
      created_at: Date.now() / 1000,
      metadata: {
        is_archived: false,
        is_inbound: true,
        should_skip_rules: false,
      },
    }

    await this.importFrontMessage(JSON.stringify(body));
  }

  /**
   * Calls the Front API to import this message into the helpdesk.
   * @param body - The JSON stringified message to import.
   * @returns The response from the import.
   * @see https://dev.frontapp.com/reference/import-inbox-message
   */
  private async importFrontMessage(body: string): Promise<Response> {
    let response: Response;

    try {
      response = await fetch(`https://api2.frontapp.com/inboxes/${this.inboxId}/imported_messages`, {
        method: 'POST',
        body,
        headers: {
          'Authorization': `Bearer ${this.apiKey}`,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`Failed to import message to Front: ${response.statusText}`);
      }

      return response;
    } catch (error) {
      // TODO: handle rate limiting
      console.error("Error importing message to Front", error);
      throw error;
    }
  }
}
