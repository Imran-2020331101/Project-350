import { Link } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import {toast} from 'react-toastify'
import { useEffect, useState } from 'react';
import { fetchTrips } from '../../redux/tripSlice';

import ImageCard from './imageCard';
import ImageModal from './ImageModal';
import BlogCard from '../blogCard';
import TripCard from '../TripCard';
import Loader from '../Shared/Loader';
import { fetchUserPhotos } from '../../redux/photoSlice';
const Experiences = () => {
  const user = useSelector((state) => state.auth.user);
  const { blogs, status: blogStatus, error: blogError } = useSelector((state) => state.blogs);
  const {photos, status: photoStatus, error} = useSelector((state)=>state.photos);
  const {trips, status: tripStatus, error:tripError} = useSelector((state)=>state.trips);
  const dispatch = useDispatch();
  
  // Modal state for image popup
  const [selectedPhoto, setSelectedPhoto] = useState(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleImageClick = (photo) => {
    setSelectedPhoto(photo);
    setIsModalOpen(true);
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setSelectedPhoto(null);
  };
  
  useEffect(()=>{
    if(photoStatus === 'idle'){
      dispatch(fetchUserPhotos(user._id));
    }
  })
  
  useEffect(() => {
    if(tripStatus === 'idle'){
      dispatch(fetchTrips(user._id));
    }
  }); 
  

useEffect(() => {
  if (blogError) toast(`Error fetching blog: ${blogError}`);
}, [blogError]);

useEffect(() => {
  if (tripError) toast(`Error fetching trips: ${tripError}`);
}, [tripError]);
 
  if(!user){
    return <Loader/>
  }
   
  const myBlogs = blogs?.filter((blog) => blog.owner == user._id);
  
  return (
    <div className="w-full max-w-7xl px-4 sm:px-6 md:px-10 py-8 overflow-y-auto flex flex-col gap-10 bg-inherit mx-auto">

      {/* Header Action Row */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <h1 className="text-3xl font-bold text-gray-300">Your Experiences</h1>
        <div className="flex flex-col sm:flex-row gap-3">
          <Link
            to="/uploadimage"
            className="px-5 py-2 bg-indigo-600 text-white font-semibold text-sm rounded-lg shadow-md hover:bg-indigo-700 transition text-center"
          >
            Upload Photos
          </Link>
        </div>
      </div>

      {/* Image Gallery Section */}
      <section className="w-full">
        <h2 className="text-xl font-semibold text-gray-700 mb-2">Image Gallery</h2>
        <div className="w-full max-h-[420px] overflow-y-auto flex flex-wrap gap-4 pr-2 scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">          {
            !photos.length ? <h3>No photos to display</h3> :
            photos?.map((photo, index) => (
            <ImageCard key={index} photo={photo} onClick={handleImageClick}/>
          ))}
        </div>
      </section>

      {/* Blog Section */}
      <section className="w-full mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Travel Blogs</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {myBlogs?.map((blog) => (
            <Link key={blog._id} to={`/blogs/${blog._id}`}>
              <BlogCard blogData={blog} />
            </Link>
          ))}
        </div>
      </section>

      {/* Trips Section */}
      <section className="w-full mb-10">
        <h2 className="text-xl font-semibold text-gray-700 mb-4">Your Trip plans</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {trips?.map((trip) => (
            <Link key={trip._id} to={`/dashboard/itinerary/${trip._id}`}>
              <TripCard trip={trip} />
            </Link>
          ))}
        </div>      </section>

      {/* Image Modal */}
      <ImageModal 
        isOpen={isModalOpen}
        onClose={handleCloseModal}
        photo={selectedPhoto}
      />
    </div>
  );
};

export default Experiences;
