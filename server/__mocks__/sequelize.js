import { vi } from "vitest";

const Sequelize = vi.fn(() => {
  return {
    transaction: vi.fn(),
    literal: vi.fn(),
  };
});

export { Sequelize };
