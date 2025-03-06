import { vi } from "vitest";

const stripeProperties = {
  prices: {
    list: vi.fn(() => Promise.resolve([])),
  },
  checkout: {
    sessions: {
      create: vi.fn(() => {
        return {
          url: "url",
        };
      }),
    },
  },
};
const Stripe = vi.fn(() => stripeProperties);

export { Stripe as default, stripeProperties };
