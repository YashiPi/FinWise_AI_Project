import React, { useRef } from 'react';
import { Mic, Monitor, DollarSign } from 'lucide-react';
import { Link } from 'lucide-react';
const Features = () => {
  const firstFeatureRef = useRef(null);

  const scrollToFirstFeature = () => {
    firstFeatureRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  return (
    <div className="h-screen overflow-y-auto snap-y snap-mandatory">

      {/* Navigation */}
      <nav className="bg-white shadow-md px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2">
          <svg className="w-8 h-8" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M4 10V17C4 18.1046 4.89543 19 6 19H18C19.1046 19 20 18.1046 20 17V10" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round"/>
            <path d="M12 3L22 9H2L12 3Z" fill="#4F46E5" stroke="#4F46E5" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
          </svg>
          <span className="font-bold text-xl text-indigo-600">FinWise</span>
        </div>
        
        <div className="flex space-x-4">
        <Link to="/login">
          <button className="px-4 py-2 text-indigo-600 font-medium">Login</button>
          </Link>
          <Link to="/register">
          <button className="px-4 py-2 bg-indigo-600 text-white rounded-lg font-medium shadow-md hover:bg-indigo-700">Sign Up</button>
          </Link>
        </div>
      </nav> 
      

      {/* Hero Section */}
      <section className="min-h-screen flex flex-col items-center justify-center p-8 snap-start bg-gradient-to-br from-blue-900 to-blue-700 text-white">
        <div className="max-w-3xl text-center">
          <h1 className="text-5xl font-bold mb-6">FinWise Banking App</h1>
          <p className="text-xl mb-8">
            Discover a new era of banking with features designed for simplicity, 
            accessibility, and financial growth.
          </p>
          <button 
            onClick={scrollToFirstFeature}
            className="px-6 py-3 bg-white text-blue-900 font-medium rounded-full 
                      hover:bg-blue-50 transition-all transform hover:-translate-y-1"
          >
            Scroll to Explore
          </button>
        </div>
      </section>

      {/* Feature 1: Voice Control */}
      <section 
        ref={firstFeatureRef}
        className="min-h-screen flex flex-col items-center justify-center p-8 snap-start bg-gray-50"
      >
        <div className="max-w-3xl text-center">
          <div className="w-48 h-48 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Mic size={80} className="text-blue-900" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-blue-900">Voice Control</h2>
          <p className="text-lg mb-8 text-gray-700">
          Experience seamless banking with our advanced voice command feature. 
          Navigate easily the platform, find information, and get assistance whenever needed—just by using your voice. 
          Managing your finances has never been this effortless!
          </p>
          <button className="px-6 py-3 bg-blue-900 text-white font-medium rounded-full hover:bg-blue-800 transition-all">
            Learn More
          </button>
        </div>
      </section>

      {/* Feature 2: Simplified UI */}
      <section className="min-h-screen flex flex-col items-center justify-center p-8 snap-start bg-gray-100">
        <div className="max-w-3xl text-center">
          <div className="w-48 h-48 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-8 shadow-lg">
            <Monitor size={80} className="text-blue-900" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-blue-900">Simplified UI</h2>
          <p className="text-lg mb-8 text-gray-700">
            Navigate with ease through our intuitive interface featuring large fonts 
            and high-contrast visuals. Designed with accessibility in mind, our app 
            ensures banking is clear, readable, and stress-free for everyone.
          </p>
          <button className="px-6 py-3 bg-blue-900 text-white font-medium rounded-full hover:bg-blue-800 transition-all">
            Learn More
          </button>
        </div>
      </section>

      {/* Feature 3: Micro-Investing */}
      <section className="min-h-screen flex flex-col items-center justify-center p-8 snap-start bg-gray-200">
        <div className="max-w-3xl text-center">
          <div className="w-48 h-48 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-8 shadow-lg">
            <DollarSign size={80} className="text-blue-900" />
          </div>
          <h2 className="text-4xl font-bold mb-4 text-blue-900">Micro-Investing</h2>
          <p className="text-lg mb-8 text-gray-700">
            Build your wealth effortlessly with our Micro-Investing feature. 
            We automatically round up your everyday purchases and invest the 
            spare change in low-risk options. Start your investment journey 
            with amounts so small you won't even notice.
          </p>
          <button className="px-6 py-3 bg-blue-900 text-white font-medium rounded-full hover:bg-blue-800 transition-all">
            Learn More
          </button>
        </div>
      </section>
    </div>
  );
};

export default Features;