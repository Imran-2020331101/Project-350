import React from "react";

const NotFound = () => (
    <div className="flex flex-col items-center justify-center h-screen text-center px-4">
        <h1 className="text-6xl font-bold text-[#6469ff] mb-4">404</h1>
        <h2 className="text-2xl font-semibold text-gray-800 mb-2">Page Not Found</h2>
        <p className="text-gray-500 mb-6">
            The page you are looking for does not exist or has been moved.
        </p>
        <a
            href="/"
            className="px-6 py-2 bg-[#6469ff] text-white rounded-xl hover:bg-indigo-600 transition"
        >
            Go to Homepage
        </a>
    </div>
);

export default NotFound;
