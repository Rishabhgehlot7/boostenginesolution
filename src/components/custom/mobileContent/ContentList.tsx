import axios from 'axios';
import React, { useEffect, useState } from 'react';

interface IContent {
  _id: string;
  images: string[];
  handing: string;
}

const ContentList: React.FC = () => {
  const [contentList, setContentList] = useState<IContent[]>([]);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    try {
      const response = await axios.get<IContent[]>('/api/mobileContent/getAllContent');
      setContentList(response.data);
    } catch (error) {
      console.error('Error fetching content:', error);
    }
  };

  return (
    <div className="max-w-md mx-auto bg-gray-900 p-6 rounded-lg shadow-lg">
      <h2 className="text-xl font-semibold text-white mb-4">Content List</h2>
      <ul>
        {contentList.map(content => (
          <li key={content._id} className="text-white mb-4">
            <div>
              <strong>Images:</strong> {content.images.join(', ')}
            </div>
            <div>
              <strong>Handing:</strong> {content.handing}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ContentList;
