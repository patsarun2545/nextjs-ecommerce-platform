import ImageKit from "imagekit";
import sharp from "sharp";

const imagekit = new ImageKit({
  publicKey: process.env.IMAGEKIT_PUBLIC_KEY!,
  privateKey: process.env.IMAGEKIT_PRIVATE_KEY!,
  urlEndpoint: process.env.IMAGEKIT_URL_ENDPOINT!,
});

export const uploadToImageKit = async (file: File, label: string) => {
  try {
    if (!file) {
      return {
        message: "No file provided",
      };
    }

    // Check File Size
    if (file.size > 5 * 1024 * 1024) {
      return {
        message: "File size exceeds 5MB limit",
      };
    }

    // Read File Buffer
    const buffer = await file.arrayBuffer();

    const processedImageBuffer = await sharp(Buffer.from(buffer))
      .webp({
        quality: 80,
        lossless: false,
        effort: 4,
      })
      .resize({
        width: 1200,
        height: 1200,
        fit: "inside",
        withoutEnlargement: true,
      })
      .toBuffer();

    const result = await imagekit.upload({
      file: processedImageBuffer,
      fileName: `${label}_${Date.now()}_${file.name}`,
      folder: `/${label}`,
    });

    return {
      url: result.url,
      fileId: result.fileId,
    };
  } catch (error) {
    console.error("Error uploading image to imagekit:", error);
    return {
      message: "Failed to upload image",
    };
  }
};

export const deleteFromImageKit = async (fileId: string) => {
  try {
    if (!fileId) {
      return {
        message: "No file id",
      };
    }

    await imagekit.deleteFile(fileId);
  } catch (error) {
    console.error("Error deleting image from imagekit:", error);
    return {
      message: "Failed to delete image",
    };
  }
};
