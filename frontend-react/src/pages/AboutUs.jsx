import React from "react";
import Header from "../components/Header"; 
import Footer from "../components/Footer"; 
import { useNavigate } from "react-router-dom";

const teamMembers = [
  {
    name: "Alex Johnson",
    role: "Founder & CEO",
    bio: "The visionary behind it all, Alex started [Your Company Name] to bring simplicity and power to [Your Industry]. When not leading the team, you can find them hiking mountain trails.",
    imageUrl: "https://i.pravatar.cc/150?img=68", // Placeholder image
  },
  {
    name: "Maria Garcia",
    role: "Head of Product",
    bio: "Maria is the strategic mind ensuring our products are not just innovative but also beautiful and easy to use. She is passionate about user experience design and customer feedback.",
    imageUrl: "https://i.pravatar.cc/150?img=49", // Placeholder image
  },
  {
    name: "Sam Chen",
    role: "Lead Engineer",
    bio: "With a passion for clean code and robust systems, Sam is the technical architect behind our platform's success. He turns complex problems into elegant solutions.",
    imageUrl: "https://i.pravatar.cc/150?img=32", // Placeholder image
  },
];

const AboutUs = () => {
  // Inside your component...
const navigate = useNavigate();
  return (
    <>
      <Header />
      <div className="bg-white text-gray-800 font-sans">
        
        {/* --- Hero Section --- */}
        <section className="bg-gray-50 text-center py-20 sm:py-24">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
              About Bid<span className="text-indigo-600"><span className="text-indigo-600">ify</span></span>
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              Driven by Passion, Defined by Purpose.
            </p>
          </div>
        </section>

        {/* --- Our Story Section --- */}
        <section className="py-16 sm:py-20">
          <div className="container mx-auto px-4 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?q=80&w=2070&auto=format&fit=crop" 
                alt="Our team working together"
                className="rounded-xl shadow-2xl w-full h-full object-cover"
              />
            </div>
            <div className="text-left">
              <h3 className="text-sm font-semibold uppercase tracking-wider text-indigo-600">Our Story</h3>
              <h2 className="mt-2 text-3xl font-bold text-gray-900">From a Simple Idea to a Thriving Mission</h2>
              <p className="mt-4 text-gray-600 leading-relaxed">
                It all began in 2020 with a simple idea scribbled on a napkin. Our Team, SA Group, saw a clear gap in the market for Bidding products. Frustrated with the existing options, we set out to create something different.
              </p>
              <p className="mt-4 text-gray-600 leading-relaxed">
                From a small desk in a home office to a bustling workspace, our journey has been one of persistence and growth. Through it all, our commitment to our original goal has never wavered: to deliver exceptional Bidding Service with integrity and creativity.
              </p>
            </div>
          </div>
        </section>
        
        {/* --- What We Stand For (Values) Section --- */}
        <section className="bg-gray-50 py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <div className="text-center">
                <h2 className="text-3xl font-bold text-gray-900 mb-12">What We Stand For</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
              {/* Value 1 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 mx-auto">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path></svg>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">Customer-Centricity</h3>
                <p className="mt-2 text-base text-gray-600">You are at the heart of everything we do. We listen intently to your feedback and are dedicated to solving your problems.</p>
              </div>
              {/* Value 2 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 mx-auto">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z"></path></svg>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">Innovation</h3>
                <p className="mt-2 text-base text-gray-600">We constantly challenge the status quo and thrive on curiosity. We're always searching for better, smarter ways to get things done.</p>
              </div>
              {/* Value 3 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 mx-auto">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">Integrity</h3>
                <p className="mt-2 text-base text-gray-600">We believe in transparency, honesty, and doing the right thing, always. Trust is the cornerstone of our relationships.</p>
              </div>
              {/* Value 4 */}
              <div className="text-center">
                <div className="flex items-center justify-center h-12 w-12 rounded-full bg-indigo-100 text-indigo-600 mx-auto">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z"></path></svg>
                </div>
                <h3 className="mt-5 text-lg font-semibold text-gray-900">Quality</h3>
                <p className="mt-2 text-base text-gray-600">We are obsessed with quality. From the smallest detail to the big picture, we pour craftsmanship and excellence into our work.</p>
              </div>
            </div>
          </div>
        </section>

        {/* --- Meet the Team Section --- */}
        <section className="py-16 sm:py-20">
            <div className="container mx-auto px-4">
                <div className="text-center">
                    <h2 className="text-3xl font-bold text-gray-900 mb-4">Meet the Team</h2>
                    <p className="max-w-2xl mx-auto text-lg text-gray-600 mb-12">
                        We're a diverse group of experts, creatives, and problem-solvers united by a shared dedication to our mission.
                    </p>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
                    {teamMembers.map((member) => (
                        <div key={member.name} className="text-center bg-gray-50 p-6 rounded-xl shadow-md transition-transform duration-300 hover:-translate-y-2">
                            <img className="w-32 h-32 rounded-full mx-auto mb-4 object-cover shadow-lg" src={member.imageUrl} alt={member.name} />
                            <h3 className="text-xl font-bold text-gray-900">{member.name}</h3>
                            <p className="text-indigo-600 font-semibold">{member.role}</p>
                            <p className="mt-2 text-sm text-gray-500">{member.bio}</p>
                        </div>
                    ))}
                </div>
            </div>
        </section>

       {/* --- Call to Action Section --- */}
<section className="bg-indigo-700">
    <div className="container mx-auto px-4 py-16 text-center">
        <h2 className="text-3xl font-bold text-white">Join Us on Our Journey</h2>
        <p className="mt-4 max-w-2xl mx-auto text-lg text-indigo-200">
            We're proud of how far we've come, but we're even more excited about the future. Let's build something great together.
        </p>
        <div className="mt-8 flex flex-col sm:flex-row gap-4 justify-center">
            <button 
                onClick={() => navigate('/productList')}
                className="bg-white text-indigo-700 font-semibold py-3 px-8 rounded-lg shadow-lg transform transition-transform hover:scale-105">
                Explore Products
            </button>
            <button 
                onClick={() => navigate('/contactUs')}
                className="border border-indigo-400 text-white font-semibold py-3 px-8 rounded-lg shadow-lg transform transition-transform hover:scale-105">
                Get in Touch
            </button>
        </div>
    </div>
</section>
        
      </div>
      <Footer />
    </>
  );
};

export default AboutUs;