import axios from "axios";

export const downloadPreSigned = async <T>(url: T, fileName: string) => {
  try {
    if (!url || typeof url !== "string") {
      throw new Error("Invalid URL provided");
    }
    if (!fileName || typeof fileName !== "string") {
      throw new Error("Invalid file name provided");
    }

    const res = await axios({
      url: String(url),
      method: "GET",
      responseType: "blob",
    });

    const blobUrl = URL.createObjectURL(res?.data);
    if (!blobUrl) {
      throw new Error("Failed to create a Blob URL");
    }

    const sanitizedFileName = fileName.replace(/[^a-zA-Z0-9_\-\.]/g, "_");

    const a = document.createElement("a");
    a.href = blobUrl;
    a.download = sanitizedFileName;

    a.click();
    URL.revokeObjectURL(blobUrl);
  } catch (error) {
    console.error("Error while downloading file:", error);
  }
};
