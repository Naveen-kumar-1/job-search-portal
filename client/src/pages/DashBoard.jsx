import React, { useContext, useEffect } from "react";
import { NavLink, Outlet, useNavigate } from "react-router-dom";
import { assets } from "../assets/assets";
import { AppContext } from "../context/AppContext";

const DashBoard = () => {
    const navigate = useNavigate();
    const { companyData, setCompanyToken, setCompanyData } = useContext(AppContext);

    const handleLogout = () => {
        localStorage.removeItem("companyToken"); // Clear token
        setCompanyToken(null); // Reset context
        setCompanyData(null);
        navigate("/"); // Redirect to login
    }
    useEffect(() => {
      if (companyData) {
        navigate('/dashboard/manage-job');
      }
    }, [companyData]);
    return (
        <div className="min-h-screen">
            {/* Navbar for recruiter panel */}
            <div className="shadow py-4">
                <div className="px-5 flex justify-between items-center">
                    <img
                        onClick={() => navigate("/")}
                        src={assets.logo}
                        alt="Company Logo"
                        className="max-sm:w-32 cursor-pointer"
                    />
                    <div className="flex items-center gap-3">
                        {companyData && (
                            <div className="flex items-center space-x-3">
                                <p className="max-sm:hidden">Welcome, {companyData.name}</p>

                                <div className="relative group">
                                    <img
                                        src={companyData.image}
                                        className="w-8 h-8 border border-amber-100 rounded-full"
                                        alt="Company Logo"
                                    />

                                    <div className="absolute  hidden group-hover:block top-8 right-0 z-10 text-black rounded w-max pt-2">
                                        <ul className="list-none m-0 p-2 bg-white rounded-md border border-amber-100 text-sm shadow-md">
                                            <li
                                                className="py-1 px-4 cursor-pointer hover:bg-gray-200"
                                                onClick={handleLogout}
                                            >
                                                Logout
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            <div className="flex items-start">
                {/* Left Sidebar */}
                <div className="inline-block min-h-screen border-r">
                    <ul className="flex flex-col items-start pt-5 text-gray-800">
                        <NavLink
                            to="/dashboard/add-job"
                            className={({ isActive }) =>
                                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${
                                    isActive ? "bg-blue-100 border-r-4 border-blue-500" : ""
                                }`
                            }
                        >
                            <img className="min-w-4" src={assets.add_icon} alt="Add Job" />
                            <p className="max-sm:hidden">Add Job</p>
                        </NavLink>
                        <NavLink
                            to="/dashboard/manage-job"
                            className={({ isActive }) =>
                                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${
                                    isActive ? "bg-blue-100 border-r-4 border-blue-500" : ""
                                }`
                            }
                        >
                            <img className="min-w-4" src={assets.home_icon} alt="Manage Jobs" />
                            <p className="max-sm:hidden">Manage Jobs</p>
                        </NavLink>
                        <NavLink
                            to="/dashboard/view-applications"
                            className={({ isActive }) =>
                                `flex items-center p-3 sm:px-6 gap-2 w-full hover:bg-gray-100 ${
                                    isActive ? "bg-blue-100 border-r-4 border-blue-500" : ""
                                }`
                            }
                        >
                            <img className="min-w-4" src={assets.person_tick_icon} alt="View Applications" />
                            <p className="max-sm:hidden">View Application</p>
                        </NavLink>
                    </ul>
                </div>

                <div className="flex-1 h-full p-2 sm:p-5 ">
                    <Outlet />
                </div>
            </div>
        </div>
    );
};

export default DashBoard;
