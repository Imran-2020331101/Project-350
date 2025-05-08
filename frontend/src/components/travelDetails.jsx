import React from 'react';
import { Link } from 'react-router-dom';
import MapComponent from './MapComponent';
import { test } from '../constants';

const Travel = () => {
  return (
    <div className="min-h-screen w-full px-6 py-10 flex flex-col items-center gap-10 bg-gray-50 text-gray-800">
      
      {/* Destination */}
      <h2 className="text-3xl font-bold">Destination</h2>

      {/* Weather Update Section */}
      <section className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Weather Update</h3>
        <div className="flex justify-between">
          {[
            { label: 'Temperature', value: '30°C' },
            { label: 'Rain', value: '30%' },
            { label: 'Weather', value: 'Sunny' },
          ].map((item, idx) => (
            <div
              key={idx}
              className="flex flex-col items-center w-[100px]"
            >
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-sm font-medium text-gray-600">{item.label}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Description */}
      <section className="w-full max-w-3xl bg-white rounded-xl shadow-md p-6 max-h-60 overflow-y-auto">
        <h3 className="text-xl font-semibold mb-2">Description</h3>
        <p className="text-base leading-relaxed">
          Lorem ipsum dolor sit amet consectetur adipisicing elit. 
          Unde cumque itaque corrupti reprehenderit suscipit.
          Veritatis, velit. Asperiores eius ex hic ipsum iure soluta, 
          nam quia excepturi voluptatem cupiditate neque veniam?
        </p>
      </section>

      {/* Places to Visit */}
      <section className="w-full max-w-4xl flex flex-col items-center gap-5">
        <h3 className="text-2xl font-semibold">Places to Visit</h3>
        <MapComponent places={test} type="places" />
        <p className="text-base text-center max-w-2xl">
          Explore the best sights and experiences in the area. These places are highly recommended for travelers!
        </p>
      </section>

      {/* Hotel Suggestions */}
      <section className="w-full max-w-4xl bg-white rounded-xl shadow-md p-6">
        <h3 className="text-xl font-semibold mb-4">Recommended Hotels</h3>
        <ul className="space-y-3 max-h-60 overflow-y-auto pr-2">
          {test && test.map((item, index) => (
            <li key={index} className="p-3 border rounded-lg hover:shadow transition bg-gray-50">
              <p className="font-medium">{item.name}</p>
              <p className="text-sm text-gray-500">{item.formatted_location}</p>
            </li>
          ))}
        </ul>
      </section>

      {/* Second Map */}
      <div className="w-full max-w-4xl">
        <MapComponent places={test} type="hotels" />
      </div>
    </div>
  );
};

export default Travel;
