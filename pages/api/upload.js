import cloudinary from "../utils/cloudinary";
import multiparty from "multiparty";
import { isAdminRequest } from "./auth/[...nextauth]";
import { mongooseConnect } from "@/lib/mongoose";

export const config = {
  api: {
    bodyParser: false, // Disable Next.js body parser to handle file uploads manually
  },
};

export default async function handler(req, res) {
  await mongooseConnect();

  await isAdminRequest(req, res);
  if (req.method === "POST") {
    const form = new multiparty.Form();

    // Parse the form data
    form.parse(req, async (err, fields, files) => {
      if (err) {
        console.error("Error parsing form:", err);
        return res.status(500).json({ error: "Error parsing form" });
      }

      try {
        // Access the uploaded file (assuming the input name is 'file')
        const file = files.file[0];

        // Upload the file to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(file.path, {
          folder: "product_images", // Folder in Cloudinary
        });

        // Return the uploaded image URL
        return res.status(200).json({
          url: uploadResult.secure_url,
        });
      } catch (error) {
        console.error("Cloudinary upload failed:", error);
        return res.status(500).json({ error: "Cloudinary upload failed" });
      }
    });
  } else {
    res.status(405).json({ message: "Method not allowed" });
  }
}
