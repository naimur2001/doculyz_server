import prisma from "../lib/prisma";
import path from "path";

// create document
export const createDocument = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
    const documet =await prisma.document.create({
      data: {
        filename: file.originalname,
        filepath: file.path,
        userId: req.user.id,
      },
    });
    res.status(201).json({
      message: "Document uploaded successfully",
      document,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });  
  }
}

//delete document

export const deleteDocument = async (req, res) => {
  const {id}=req.params;
  try{
     const document = await prisma.document.findUnique({
      where: { id },
    });

    if (!document || document.isDeleted) {
      return res.status(404).json({ message: "Document not found" });
    }

     // Optional: Check if this document belongs to the current user
    if (document.userId !== req.user.userId) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await prisma.document.update({
      where: { id },
      data: { isDeleted: true },
    });

    res.status(200).json({ message: "Document deleted successfully" });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });    
  }
}