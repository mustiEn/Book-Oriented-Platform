import { vi } from "vitest";

const traceLogger = {
  colorConsole: vi.fn(() => ({
    log: vi.fn((val) => console.log(val)),
  })),
};

export { traceLogger as default };
