import { vi } from "vitest";
import traceLogger from "../../__mocks__/tracer";

const returnFromRaw = vi.fn();
const logger = traceLogger.colorConsole();

export { returnFromRaw, logger };
