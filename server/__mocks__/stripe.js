import { vi } from "vitest";

const stripeProperties = {
  prices: {
    list: vi.fn(),
  },
  checkout: {
    sessions: {
      create: vi.fn(),
    },
  },
};
const Stripe = vi.fn();

export { Stripe as default, stripeProperties };
