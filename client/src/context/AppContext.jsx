import { createContext, useEffect, useState } from "react";
import axios from "axios";
import { toast } from "react-toastify"; // Ensure toast is imported
import { useAuth, useUser } from "@clerk/clerk-react";

export const AppContext = createContext();

export const AppContextProvider = (props) => {
  const backendUrl = import.meta.env.VITE_BACKEND_URL;
  const {user } =useUser()
  const {getToken} = useAuth()

  // State declarations
  const [searchFilter, setSearchFilter] = useState({
    title: "",
    location: "",
  });
  const [isSearched, setIsSearched] = useState(false);
  const [jobs, setJobs] = useState([]);
  const [showRecuirterLogin, setShowRecuirterLogin] = useState(false);
  const [companyToken, setCompanyToken] = useState(null);
  const [companyData, setCompanyData] = useState(null);
  const [userData,setUserData] = useState(null)
  const [userApplications,setUserApplications] = useState([])



  // Function to fetch job data
  const fetchJobs = async () => {
    // Assuming jobsData is static for now, otherwise replace with an API call
    try {
        const {data} = await axios.get(backendUrl+'/api/jobs')
        if(data.success){
            setJobs(data.jobs)
            console.log(data);
            
        }else{
            toast.error(data.error)
        }
    } catch (error) {
            toast.error(error.message)
    }
  };

  // Function to fetch company data
  const fetchCompanyData = async () => {

    try {
      const { data } = await axios.get(
        `${backendUrl}/api/company/company`,
        { headers: { token: companyToken } }
      );
      if (data.success) {
        setCompanyData(data.company);
        console.log(data);
      } else {
        toast.error(data.message);
      }
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

//   Function to fetch user Data
const fetchUserData = async ()=>{
    try {
        const token = await getToken()
        const {data} = await axios.get(backendUrl+'/api/users/user',{headers:{Authorization:`Bearer ${token}`}})
        if(data.success){
            setUserData(data.user)
        }else{
            toast.error(data.message)
        }
        
    } catch (error) {
        toast.error(error.message)
    }
}

// get user Applications data

const fetchUserApplictions = async () =>{
    try {
        const token = await getToken()
        const {data} = await axios.get(backendUrl+'/api/users/applications',
            {headers:{Authorization:`Bearer ${token}`}}
        )
        if (data.success) {
            setUserApplications(data.application)

        }else{
            toast.error(data.message)
        }

    } catch (error) {
        toast.error(error.message)
    }
}

  // useEffect to fetch jobs and check for companyToken
  useEffect(() => {
    fetchJobs();

    const storeCompanyToken = localStorage.getItem("companyToken"); // Fixed
    if (storeCompanyToken) {
      setCompanyToken(storeCompanyToken);
    }
  }, []);

  // useEffect to fetch company data when companyToken changes
  useEffect(() => {
    if (companyToken) {
      fetchCompanyData();
    }
  }, [companyToken]);

  useEffect(()=>{
    if(user){
        fetchUserData()
        fetchUserApplictions()
    }
  },[user])



  const value = {
    searchFilter,
    setSearchFilter,
    isSearched,
    setIsSearched,
    jobs,
    setJobs,
    showRecuirterLogin,
    setShowRecuirterLogin,
    companyToken,
    setCompanyToken,
    companyData,
    setCompanyData,
    backendUrl,
    userData,
    userApplications,setUserApplications,
    fetchUserData,fetchUserApplictions
  };

  return (
    <AppContext.Provider value={value}>
      {props.children}
    </AppContext.Provider>
  );
};
