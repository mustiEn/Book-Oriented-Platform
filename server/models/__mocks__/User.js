import { vi } from "vitest";

export const User = {
  findOne: vi.fn(),
  findAll: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  findByPk: vi.fn(),
};
