import { Navigate, useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { toast } from 'react-toastify';

const ProtectedRoute = ({ children }) => {
    const { isSignedIn } = useSelector((state) => state.auth);
    const location = useLocation();

    if (!isSignedIn) {
        toast.error('Please log in to access this page');
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    return children;
};

export default ProtectedRoute; 