import axios from "axios";
import React, { useEffect, useState } from "react";

interface IContent {
  _id: string;
  images: string[];
  handing: string;
}

const DeleteContent: React.FC = () => {
  const [contentList, setContentList] = useState<IContent[]>([]);
  const [selectedContent, setSelectedContent] = useState<string>("");

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get<IContent[]>(
        "/api/mobileContent/getAllContent"
      );
      setContentList(response.data);
    } catch (error) {
      console.error("Error fetching content:", error);
    }
  };

  const handleDelete = async () => {
    try {
      await axios.delete(`/api/mobileContent/deleteContent/${selectedContent}`);
      alert("Content deleted successfully!");
      setSelectedContent("");
    } catch (error) {
      console.error("Error deleting content:", error);
    }
  };

  return (
    <div>
      <h2>Delete Content</h2>
      <div>
        <label>Select Content:</label>
        <select onChange={(e) => setSelectedContent(e.target.value)}>
          <option value="">Select Content</option>
          {contentList.map((content) => (
            <option key={content._id} value={content._id}>
              {content.images.join(", ")}
            </option>
          ))}
        </select>
      </div>
      {selectedContent && (
        <button onClick={handleDelete}>Delete Content</button>
      )}
    </div>
  );
};

export default DeleteContent;
