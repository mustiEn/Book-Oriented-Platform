import { vi } from "vitest";

export const Comment = {
  findOne: vi.fn(),
  findAll: vi.fn(),
  create: vi.fn(),
  update: vi.fn(),
  findByPk: vi.fn(),
};
