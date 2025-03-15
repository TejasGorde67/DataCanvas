import { useState } from "react";
import { Upload, FileText, Database } from "lucide-react";

export function DataImporter({
  onImport,
}: {
  onImport: (data: any, name: string) => void;
}) {
  const [isDragging, setIsDragging] = useState(false);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);

    const files = e.dataTransfer.files;
    if (files.length) {
      handleFile(files[0]);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length) {
      handleFile(files[0]);
    }
  };

  const handleFile = (file: File) => {
    const reader = new FileReader();

    reader.onload = (e) => {
      try {
        const result = e.target?.result as string;
        let data;

        if (file.name.endsWith(".json")) {
          data = JSON.parse(result);
        } else if (file.name.endsWith(".csv")) {
          // Simple CSV parsing
          data = result.split("\n").map((line) => line.split(","));
        } else {
          throw new Error("Unsupported file format");
        }

        onImport(data, file.name);
      } catch (error) {
        console.error("Error parsing file:", error);
        alert("Error parsing file. Please check the format.");
      }
    };

    if (file.name.endsWith(".json")) {
      reader.readAsText(file);
    } else if (file.name.endsWith(".csv")) {
      reader.readAsText(file);
    } else {
      alert("Unsupported file format. Please upload JSON or CSV files.");
    }
  };

  return (
    <div
      className={`border-2 border-dashed rounded-lg p-6 text-center ${
        isDragging ? "border-blue-500 bg-blue-500/10" : "border-gray-700"
      }`}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
    >
      <Database className="h-12 w-12 mx-auto mb-4 text-gray-500" />
      <h3 className="text-lg font-medium text-gray-300 mb-2">Import Dataset</h3>
      <p className="text-sm text-gray-500 mb-4">
        Drag and drop a CSV or JSON file, or click to browse
      </p>
      <input
        type="file"
        accept=".csv,.json"
        onChange={handleFileInput}
        className="hidden"
        id="file-upload"
      />
      <label
        htmlFor="file-upload"
        className="px-4 py-2 bg-blue-600 text-white rounded-lg cursor-pointer inline-flex items-center"
      >
        <Upload className="h-4 w-4 mr-2" />
        Browse Files
      </label>
    </div>
  );
}
