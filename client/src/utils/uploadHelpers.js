import axios from "axios";

export const uploadFile = async (file, endpoint) => {
  try {
    const formData = new FormData();
    formData.append("file", file);

    const response = await axios.post(endpoint, formData, {
      headers: {
        Accept: "application/json",
      },
      withCredentials: true,
      onUploadProgress: (progressEvent) => {
        const percentCompleted = Math.round(
          (progressEvent.loaded * 100) / progressEvent.total
        );
        console.log(`Upload Progress: ${percentCompleted}%`);
      },
    });

    return response.data;
  } catch (error) {
    if (error.response) {
      // Server responded with error
      throw new Error(error.response.data.message || "Upload failed");
    } else if (error.request) {
      // Request made but no response
      throw new Error("No response from server");
    } else {
      // Request setup error
      throw new Error("Error setting up request");
    }
  }
};

export const validateFile = (file, allowedTypes, maxSize) => {
  if (!file) return "No file selected";
  if (!allowedTypes.includes(file.type)) return "Invalid file type";
  if (file.size > maxSize)
    return `File size must be less than ${maxSize / 1024 / 1024}MB`;
  return null;
};
