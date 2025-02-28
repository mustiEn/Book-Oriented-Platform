import { vi } from "vitest";

const returnRawQuery = vi.fn();
const traceLogger = {
  colorConsole: vi.fn(() => ({
    log: vi.fn((val) => console.log(val)),
  })),
};

export { returnRawQuery, traceLogger as default };
