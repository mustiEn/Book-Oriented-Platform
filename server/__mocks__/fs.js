import { vi } from "vitest";

const fs = {
  existsSync: vi.fn(() => true),
  rm: vi.fn((filePath, cb) => cb()),
};

export { fs as default };
