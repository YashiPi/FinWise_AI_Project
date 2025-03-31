// AboutUs.jsx
import React from 'react';
// Import your images - example paths show n below
import de from "./Images/de.png";
import rozina from "./Images/rozina.jpg";
import ayushi1 from "./Images/ayushi1.jpg";
import yashi from './Images/yashi.jpg';
import saumya from './Images/saumya.jpg';
import smiti from './Images/smiti.jpg';


const AboutUs = () => {

  const mentors = [
    {
      id: 1,
      name: "Mrs. Rozina Hudda",
      role: " De Shaw & Co." ,
      description: "Principal Manager, Tech - Systems(Information Security)",
      imageUrl: rozina // Using imported image
    },
    
  ];
  const teamMembers = [
    {
      id: 1,
      name: "Ayushi Gautam",
      role: "NIT Delhi",
      
      imageUrl: ayushi1 // Using imported image
    },
    {
      id: 2,
      name: "Saumya Sinha",
      role: "IIT Patna",
      
      imageUrl: saumya // Using imported image
    },
    {
      id: 3,
      name: "Smiti Nigam",
      role: "IIT Roorkee",
     
      imageUrl: smiti // Using imported image
    },
    {
      id: 4,
      name: "Yashi Pitti",
      role: "NSUT",
      imageUrl: yashi
    }
  ];

  return (
    <div className="bg-gray-50 min-h-screen">
      {/* Header */}
      <header className="bg-blue-700 text-white py-4">
        <div className="container mx-auto px-4">
          <nav className="flex justify-between items-center">
            <div className="text-2xl font-bold">FinWise</div>
            
          </nav>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-16 bg-blue-600 text-white">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl font-bold mb-4">About Our Mission</h1>
          <p className="text-xl max-w-3xl mx-auto">
            We're dedicated to providing a hassle-free, secure investment platform 
            specifically designed for elderly individuals seeking peace of mind.
          </p>
        </div>
      </section>

      {/* Our Vision */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row items-center">
            <div className="md:w-1/2 mb-8 md:mb-0">
              <img 
                src={de} 
                 
                className="rounded-lg h-80 w-auto shadow-lg"
              />
            </div>
            <div className="md:w-1/2 md:pl-12">
              <h2 className="text-3xl font-bold mb-6 text-blue-700">Our Vision</h2>
              <p className="text-lg mb-4">
                We envision a world where elderly individuals can invest and save with confidence, 
                free from unnecessary complexity and hassle.
              </p>
              <p className="text-lg mb-4">
                Our platform is designed with simplicity and security as top priorities, ensuring that 
                our users can navigate their financial future with ease.
              </p>
              <p className="text-lg font-medium text-blue-700">
                We're committed to financial empowerment at any age.
              </p>
            </div>
          </div>
        </div>
      </section>

      

      {/* Mentors Section */}
      <section className= " h-auto py-16">
        <div className="container mx-auto px-4 ">
            
          <h2 className="text-3xl font-bold mb-12 text-center text-blue-700">Our Mentors</h2>
          <div className="flex justify-center p-4  items-center">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 ">
            {mentors.map(mentor => (
              <div key={mentor.id} className="flex flex-col md:flex-row bg-white rounded-lg shadow-md overflow-hidden">
                <img 
                  src={mentor.imageUrl} 
                  alt={mentor.name} 
                  className=" h-96 w-96  p-4 object-cover"
                />
                <div className="p-6 md:w-2/3">
                  <h3 className="text-xl font-bold mb-2">{mentor.name}</h3>
                  <p className="text-blue-600 font-medium mb-4">{mentor.expertise}</p>
                  <p className="text-blue-600 font-medium mb-4">{mentor.role}</p>
                  <p className="text-gray-600">{mentor.description}</p>
                </div>
              </div>
              
            ))}
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-16 bg-gray-100">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center text-blue-700">Our Team</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {teamMembers.map(member => (
              <div key={member.id} className="bg-white rounded-lg  shadow-md overflow-hidden">
                <img 
                  src={member.imageUrl} 
                  alt={member.name} 
                  className="w-full h-96 object-cover"
                />
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">{member.name}</h3>
                  <p className="text-blue-600 font-medium mb-4">{member.role}</p>
                  <p className="text-gray-600">{member.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Values Section */}
      <section className="py-16 bg-blue-700 text-white">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🛡️</div>
              <h3 className="text-xl font-bold mb-3">Accessibility First</h3>
              <p>We prioritize inclusivity by designing a platform that is easy to use for everyone, 
                including seniors and individuals with varying abilities.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">🤝</div>
              <h3 className="text-xl font-bold mb-3">Simplicity</h3>
              <p>Our platform is designed to be intuitive and easy to use, especially for those who aren't tech-savvy.</p>
            </div>
            <div className="text-center p-6">
              <div className="text-5xl mb-4">💼</div>
              <h3 className="text-xl font-bold mb-3">Transparency</h3>
              <p>No hidden fees or complicated terms. We believe in being completely honest about all aspects of your investments.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-800 text-white py-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between">
            <div className="mb-6 md:mb-0">
              <h3 className="text-xl font-bold mb-4">FinWise</h3>
              <p className="text-gray-400 max-w-md">
                Providing secure, hassle-free investment solutions for seniors since 2024.
              </p>
            </div>
            <div>
              <h4 className="text-lg font-bold mb-4">Contact Us</h4>
              <p className="text-gray-400">Email: contact@finwise.com</p>
              <p className="text-gray-400">Phone: (555) 123-4567</p>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center text-gray-400">
            <p>&copy; 2025 FinWise. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default AboutUs;