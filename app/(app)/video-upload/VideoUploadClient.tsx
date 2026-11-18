
"use client";

import { useState, useRef, type FormEvent, type ChangeEvent } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

const MAX_FILE_SIZE = 70 * 1024 * 1024; // 70 MB

const VideoUpload = () => {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  const [uploadError, setUploadError] = useState("");

  const fileInputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();

  // Handle file selection and validation
  const handleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    const selectedFile = e.target.files?.[0];

    setUploadError("");

    if (!selectedFile) {
      setFile(null);
      return;
    }

    if (selectedFile.size > MAX_FILE_SIZE) {
      setUploadError("File size cannot exceed 70 MB.");
      setFile(null);
      e.target.value = "";
      return;
    }

    setFile(selectedFile);
  };

  // Handle form submission
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    if (isUploading) return;

    if (!file) {
      setUploadError("Please select a video file.");
      return;
    }

    // Final file-size validation
    if (file.size > MAX_FILE_SIZE) {
      setUploadError("File size exceeds the maximum allowed limit of 70 MB.");
      setFile(null);

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      return;
    }

    setIsUploading(true);
    setUploadError("");

    const formData = new FormData();

    formData.append("file", file);
    formData.append("title", title);
    formData.append("description", description);
    formData.append("originalSize", file.size.toString());

    try {
      const response = await axios.post("/api/video-upload", formData);

      console.log("Video uploaded successfully:", response.data);

      // Reset form only after successful upload
      setFile(null);
      setTitle("");
      setDescription("");

      if (fileInputRef.current) {
        fileInputRef.current.value = "";
      }

      router.push("/");

    } catch (error) {
      console.error("Video upload failed:", error);

      setUploadError(
        axios.isAxiosError(error)
          ? error.response?.data?.message || "Video upload failed. Please try again."
          : "Something went wrong. Please try again."
      );

    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Upload Video</h1>

      <form onSubmit={handleSubmit} className="space-y-4">

        <div>
          <label className="label">
            <span className="label-text">Title</span>
          </label>

          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="input input-bordered w-full"
            required
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Description</span>
          </label>

          <textarea
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            className="textarea textarea-bordered w-full"
          />
        </div>

        <div>
          <label className="label">
            <span className="label-text">Video File</span>
          </label>

          <input
            ref={fileInputRef}
            type="file"
            accept="video/*"
            onChange={handleFileChange}
            className="file-input file-input-bordered w-full"
            required
          />
        </div>

        {uploadError && (
          <div role="alert" className="alert alert-error mt-2">
            <span>{uploadError}</span>
          </div>
        )}

        <button
          type="submit"
          className="btn btn-primary"
          disabled={isUploading}
        >
          {isUploading ? "Uploading..." : "Upload Video"}
        </button>

      </form>
    </div>
  );
};

export default VideoUpload;
