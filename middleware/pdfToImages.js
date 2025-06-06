import path from "path";
import fs from "fs";
import { fromPath } from "pdf2pic";

const convertPdfToImages = async (pdfPath) => {
  const outputDir = path.dirname(pdfPath);
  const fileNameWithoutExt = path.parse(pdfPath).name;

  const options = {
    density: 100,
    saveFilename: fileNameWithoutExt,
    savePath: outputDir,
    format: "png",
    width: 800,
    height: 1000,
  };

  const convert = fromPath(pdfPath, options);

  try {
    const totalPages = await getPageCount(pdfPath); // helper below

    const conversionPromises = [];
    for (let page = 1; page <= totalPages; page++) {
      conversionPromises.push(convert(page));
    }

    const results = await Promise.all(conversionPromises);

    const imageFiles = results.map(result => result.path);

    return imageFiles;
  } catch (error) {
    console.error("PDF to image conversion error:", error);
    throw error;
  }
};

// Helper function to get total pages using pdf-lib
import { PDFDocument } from "pdf-lib";
const getPageCount = async (pdfPath) => {
  const data = await fs.promises.readFile(pdfPath);
  const pdfDoc = await PDFDocument.load(data);
  return pdfDoc.getPageCount();
};

export default convertPdfToImages;
