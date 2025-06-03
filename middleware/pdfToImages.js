import path from "path";
import poppler from "pdf-poppler";
import fs from "fs";

const convertPdfToImages= async(pdfPath) =>{
  const outputDir = path.dirname(pdfPath);
  const fileNameWithoutExt = path.parse(pdfPath).name;
  
  const options = {
    format: "png",
    out_dir: outputDir,
    out_prefix: fileNameWithoutExt,
    page: null, // convert all pages
  };

  try {
    await poppler.convert(pdfPath, options);

    // Collect generated image file paths
    const files = fs.readdirSync(outputDir);
    const imageFiles = files
      .filter(file => file.startsWith(fileNameWithoutExt) && file.endsWith(".png"))
      .map(file => path.join(outputDir, file));

    return imageFiles;
  } catch (error) {
    console.error("PDF to image conversion error:", error);
    throw error;
  }
}

export default convertPdfToImages