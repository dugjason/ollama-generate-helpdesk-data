import { z } from 'zod';

import { Person } from "../person";
import { emailSchema } from '../prompts';

export type Recipient = {
  // The email address(es) the message is to.
  to: Array<string>;
};

/**
 * Abstract class implementation for helpdesk integrations. Provides a common interface for sending messages to helpdesks.
 */
export abstract class Helpdesk {
  /**
   * Sends a message to the helpdesk. Uses the Helpdesk provider's API to import the message into the helpdesk, so no emails, etc are sent.
   * @param sender - The person the message is from.
   * @param recipient - The person the message is to (usually your helpdesk email address)
   * @param message - The message to send.
   */
  abstract sendMessage(sender: Person, recipient: Recipient, message: z.infer<typeof emailSchema>): Promise<void>;
}

