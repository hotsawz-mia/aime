export class OpenAI {
  constructor() {}
  chat = {
    completions: {
      create: jest.fn().mockResolvedValue({
        choices: [{ message: { content: 'Mocked response' } }],
      }),
    },
  };
}
