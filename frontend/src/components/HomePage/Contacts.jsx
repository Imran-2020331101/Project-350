import React, { useEffect, useState } from 'react';
import { contact_info,social_media } from "../../DemoInfo/User";

function Footer() {


  return (
    <>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10 mt-20 text-gray-300">
          {/* Information */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Information
            </h4>
            <ul className="space-y-2">
              <li className="hover:text-white hover:translate-x-1 transition">
                About Us
              </li>
              <li className="hover:text-white hover:translate-x-1 transition">
                Contact Us
              </li>
              <li className="hover:text-white hover:translate-x-1 transition">
                Delivery
              </li>
              <li className="hover:text-white hover:translate-x-1 transition">
                Payment Info
              </li>
            </ul>
          </div>

          {/* Custom Links */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Custom Links
            </h4>
            <ul className="space-y-2">
              <li className="hover:text-white hover:translate-x-1 transition">
                My Account
              </li>
              <li className="hover:text-white hover:translate-x-1 transition">
                Prices Drop
              </li>
              <li className="hover:text-white hover:translate-x-1 transition">
                New Products
              </li>
              <li className="hover:text-white hover:translate-x-1 transition">
                Terms & Conditions
              </li>
            </ul>
          </div>

          {/* Contact Numbers */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">
              Contact Info
            </h4>
            { contact_info.map(
                (info)=> <p key={3} className="mb-2 hover:text-white transition">
                            {info}
                          </p>
              )}
          </div>

          {/* Social Media */}
          <div>
            <h4 className="text-lg font-semibold text-white mb-4">Follow Us</h4>
            <div className="flex space-x-4 mt-2">
              {/* {
                social_media.map((info)=><a
                href={info.link} key={info.link} className="text-gray-400 hover:text-white transition transform hover:scale-110"
              >
                {info.icon}
              </a>)
              } */}
            </div>

          </div>
        </div>
    </>
  );
}

export default Footer;
