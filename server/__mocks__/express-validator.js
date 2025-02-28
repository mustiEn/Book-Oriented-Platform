import { vi } from "vitest";

const validationResult = vi.fn(() => ({
  isEmpty: vi.fn(() => true),
  array: vi.fn(() => []),
}));

const matchedData = vi.fn();

export { validationResult, matchedData };
