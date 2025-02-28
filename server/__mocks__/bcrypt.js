import { genSalt } from "bcrypt";
import { vi } from "vitest";

const bcrypt = {
  compareSync: vi.fn(),
  genSalt: vi.fn(),
  hash: vi.fn(),
};

export { bcrypt as default };
