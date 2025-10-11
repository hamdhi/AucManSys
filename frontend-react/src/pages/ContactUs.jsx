import React, { useState } from "react";
import Header from "../components/Header"; // Adjust the import path as needed
import Footer from "../components/Footer"; // Adjust the import path as needed

const ContactUs = () => {
  // State to manage form inputs
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    subject: "",
    message: "",
  });

  // State to manage form submission status (e.g., for showing success/error messages)
  const [status, setStatus] = useState("");

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");

    // Here you would typically send the form data to your backend API
    // For this example, we'll simulate a successful submission after 2 seconds
    console.log("Form Data Submitted:", formData);

    setTimeout(() => {
      setStatus("success");
      setFormData({ name: "", email: "", subject: "", message: "" }); // Reset form
      
      // Optionally, reset the status message after a few more seconds
      setTimeout(() => setStatus(""), 5000);
    }, 2000);
  };

  return (
    <>
      <Header />
      <div className="bg-gray-50 font-sans">
        {/* --- Page Header --- */}
        <section className="text-center py-16 sm:py-20">
          <div className="container mx-auto px-4">
            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-gray-900">
              Get in Touch
            </h1>
            <p className="mt-4 max-w-2xl mx-auto text-lg text-gray-600">
              We'd love to hear from you. Whether you have a question, feedback, or a project proposal, our team is ready to answer all your inquiries.
            </p>
          </div>
        </section>

        {/* --- Main Content: Contact Info and Form --- */}
        <section className="container mx-auto px-4 pb-16 sm:pb-20">
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden lg:grid lg:grid-cols-2">
            
            {/* --- Left Column: Contact Information & Map --- */}
            <div className="p-8 sm:p-12 lg:pr-6">
              <h2 className="text-2xl font-bold text-gray-900">Contact Information</h2>
              <p className="mt-2 text-gray-600">
                Reach out to us through any of the following channels. We look forward to connecting with you!
              </p>
              <div className="mt-8 space-y-6">
                {/* Address */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" /></svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Our Address</h3>
                    <p className="mt-1 text-gray-600">Dehiwala-Mount Lavinia, Western Province, Sri Lanka</p>
                  </div>
                </div>
                {/* Email */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" /></svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Email Us</h3>
                    <p className="mt-1 text-gray-600">support@bidify.com</p>
                  </div>
                </div>
                {/* Phone */}
                <div className="flex items-start">
                  <div className="flex-shrink-0">
                    <div className="flex items-center justify-center h-12 w-12 rounded-md bg-indigo-100 text-indigo-600">
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" /></svg>
                    </div>
                  </div>
                  <div className="ml-4">
                    <h3 className="text-lg font-medium text-gray-900">Call Us</h3>
                    <p className="mt-1 text-gray-600">+94 11 272 1234</p>
                  </div>
                </div>
              </div>
              
              {/* --- Embedded Map --- */}
              <div className="mt-8">
                 <iframe 
                    src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d63378.82273187198!2d79.84539130095874!3d6.845997873516039!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3ae25a3359253a07%3A0x1d44280b543e0674!2sDehiwala-Mount%20Lavinia!5e0!3m2!1sen!2slk!4v1728638977123!5m2!1sen!2slk" 
                    width="100%" 
                    height="250" 
                    style={{ border: 0 }}
                    allowFullScreen="" 
                    loading="lazy"
                    referrerPolicy="no-referrer-when-downgrade"
                    className="rounded-lg shadow-md"
                  ></iframe>
              </div>
            </div>

            {/* --- Right Column: Contact Form --- */}
            <div className="p-8 sm:p-12 lg:pl-6 bg-gray-50/50">
                <h2 className="text-2xl font-bold text-gray-900">Send Us a Message</h2>
                <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                    <div>
                        <label htmlFor="name" className="block text-sm font-medium text-gray-700">Full Name</label>
                        <input type="text" name="name" id="name" required value={formData.name} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
                    </div>
                    <div>
                        <label htmlFor="email" className="block text-sm font-medium text-gray-700">Email Address</label>
                        <input type="email" name="email" id="email" required value={formData.email} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
                    </div>
                    <div>
                        <label htmlFor="subject" className="block text-sm font-medium text-gray-700">Subject</label>
                        <input type="text" name="subject" id="subject" required value={formData.subject} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"/>
                    </div>
                    <div>
                        <label htmlFor="message" className="block text-sm font-medium text-gray-700">Message</label>
                        <textarea name="message" id="message" rows="5" required value={formData.message} onChange={handleChange} className="mt-1 block w-full rounded-lg border border-gray-300 bg-white py-3 px-4 shadow-sm focus:border-indigo-500 focus:ring-indigo-500"></textarea>
                    </div>
                    <div>
                        <button type="submit" disabled={status === 'sending'} className="w-full rounded-lg bg-indigo-600 py-3 px-6 text-base font-semibold text-white shadow-md transition-all duration-300 hover:bg-indigo-700 active:scale-95 disabled:bg-gray-400 disabled:cursor-not-allowed">
                            {status === 'sending' ? 'Sending...' : 'Send Message'}
                        </button>
                    </div>
                    {status === 'success' && (
                        <p className="text-center text-green-600 font-medium">✓ Thank you! Your message has been sent successfully.</p>
                    )}
                </form>
            </div>
          </div>
        </section>
      </div>
      <Footer />
    </>
  );
};

export default ContactUs;