import { vi } from "vitest";

const mockCreate = vi.fn().mockResolvedValue({
  choices: [
    {
      message: {
        content: "Mocked author information",
      },
    },
  ],
});

const Groq = vi.fn(() => {
  return {
    chat: {
      completions: {
        create: mockCreate,
      },
    },
  };
});

export { Groq as default, mockCreate };
