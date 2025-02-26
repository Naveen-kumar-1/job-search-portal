import React, { useContext } from 'react'
import ApplyJob from './pages/ApplyJob'
import  Home from './pages/Home'
import Application from './pages/Application'
import { Route,Routes } from 'react-router-dom'
import RecuiterLogin from './components/RecuiterLogin'
import { AppContext } from './context/AppContext'
import DashBoard from './pages/DashBoard'
import AddJob from './pages/AddJob'
import ManageJobs from './pages/ManageJobs'
import ViewApplications from './pages/ViewApplications'
import 'quill/dist/quill.snow.css'

const App = () => {
  const {showRecuirterLogin} = useContext(AppContext)
  return (
    
    <div>
      {showRecuirterLogin && <RecuiterLogin/>}
        <Routes>
    <Route path='/' element={<Home/>} />
    <Route path='/apply-job/:id' element={<ApplyJob/>} />
    <Route path='/application' element={<Application/>} />
    <Route path='/dashboard' element={<DashBoard/>}>
      <Route path='add-job' element={<AddJob/>}/>
      <Route path='manage-job' element={<ManageJobs/>}/>
      <Route path='view-applications' element={<ViewApplications/>}/>
    </Route>

</Routes>
    </div>
  )
}

export default App