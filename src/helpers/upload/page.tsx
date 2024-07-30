"use client";

import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import axios from "axios";
import Image from "next/image";
import { Fragment, useState } from "react";
import { v4 as uuidv4 } from "uuid";

const AddContent: React.FC = () => {
  const [files, setFiles] = useState<File[] | null>(null);
  const [urls, setUrls] = useState<string[]>([]);
  const [handing, setHanding] = useState<string>("");

  const Bucket = process.env.NEXT_PUBLIC_AWS_BUCKET_NAME;
  const s3 = new S3Client({
    region: process.env.NEXT_PUBLIC_AWS_REGION,
    credentials: {
      accessKeyId: process.env.NEXT_PUBLIC_AWS_ACCESS_KEY_ID as string,
      secretAccessKey: process.env.NEXT_PUBLIC_AWS_SECRET_ACCESS_KEY as string,
    },
  });

  const handleUploadLocalFiles = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (!e.target.files) return;
    setFiles(Array.from(e.target.files));
  };

  const handleUploadS3 = async (e: any) => {
    if (!files) return;
    e.preventDefault();
    const uploadedUrls: string[] = [];

    const promises = files.map((file) => {
      const ext = file.name.split(".").at(-1);
      const uid = uuidv4().replace(/-/g, "");
      const fileName = `${uid}${ext ? "." + ext : ""}`;

      const uploadToS3 = new PutObjectCommand({
        Bucket,
        Key: fileName,
        Body: file,
        ACL: "public-read",
      });

      return s3.send(uploadToS3).then((response) => {
        if (response.$metadata.httpStatusCode === 200) {
          uploadedUrls.push(
            `https://newbucketfortext.s3.ap-south-1.amazonaws.com/${fileName}`
          );
        }
      });
    });

    try {
      await Promise.all(promises);
      console.log("All files uploaded successfully");
      console.log("Uploaded URLs:", uploadedUrls);
      setUrls(uploadedUrls);
    } catch (error) {
      console.error(error);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await axios.post("/api/content/createContent", { images: urls, handing });
      alert("Content added successfully!");
      setFiles(null);
      setUrls([]);
      setHanding("");
    } catch (error) {
      console.error("Error adding content:", error);
    }
  };

  return (
    <Fragment>
      <div className="max-w-md mx-auto bg-gray-900 p-6 rounded-lg shadow-lg text-white">
        <h2 className="text-xl font-semibold mb-4">Add Content</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block">Images:</label>
            <input
              type="file"
              accept=".png,.jpg,.jpeg"
              multiple
              onChange={handleUploadLocalFiles}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2"
            />
            <button
              onClick={handleUploadS3}
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2 hover:bg-blue-600"
            >
              Upload to S3
            </button>
          </div>
          <div>
            <label className="block">Handing:</label>
            <input
              type="text"
              value={handing}
              onChange={(e) => setHanding(e.target.value)}
              className="w-full bg-gray-800 border border-gray-700 rounded p-2"
              required
            />
          </div>
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add Content
          </button>
        </form>
        {urls.map((img) => (
          <Image key={img} src={img} alt={img} width={100} height={100} />
        ))}
      </div>
    </Fragment>
  );
};

export default AddContent;
