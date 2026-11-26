
import Docxtemplater from "docxtemplater";
import PizZip from "pizzip";
import { saveAs } from "file-saver";

export const generateDocument = async (data) => {
  try {
    // Load the Word template from the public folder
    const response = await fetch(
      `${import.meta.env.BASE_URL}templates/agreement-template.docx`
    );

    if (!response.ok) {
      throw new Error("Unable to load Word template.");
    }

    const content = await response.arrayBuffer();

    // Read the Word document
    const zip = new PizZip(content);

    // Initialize Docxtemplater
    const doc = new Docxtemplater(zip, {
      paragraphLoop: true,
      linebreaks: true,
    });

    // Replace Word placeholders with application data
    doc.render(data);

    // Generate the final Word document
    const blob = doc.getZip().generate({
      type: "blob",
      mimeType:
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    });

    // Download the document
    saveAs(blob, `Loan_Agreement_${data.borrowerName}.docx`);

  } catch (error) {
    console.error("Document generation failed:", error);
    throw error;
  }
};
