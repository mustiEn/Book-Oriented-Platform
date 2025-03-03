import { vi } from "vitest";

export const Topic = {
  findOne: vi.fn(),
  findAll: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  findByPk: vi.fn(),
  findAndCountAll: vi.fn(),
};
