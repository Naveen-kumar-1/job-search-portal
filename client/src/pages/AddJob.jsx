import React, { useContext, useEffect, useRef, useState } from "react";
import Quill from "quill";
import { JobCategories, JobLocations } from "../assets/assets";
import axios from "axios";
import { AppContext } from "../context/AppContext";
import { toast } from "react-toastify";


const AddJob = () => {
  const [title, setTitle] = useState("");
  const [location, setLocation] = useState("bangalore");
  const [category, setCategory] = useState("Programming");
  const [level, setLevel] = useState("Beinner Level");
  const [salary, setSalary] = useState(0);
  const {backendUrl,companyToken} = useContext(AppContext)
  const editorRef = useRef(null);
  const quillRef = useRef(null);

  useEffect(() => {
    //Iniziate quill only once
    if (!quillRef.current && editorRef.current) {
      quillRef.current = new Quill(editorRef.current, {
        theme: "snow",
      });
    }
  }, []);

  const onSubmitHandler = async (e) => {
    e.preventDefault(); // ✅ Fixed typo

    try {
        if (!quillRef.current) {
            toast.error("Quill editor not initialized.");
            return;
        }

        const description = quillRef.current.root.innerHTML;

        const { data } = await axios.post(
            backendUrl + "/api/company/post-job",
            { title, description, location, salary, category, level },
            { headers: { token: companyToken } }
        );

        if (data.success) {
            toast.success(data.message);
            
            setTitle("");
            setSalary(0); // ✅ Fixed typo
            quillRef.current.root.innerHTML = ""; // ✅ Reset Quill editor properly

        } else {
            toast.error(data.message);
        }
    } catch (error) {
        toast.error(error.response?.data?.message || error.message);
    }
};



  return (
    <form onSubmit={onSubmitHandler} className="container p-4 flex flex-col w-full items-start gap-3">
      <div className="w-full">
        <p className="mb-2">Job Title</p>
        <input
            className="w-full max-w-lg px-3 py-2 border-2 border-gray-300 rounded"
          type="text"
          placeholder="type here..."
          onChange={(e) => setTitle(e.target.value)}
          value={title}
          required
        />
      </div>
      <div className="w-full max-w-lg">
        <p className="my-2">Job description</p>
        <div ref={editorRef}>

        </div>
      </div>
      <div  className="flex flex-col sm:flex-row gap-2 w-full sm:gap-8">
        <div>
          <p className="mb-2">Job category</p>
          <select className="w-full px-3 py-2 border-2 border-gray-300 rounded" onChange={(e) => setCategory(e.target.value)}>
            {JobCategories.map((category, index) => (
              <option value={category} key={index}>
                {category}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="mb-2">Job Location</p>
          <select className="w-full px-3 py-2 border-2 border-gray-300 rounded" onChange={(e) => setLocation(e.target.value)}>
            {JobLocations.map((location, index) => (
              <option value={location} key={index}>
                {location}
              </option>
            ))}
          </select>
        </div>
        <div>
          <p className="mb-2">Job Level</p>
          <select className="w-full px-3 py-2 border-2 border-gray-300 rounded" onChange={(e) => setLevel(e.target.value)}>
            <option value="Begginner Level">Begginner Level</option>
            <option value="Intermediate Level">Intermediate Level</option>
            <option value="Senior Level">Senior Level</option>
          </select>
        </div>
      </div>
      <div>
        <p className="mb-2"> Job Salery</p>
        <input
        className="w-full px-3 py2 border-2 border-gray-300 rounded sm:w-[120px]"
          type="number"
          placeholder="25000"
          onChange={(e) => setSalary(e.target.value)}
          min={0}
        />
      </div>
      <button className="w-20 py-3 mt-4 bg-black text-white rounded">ADD</button>
    </form>
  );
};

export default AddJob;
