import React from "react";
import { MapPin, Phone, Mail, Clock, Building2 } from "lucide-react";

export default function Contact() {
  return (
    <div className="min-h-screen bg-gray-50">
      {/* Page header */}
      <div className="bg-[#1a3a6e] text-white py-3 px-4 md:px-8">
        <div className="max-w-7xl mx-auto text-xs text-blue-200">
          Home &rsaquo; Contact Us
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-8">
        <div className="bg-white border border-gray-200 rounded shadow-sm p-6 md:p-8">
          <div className="flex flex-col lg:flex-row gap-10">

            {/* ── Left: Contact Details ── */}
            <div className="lg:w-1/2">
              <h2 className="text-2xl font-bold text-[#1a3a6e] mb-1">Contact Details</h2>
              <div className="w-16 h-0.5 bg-orange-500 mb-4" />

              <p className="text-sm text-gray-600 mb-5">
                For queries related to payments or refunds, contact:
              </p>

              {/* Vice Chairman Office */}
              <div className="mb-4">
                <p className="font-semibold text-gray-800">Vice Chairman Office</p>
                <p className="text-sm text-gray-700 mt-0.5">
                  <span className="font-medium">Phone:</span> +91-05812300081
                </p>
              </div>

              {/* Secretary Office */}
              <div className="mb-5">
                <p className="font-semibold text-gray-800">Secretary Office</p>
                <p className="text-sm text-gray-700 mt-0.5">
                  <span className="font-medium">Phone:</span> +91-05812303989
                </p>
              </div>

              <hr className="border-gray-200 mb-5" />

              {/* Department details */}
              <div className="space-y-2 text-sm text-gray-700">
                <div className="flex items-start gap-2">
                  <Building2 className="h-4 w-4 text-[#1a3a6e] mt-0.5 flex-shrink-0" />
                  <p><span className="font-semibold">Department:</span> Bareilly Development Authority</p>
                </div>
                <div className="flex items-start gap-2">
                  <Mail className="h-4 w-4 text-[#1a3a6e] mt-0.5 flex-shrink-0" />
                  <p>
                    <span className="font-semibold">Email:</span>{" "}
                    <a href="mailto:bdabareilly@gmail.com" className="text-blue-600 hover:underline">bdabareilly@gmail.com</a>
                    {", "}
                    <a href="mailto:blyda@nic.in" className="text-blue-600 hover:underline">blyda@nic.in</a>
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Phone className="h-4 w-4 text-[#1a3a6e] mt-0.5 flex-shrink-0" />
                  <p><span className="font-semibold">Phone:</span> +91-9568006429</p>
                </div>
                <div className="flex items-start gap-2">
                  <MapPin className="h-4 w-4 text-[#1a3a6e] mt-0.5 flex-shrink-0" />
                  <p>
                    <span className="font-semibold">Address:</span> Sector 2, Ramganga Nagar Awasiya Yojna,
                    Near Ramayan Vatika, Dohra Road, Bareilly – 243006
                  </p>
                </div>
                <div className="flex items-start gap-2">
                  <Clock className="h-4 w-4 text-[#1a3a6e] mt-0.5 flex-shrink-0" />
                  <p><span className="font-semibold">Working Hours:</span> Mon–Sat, 10:00 AM to 5:30 PM</p>
                </div>
              </div>

              <div className="mt-6">
                <a
                  href="#mobile-numbers"
                  className="text-xl font-bold text-[#1a3a6e] hover:underline"
                >
                  General mobile number list
                </a>
              </div>
            </div>

            {/* ── Right: Google Map ── */}
            <div className="lg:w-1/2">
              <iframe
                title="Bareilly Development Authority New Office"
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3510.1849501420343!2d79.4693041!3d28.3834813!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x39a007004833aba3%3A0xe47bdc8e3bf3c192!2sBareilly%20Development%20Authority%20New%20Office!5e0!3m2!1sen!2sin!4v1783182371746!5m2!1sen!2sin"
                width="100%"
                height="450"
                style={{ border: 0, borderRadius: "6px" }}
                allowFullScreen
                loading="lazy"
                referrerPolicy="strict-origin-when-cross-origin"
              />
              <p className="text-xs text-gray-500 mt-2 text-center">
                Bareilly Development Authority New Office — Chandpur Bichpuri, Bareilly, UP 243006
              </p>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}
