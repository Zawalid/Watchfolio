/// <reference types="vite/client" />

declare global {
    /**
     * A global debug logger that only runs in development.
     */
    const log: (...args: unknown[]) => void;
}

// You must add this line to make theK file a module
export { };