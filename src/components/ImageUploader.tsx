import useAuth from "@/hooks/use-auth";
import { useState } from "react";

const ImageUploader = () => {

    const [id] = useAuth();
    const [file, setFile] = useState(null);
    const [imageId, setImageId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const handleFileChange = (event) => {
        const selectedFile = event.target.files[0];
        if (selectedFile) {
            setFile(selectedFile);
            setError(""); // Clear errors if any
        }
    };

    const handleUpload = async () => {
        if (!file) {
            setError("Please select a file first.");
            return;
        }

        setLoading(true);
        setError("");

        const formData = new FormData();
        formData.append("file", file);

        try {
            const response = await fetch("/api/images", {
                method: "POST",
                headers: {
                    Authorization: `Bearer ${id}`, // Ensure the token is valid
                    // Do NOT set 'Content-Type', fetch will handle it for FormData
                },
                body: formData,
            });

            if (!response.ok) {
                throw new Error(`Upload failed. Status: ${response.status}`);
            }

            const data = await response.json();
            setImageId(data.id); // The API response format is { id: "string", data: "string" }
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="border rounded-lg shadow-md">
            <input type="file" accept="image/*" onChange={handleFileChange} />
            <button
                className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
                onClick={handleUpload}
                disabled={loading}
            >
                {loading ? "Uploading..." : "Upload Image"}
            </button>

            {error && <p className="text-red-500 mt-2">{error}</p>}
            {imageId && <p className="mt-2">Image ID: {imageId}</p>}
        </div>
    );
};

export default ImageUploader;
