import React, { useContext } from 'react'
import { Route, Routes } from 'react-router-dom'
import { AppContext } from './context/AppContext'
import Home from './pages/Home'
import ApplyJob from './pages/ApplyJob'
import Application from './pages/Application'
import DashBoard from './pages/DashBoard'
import AddJob from './pages/AddJob'
import ManageJobs from './pages/ManageJobs'
import ViewApplications from './pages/ViewApplications'
import RecuiterLogin from './components/RecuiterLogin'
import { ToastContainer } from 'react-toastify';
import 'quill/dist/quill.snow.css'

const App = () => {
  const { showRecuirterLogin, companyToken } = useContext(AppContext)

  return (
    <div>
      {showRecuirterLogin && <RecuiterLogin />}
      <ToastContainer />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/apply-job/:id' element={<ApplyJob />} />
        <Route path='/application' element={<Application />} />
        
        {companyToken && (
          <Route path='/dashboard' element={<DashBoard />}>
            <Route path='add-job' element={<AddJob />} />
            <Route path='manage-job' element={<ManageJobs />} />
            <Route path='view-applications' element={<ViewApplications />} />
          </Route>
        )}
      </Routes>
    </div>
  )
}

export default App
