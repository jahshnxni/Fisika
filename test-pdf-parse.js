const pdfParse = require("pdf-parse");
const fs = require("fs");

// We don't have a real PDF, but we can check the signature of PDFParse
console.log(pdfParse.PDFParse.toString().substring(0, 100));

// Wait, is it a class?
try {
    const parser = new pdfParse.PDFParse();
} catch (e) { console.log(e.message); }
