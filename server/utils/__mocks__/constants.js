import { vi } from "vitest";
import traceLogger from "../../__mocks__/tracer";

const returnRawQuery = vi.fn();
const logger = traceLogger.colorConsole();

export { returnRawQuery, logger };
