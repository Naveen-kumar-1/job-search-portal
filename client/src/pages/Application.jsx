import React, { useContext, useState } from "react";
import Navbar from "../components/Navbar";
import { assets } from "../assets/assets";
import moment from "moment";
import Footer from "../components/Footer";
import { AppContext } from "../context/AppContext";
import { useAuth, useUser } from "@clerk/clerk-react";
import { toast } from "react-toastify"; 
import axios from "axios";
import Loading from "../components/Loading";

const Application = () => {
  const { user } = useUser();
  const { getToken } = useAuth();
  const [isEdit, setIsEdit] = useState(false);
  const [resume, setResume] = useState(null);
  const { backendUrl, userData, userApplications, fetchUserData } = useContext(AppContext);

  const [isLoading, setIsLoading] = useState(false); // Add loading state

  const updateResume = async () => {
    setIsLoading(true); // Start loading
    try {
      if (!resume) {
        toast.error("Please select a resume before saving.");
        setIsLoading(false);
        return;
      }
  
      const formData = new FormData();
      formData.append("resume", resume);
  
      const token = await getToken();
  
      const { data } = await axios.post(
        `${backendUrl}/api/users/update-resume`,
        formData,
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      if (data.success) {
        toast.success(data.message);
        await fetchUserData();
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      console.error("Resume Upload Error:", error);
      toast.error(error.response?.data?.message || error.message);
    } finally {
      setIsLoading(false); // Stop loading
      setIsEdit(false); // Close edit mode
      setResume(null); // Clear the resume
    }
  };

  return userData ? (
    <>
      <Navbar />
      <div className="container px-4 min-h-[65vh] 2xl:px-20 mx-auto my-10">
        <h2 className="text-xl font-semibold">Your Resume</h2>
        <div className="flex gap-2 mb-6 mt-3">
          {/* Only hide the update resume section when loading */}
          {isLoading ? (
           <div className="flex items-center justify-center w-[10px] h-[10px] m-6 py-4">
           <Loading className="w-1 h-1"/>
         </div>
         // Show loading indicator during upload
          ) : (
            <>
              {isEdit || (userData && userData.resume === '') ? (
                <>
                  <label className="flex items-center" htmlFor="resumeUpload">
                    <p className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg mr-2">
                      {resume ? resume.name : 'Select Resume'}
                    </p>
                    <input
                      id="resumeUpload"
                      onChange={e => setResume(e.target.files[0])}
                      accept="application/pdf"
                      type="file"
                      hidden
                    />
                    <img src={assets.profile_upload_icon} alt="Upload" />
                  </label>
                  <button
                    onClick={updateResume}
                    className="bg-green-100 border border-green-400 rounded-lg px-4 py-2"
                  >
                    Save
                  </button>
                </>
              ) : (
                <div className="flex gap-2">
                  <a
                    href={userData.resume}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="bg-blue-100 text-blue-600 px-4 py-2 rounded-lg"
                  >
                    Resume
                  </a>
                  <button
                    onClick={() => setIsEdit(true)}
                    className="text-gray-500 border border-gray-300 rounded-lg px-4 py-2"
                  >
                    Edit
                  </button>
                </div>
              )}
            </>
          )}
        </div>

        <h2 className="text-xl font-semibold mb-4">Job Applied</h2>
        <table className="min-w-full bg-white border rounded-lg"> 
          <thead>
            <tr>
              <th className="py-3 px-4 border-b text-left">Company</th>
              <th className="py-3 px-4 border-b text-left">Job Title</th>
              <th className="py-3 px-4 border-b text-left max-sm:hidden">Location</th>
              <th className="py-3 px-4 border-b text-left max-sm:hidden">Date</th>
              <th className="py-3 px-4 border-b text-left">Status</th>
            </tr>
          </thead>
          <tbody>
            {userApplications.map((job, index) => (
              <tr key={index}>
                <td className="py-3 px-4 flex items-center gap-2 border-b">
                  <img className="w-8 h-8" src={job.companyId.image} alt={job.companyId.name} />
                  {job.companyId.name}
                </td>
                <td className="px-2 py-4 border-b">{job.jobId.title}</td>
                <td className="px-2 py-4 border-b max-sm:hidden">{job.jobId.location}</td>
                <td className="px-2 py-4 border-b max-sm:hidden">{moment(job.date).format('ll')}</td>
                <td className="px-2 py-4 border-b">
                  <span className={`${job.status === 'Accepted' ? 'bg-green-100' : job.status === 'Rejected' ? 'bg-red-100' : 'bg-blue-100'} px-4 py-1.5 rounded-lg`}>
                    {job.status}
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <Footer />
    </>
  ) : (
    <Loading /> // Keep the final Loading as is
  );
};

export default Application;
