import { createContext, useEffect, useState } from "react";
import { jobsData } from "../assets/assets";

export const AppContext = createContext()

export const AppContextProvider = (props) =>{
    const [searchFilter,setSearchFilter] = useState({
        title:'',
        location:''
    });
    // function to fetch job data 
    const fetchJobs = async () =>{
            setJobs(jobsData);
    }
    useEffect(()=>{
            fetchJobs()
    },[])
    const [isSearched,setIsSearched] = useState(false);
    const [jobs,setJobs] = useState([]);
    const [showRecuirterLogin,setShowRecuirterLogin] = useState(false)
    const value ={
        searchFilter,setSearchFilter,
        isSearched,setIsSearched,
        jobs,setJobs,
        showRecuirterLogin,setShowRecuirterLogin


    }
    return (<AppContext.Provider value={value}>
        {props.children}
    </AppContext.Provider>)
}