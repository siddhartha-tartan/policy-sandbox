export const downloadFile = (file: File) => {
  if (!file) {
    console.error("No file to download");
    return;
  }

  // Create a URL for the file using URL.createObjectURL
  const fileURL = URL.createObjectURL(file);

  // Create a temporary anchor element
  const link = document.createElement("a");
  link.href = fileURL;

  // Set the download attribute with the desired file name
  link.download = file.name;

  // Append the link to the body and trigger the download
  document.body.appendChild(link);
  link.click();

  // Clean up
  document.body.removeChild(link);
  URL.revokeObjectURL(fileURL);
};
