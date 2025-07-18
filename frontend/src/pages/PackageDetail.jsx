import { CalendarDays, MapPin, DollarSign, Users, PlaneTakeoff, Info, Camera, Compass, Mountain, Sun } from 'lucide-react';
import { Link, useParams, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { bookGroup, cancelBooking, fetchGroups } from '../redux/groupSlice';
import { toast } from 'react-toastify';
import { useEffect } from 'react';

const PackageDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const { groups, status: groupStatus } = useSelector((state) => state.groups);
  const { isSignedIn, user } = useSelector((state) => state.auth);
  
  const tripData = groups.find((p) => p._id === id);

  // Fetch groups on component mount and after booking/cancellation, or user change
  useEffect(() => {
    console.log('Dispatching fetchGroups on mount/update');
    dispatch(fetchGroups());
  }, [dispatch, user]);

  // Helper function to format dates
  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  // Find related trips (can be memoized if performance is an issue)
  const relatedGroups = groups
    .filter((g) => g._id !== id && g.tags?.some((tag) => tripData?.tags?.includes(tag)))
    .slice(0, 3);

  const handleBooking = async () => {
    if (!isSignedIn) {
      toast.error('Please log in to book this trip');
      navigate('/login');
      return;
    }

    if (!tripData) {
      toast.error('Trip data not available');
      return;
    }

    try {
      if (tripData.isBooked) {
        const result = await dispatch(cancelBooking({ 
          groupId: tripData._id, 
          userId: user._id 
        })).unwrap();
        
        toast.success('Booking cancelled successfully');
        // The fetchGroups() below will update the state
      } else {
        const result = await dispatch(bookGroup({ 
          groupId: tripData._id, 
          userId: user._id 
        })).unwrap();
        
        toast.success('Trip booked successfully');
        // The fetchGroups() below will update the state
      }
      // Re-fetch groups after booking/cancellation to ensure data is fresh
      dispatch(fetchGroups()); 
    } catch (error) {
      console.error('Booking error:', error);
      console.log('Full error object:', JSON.stringify(error, null, 2));
      toast.error(error.message || 'Failed to process booking');
    }
  };

  if (groupStatus === 'loading' && !tripData) {
    return <div className="text-center py-10 text-white">Loading trip details...</div>;
  }

  if (!tripData) {
    return <div className="text-center py-10 text-white">Trip data not available.</div>;
  }

  console.log('Rendering Trip Data:', tripData);
  console.log('Rendering Is Booked:', tripData.isBooked);

  const {
    title,
    days,
    place,
    about,
    startDate,
    endDate,
    activities,
    availableSpots,
    expectedCost,
    startingPointOfGroup,
    images,
    highlights,
    itinerary,
    goodToKnow,
    isBooked,
  } = tripData;

  return (
    <div className="bg-[#111827] min-h-screen pt-12 text-white w-full">
      {/* Hero Section */}
      <div className="relative mx-[12%] h-96 overflow-hidden rounded-xl shadow-lg mb-8">
        <img src={images && images[0]} alt={title} className="w-full h-full object-cover transition-transform duration-500 transform scale-100 hover:scale-105" />
        <div className="absolute inset-0 bg-black opacity-40"></div>
        <div className="absolute bottom-6 left-6 text-white">
          <h1 className="text-3xl md:text-4xl font-bold mb-2">{title}</h1>
          <p className="text-sm md:text-md"><MapPin className="inline-block mr-1" size={16} /> {place}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 px-6">
        {/* Left Column */}
        <div className="md:col-span-2 bg-gray-800 rounded-xl shadow-md p-6">
          {/* Overview */}
          <section className="mb-8">
            <h2 className="text-xl font-semibold text-white mb-4 flex items-center"><Info className="mr-2 text-blue-500" size={20} /> Overview</h2>
            <p className="text-gray-100 leading-relaxed">{about}</p>
          </section>

          {/* Activities */}
          {activities && activities.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold  mb-4 flex items-center"><Compass className="mr-2 text-indigo-500" size={20} /> Activities Included</h2>
              <ul className="list-disc list-inside space-y-2 ">
                {activities.map((activity, index) => (
                  <li key={index}>{activity}</li>
                ))}
              </ul>
            </section>
          )}

          {/* Itinerary */}
          {itinerary && itinerary.length > 0 && (
            <section className="mb-8">
              <h2 className="text-xl font-semibold mb-4 flex items-center"><CalendarDays className="mr-2 text-teal-500" size={20} /> Itinerary</h2>
              <ul className="space-y-4">
                {itinerary.map((day, index) => (
                  <li key={index} className="bg-gray-800 rounded-md p-4 shadow-sm">
                    <h3 className="font-semibold mb-1">Day {index + 1}</h3>
                    <p className=" leading-relaxed">{day}</p>
                  </li>
                ))}
              </ul>
            </section>
          )}
        </div>

        {/* Right Column */}
        <aside className="bg-gray-800 rounded-xl shadow-md p-6 sticky top-20">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Trip Details</h3>
            <div className="grid grid-cols-1 gap-3">
              <div className="flex items-center gap-2">
                <CalendarDays className="text-blue-500" size={16} />
                <span><strong>Duration:</strong> {days} days</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="text-red-500" size={16} />
                <span><strong>Location:</strong> {place}</span>
              </div>              <div className="flex items-center gap-2">
                <CalendarDays className="text-green-500" size={16} />
                <span><strong>Dates:</strong> {formatDate(startDate)} → {formatDate(endDate)}</span>
              </div>
              <div className="flex items-center gap-2">
                <Users className="text-purple-500" size={16} />
                <span><strong>Availability:</strong> {availableSpots} spot(s) left</span>
              </div>
              <div className="flex items-center gap-2">
                <DollarSign className="text-yellow-500" size={16} />
                <span><strong>Price:</strong> ${expectedCost} per person</span>
              </div>
              <div className="flex items-center gap-2">
                <PlaneTakeoff className="text-indigo-500" size={16} />
                <span><strong>Starts From:</strong> {startingPointOfGroup}</span>
              </div>
            </div>
          </div>

          {/* Highlights */}
          {highlights && highlights.length > 0 && (
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-3 flex items-center"><Sun className="mr-2 text-orange-500" size={18} /> Highlights</h3>
              <ul className="list-disc list-inside space-y-2">
                {highlights.map((highlight, index) => (
                  <li key={index}>{highlight}</li>
                ))}
              </ul>
            </div>
          )}

          {/* Good to Know */}
          {goodToKnow && (
            <div>
              <h3 className="text-lg font-semibold mb-3 flex items-center"><Info className="mr-2 text-gray-500" size={18} /> Good to Know</h3>
              <p className="text-sm leading-relaxed">{goodToKnow}</p>
            </div>
          )}

          <button 
            onClick={handleBooking}
            className={`w-full mt-4 py-3 px-6 rounded-md shadow-md transition duration-300 ease-in-out font-semibold ${
              isBooked 
                ? 'bg-red-500 hover:bg-red-600 text-white' 
                : availableSpots === 0 
                  ? 'bg-gray-400 cursor-not-allowed text-gray-700' 
                  : 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white'
            }`}
            disabled={availableSpots === 0 && !isBooked}
          >
            {isBooked ? 'Cancel Booking' : availableSpots === 0 ? 'No Spots Available' : 'Book Your Trip Now'}
          </button>
        </aside>
      </div>

      {/* Additional Information Section */}
      <section className="max-w-6xl mx-auto p-6 mt-12 bg-gray-800 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold mb-6 flex items-center"><Camera className="mr-2 text-pink-500" size={24} /> Photo Gallery</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {images.map((i)=>(
            <div key={i} className="overflow-hidden rounded-md shadow-sm">
              <img
                src={i}
                alt={`Trip Photo`}
                className="w-full h-48 object-cover transform hover:scale-105 transition-transform duration-300"
              />
            </div>
          ))}
        </div>
      </section>

      {/* Related Trips Section */}
      <section className="max-w-6xl mx-auto p-6 mt-12 bg-gray-800 rounded-xl shadow-md">
        <h2 className="text-2xl font-semibold text-gray-200 mb-6 flex items-center"><Mountain className="mr-2 text-gray-200" size={24} /> You Might Also Like</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {relatedGroups.map((group) => (
            <div key={group._id} className="bg-gray-800 rounded-lg shadow-md overflow-hidden">
              <img
                src={group.images[0]}
                alt={`Related group ${group._id}`}
                className="w-full h-32 object-cover"
              />
              <div className="p-4 bg-gray-900 text-white">
                <h3 className="font-semibold text-lg mb-2">{group.title}</h3>
                <p className="text-sm">{group.days} | {group.place}</p>
                <button className="bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-md mt-2 text-sm">
                  <Link to={`/group/${group._id}`}>
                    View Details
                  </Link>
                </button>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PackageDetail;