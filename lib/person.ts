import { faker } from '@faker-js/faker';

export type Person = {
  firstName: string;
  lastName: string;
  // Email address
  email: string;
  // Phone number
  phone: string;
  // The way the person writes emails
  tone: string;
};

export function generatePerson(): Person {
  const initPerson = {
    firstName: faker.person.firstName(),
    lastName: faker.person.lastName(),
    phone: faker.phone.number(),
  };

  return {
    ...initPerson,
    email: faker.internet.exampleEmail({ ...initPerson }),
    tone: faker.helpers.arrayElement(['friendly and professional', 'straight-laced and professional', 'technical', 'technical and friendly', 'playful and light-hearted']),
  };
}
