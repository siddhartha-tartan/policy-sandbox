export const uploadFileToSignedUrl = async (url: string, file: File) => {
  try {
    await fetch(url, {
      method: "PUT",
      body: file,
      headers: {
        "Content-Type": file.type,
      },
    });
    return true;
  } catch (error) {
    return false;
  }
};
