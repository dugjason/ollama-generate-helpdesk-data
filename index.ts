import { AsyncLocalStorage } from 'node:async_hooks';

import { FrontHelpdesk } from './lib/helpdesks/front';
import { Person, generatePerson } from './lib/person';
import { generateMessage } from './lib/prompts';

/**
 * This script generates emails and sends them to the Front app.
 * Fill the following variables to control how many emails are generated and sent.
 */

// The number of emails to generate
const numberOfEmails = 10;
// The prompt to use
const prompt = `
## Instructions
  Write an email to the billing department of a software company.
  You may choose to ask about a recent invoice, pricing for a new product, or anything else a billing department might be able to help with.
  The email should be written in a friendly and professional tone.
`;


const personContext = new AsyncLocalStorage<{ person: Person }>();

async function run() {
  for (let i = 0; i < numberOfEmails; i++) {
    const person = generatePerson();

    console.log(`\nGenerating email ${i + 1} / ${numberOfEmails} for ${person.firstName} ${person.lastName}`);
    console.log('Email ::', person.email);
    console.log('Tone ::', person.tone, '\n');

    // Wrap the async operations in personContext.run()
    await personContext.run({ person }, async () => {
      // Generate the email
      const completion = await generateMessage({ prompt, person });

      // Initialize your helpdesk client
      const helpdesk = new FrontHelpdesk({ inboxId: 'inb_9vyz6' });

      // Send the email to Front
      await helpdesk.sendMessage(person, { to: ['support@cloudcontentconsulting.support'] }, completion);

      // Wait for 1 second before the next email
      await new Promise(resolve => setTimeout(resolve, 1_000));
      console.log('--');
    });
  }
}

run().catch(console.error).finally(() => {
  console.log('Done');
  process.exit(0);
});
