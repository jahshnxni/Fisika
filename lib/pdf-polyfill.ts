// Polyfill for Next.js Node.js runtime to prevent pdf-parse/pdfjs-dist from crashing
// newer pdfjs-dist versions require these browser APIs to exist, even if unused.

if (typeof global !== "undefined") {
    if (typeof (global as any).DOMMatrix === "undefined") {
        (global as any).DOMMatrix = class DOMMatrix { };
    }
    if (typeof (global as any).Path2D === "undefined") {
        (global as any).Path2D = class Path2D { };
    }
}
