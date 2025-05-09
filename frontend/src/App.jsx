import Home from './pages/home'
import { Route, Routes} from 'react-router-dom'
import ParentLayout from './components/ParentLayout'
import Login from './pages/Login'
import Register from './pages/Register'
import NewTrip from './components/NewTrip'
import DashBoardLayout from './pages/usersDashboard'
// import TripDescription from './components/tripDescription'
// import TripDescription from './components/tripDescription'
import Itinerary from './components/Itinerary'
// import TravelExperience from './components/travelExperience'
import Blog from './components/Blog'
import ImageUpload from "./components/Dashboard/ImageUpload";
import Logout from './components/Auth/logout'
import Dashboard from './components/Dashboard/Dashboard'
import AllBlogs from './pages/AllBlogs'

function App() {

  return (
    <Routes>
      <Route path='/' element={<ParentLayout/>} >
        <Route index element={<Home/>}/>
        <Route path='login' element={<Login/>}/>
        <Route path='register' element={<Register/>}/>
        <Route path='newtrip' element={<NewTrip/>}/>
        <Route path='uploadimage' element={<ImageUpload/>}/>
        <Route path='logout' element={<Logout/>}/>
        <Route path='blogs' element={<AllBlogs/>}/>
        <Route path='blogs/:id' element={<Blog/>}/>
        <Route path='dashboard' element={<DashBoardLayout/>}>
          <Route index element={<Dashboard/>}/> 
          <Route path='itinerary' element={<Itinerary/>}/>
          <Route path='experience' element={<Dashboard/>}/> 
        </Route>
      </Route>
    </Routes>
  )
}

export default App;
