import prisma from "../lib/prisma";
import path from "path";
import fs from "fs";

// create document
export const createDocument = async (req, res) => {
  try {
    const file = req.file;
    if (!file) {
      return res.status(400).json({ message: "No file uploaded" });
    }
        const title = path.parse(file.originalname).name;

    const documet =await prisma.document.create({
      data: {
        filename: title,
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
  // Optional: remove file from disk
    if (fs.existsSync(document.filepath)) {
      fs.unlinkSync(document.filepath);
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

// GET all documents of the logged-in user
export const getUserDocuments = async (req, res) => {
  try {
    const documents = await prisma.document.findMany({
      where: {
        userId: req.user.id,
        isDeleted: false, // if you're using soft delete
      },
      orderBy: {
        createdAt: "desc",
      },
    });

    res.json({ documents });
  } catch (error) {
    console.error("Get Documents Error:", error);
    res.status(500).json({ message: "Failed to fetch documents" });
  }
};

// GET single document by ID
export const getDocumentById = async (req, res) => {
  try {
    const { id } = req.params;

    const document = await prisma.document.findFirst({
      where: {
        id,
        userId: req.user.id,
        isDeleted: false,
      },
    });

    if (!document) {
      return res.status(404).json({ message: "Document not found" });
    }

    res.json({ document });
  } catch (error) {
    console.error("Get Single Document Error:", error);
    res.status(500).json({ message: "Failed to fetch document" });
  }
};

// search by title

export const searchDocumentsByTitle = async (req, res) => {
  try {
    const { title } = req.query;
    const documents = await prisma.document.findMany({
      where: {
        title: {
          contains: title,
          mode: "insensitive",
        },
        isDeleted: false,
      },
      take: 10,
      orderBy: {
        createdAt: "desc",
      },
    });
    res.json({ documents });
  } catch (error) {
    console.error("Get Single Document Error:", error);
    res.status(500).json({ message: "Failed to fetch document" });
  }
};  
