import axios from "axios";
import React, { useState } from "react";

// Define the interface for form data
interface QueryFormData {
  name: string;
  email: string;
  message: string;
}

const QueryForm: React.FC = () => {
  const [formData, setFormData] = useState<QueryFormData>({
    name: "",
    email: "",
    message: "",
  });

  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();

    try {
      const response = await axios.post("/api/query/create", formData);
      setSuccess("Your query has been submitted successfully.");
      setFormData({
        name: "",
        email: "",
        message: "",
      });
    } catch (err) {
      setError("There was an error submitting your query. Please try again.");
    }
  };

  return (
    <div className="mx-auto p-4 border-gray-300 rounded-lg shadow-md border my-5 max-w-2xl">
      <h2 className="text-2xl font-bold mb-4">Submit Your Query</h2>
      {success && <p className="text-green-600 mb-4">{success}</p>}
      {error && <p className="text-red-600 mb-4">{error}</p>}
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label
            htmlFor="name"
            className="block text-sm font-medium text-white"
          >
            Name
          </label>
          <input
            type="text"
            id="name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  sm:text-sm bg-black text-white"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="email"
            className="block text-sm font-medium text-white"
          >
            Email
          </label>
          <input
            type="email"
            id="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  sm:text-sm bg-black text-white"
          />
        </div>
        <div className="mb-4">
          <label
            htmlFor="message"
            className="block text-sm font-medium text-white"
          >
            Message
          </label>
          <textarea
            id="message"
            name="message"
            value={formData.message}
            onChange={handleChange}
            rows={4}
            required
            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none  sm:text-sm bg-black text-white"
          />
        </div>
        <button
          type="submit"
          className="w-full px-4 py-2 bg-[rgb(17,24,39)] text-white font-semibold rounded-md shadow-sm hover:bg-[rgb(17,24,39)] focus:outline-none focus:ring-2 focus:ring-[rgb(17,24,39)] focus:ring-offset-2"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default QueryForm;
