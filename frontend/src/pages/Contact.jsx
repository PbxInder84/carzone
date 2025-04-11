import React, { useState } from 'react';
import { FaMapMarkerAlt, FaPhone, FaEnvelope, FaClock, FaFacebookF, FaTwitter, FaInstagram } from 'react-icons/fa';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setSubmitSuccess(true);
      setFormData({
        name: '',
        email: '',
        subject: '',
        message: ''
      });
    }, 1500);
  };

  return (
    <div className="page-container">
      <h1 className="page-title">Contact Us</h1>
      
      {/* Contact Info Cards */}
      <section className="mb-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="card p-6 flex flex-col items-center text-center">
            <div className="bg-primary-100 p-4 rounded-full mb-4">
              <FaMapMarkerAlt className="text-2xl text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Our Location</h3>
            <p className="text-gray-600">
              123 Auto Avenue, Car City<br />
              CC 12345, United States
            </p>
          </div>
          
          <div className="card p-6 flex flex-col items-center text-center">
            <div className="bg-primary-100 p-4 rounded-full mb-4">
              <FaPhone className="text-2xl text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Phone Number</h3>
            <p className="text-gray-600">
              <a href="tel:+11234567890" className="hover:text-primary-600">+1 (123) 456-7890</a><br />
              <a href="tel:+19876543210" className="hover:text-primary-600">+1 (987) 654-3210</a>
            </p>
          </div>
          
          <div className="card p-6 flex flex-col items-center text-center">
            <div className="bg-primary-100 p-4 rounded-full mb-4">
              <FaEnvelope className="text-2xl text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Email Address</h3>
            <p className="text-gray-600">
              <a href="mailto:info@carzone.com" className="hover:text-primary-600">info@carzone.com</a><br />
              <a href="mailto:support@carzone.com" className="hover:text-primary-600">support@carzone.com</a>
            </p>
          </div>
          
          <div className="card p-6 flex flex-col items-center text-center">
            <div className="bg-primary-100 p-4 rounded-full mb-4">
              <FaClock className="text-2xl text-primary-600" />
            </div>
            <h3 className="text-lg font-semibold mb-2">Working Hours</h3>
            <p className="text-gray-600">
              Monday - Friday: 9am - 6pm<br />
              Saturday: 10am - 4pm<br />
              Sunday: Closed
            </p>
          </div>
        </div>
      </section>
      
      {/* Map and Contact Form */}
      <section className="mb-16">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Map */}
          <div className="card p-0 overflow-hidden">
            <iframe 
              src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d387193.30591910506!2d-74.25986548248684!3d40.697149421543594!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c24fa5d33f083b%3A0xc80b8f06e177fe62!2sNew%20York%2C%20NY%2C%20USA!5e0!3m2!1sen!2sca!4v1619913723783!5m2!1sen!2sca" 
              width="100%" 
              height="450" 
              style={{ border: 0 }} 
              allowFullScreen="" 
              loading="lazy"
              title="CarZone Location"
            ></iframe>
          </div>
          
          {/* Contact Form */}
          <div className="card">
            <h2 className="text-2xl font-bold mb-6">Send Us a Message</h2>
            
            {submitSuccess ? (
              <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
                Thank you for your message! We'll get back to you shortly.
              </div>
            ) : submitError ? (
              <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
                There was an error sending your message. Please try again later.
              </div>
            ) : null}
            
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label htmlFor="name" className="block text-gray-700 font-medium mb-2">Your Name</label>
                <input 
                  type="text" 
                  id="name" 
                  name="name" 
                  value={formData.name}
                  onChange={handleChange}
                  className="input-field" 
                  required 
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="email" className="block text-gray-700 font-medium mb-2">Your Email</label>
                <input 
                  type="email" 
                  id="email" 
                  name="email" 
                  value={formData.email}
                  onChange={handleChange}
                  className="input-field" 
                  required 
                />
              </div>
              
              <div className="mb-4">
                <label htmlFor="subject" className="block text-gray-700 font-medium mb-2">Subject</label>
                <input 
                  type="text" 
                  id="subject" 
                  name="subject" 
                  value={formData.subject}
                  onChange={handleChange}
                  className="input-field" 
                  required 
                />
              </div>
              
              <div className="mb-6">
                <label htmlFor="message" className="block text-gray-700 font-medium mb-2">Your Message</label>
                <textarea 
                  id="message" 
                  name="message" 
                  value={formData.message}
                  onChange={handleChange}
                  rows="5" 
                  className="input-field" 
                  required
                ></textarea>
              </div>
              
              <button 
                type="submit" 
                className="btn-primary w-full"
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </div>
        </div>
      </section>
      
      {/* Social Media */}
      <section className="mb-16">
        <div className="card text-center">
          <h2 className="text-2xl font-bold mb-6">Connect With Us</h2>
          <p className="text-gray-600 mb-6">
            Stay updated with our latest products, promotions, and automotive news by following us on social media.
          </p>
          <div className="flex justify-center space-x-6">
            <a href="https://facebook.com" target="_blank" rel="noopener noreferrer" className="bg-blue-600 text-white p-3 rounded-full hover:bg-blue-700 transition duration-300">
              <FaFacebookF className="text-xl" />
            </a>
            <a href="https://twitter.com" target="_blank" rel="noopener noreferrer" className="bg-blue-400 text-white p-3 rounded-full hover:bg-blue-500 transition duration-300">
              <FaTwitter className="text-xl" />
            </a>
            <a href="https://instagram.com" target="_blank" rel="noopener noreferrer" className="bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white p-3 rounded-full hover:opacity-90 transition duration-300">
              <FaInstagram className="text-xl" />
            </a>
          </div>
        </div>
      </section>
      
      {/* FAQ */}
      <section className="mb-16">
        <div className="card">
          <h2 className="text-2xl font-bold mb-6 text-center">Frequently Asked Questions</h2>
          <div className="space-y-4">
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">What are your shipping policies?</h3>
              <p className="text-gray-600">
                We offer free shipping on orders over $50. Standard shipping typically takes 3-5 business days, while express shipping options are available for an additional fee.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Do you offer international shipping?</h3>
              <p className="text-gray-600">
                Yes, we ship to select international destinations. Shipping costs and delivery times vary by location. Please contact our customer service for more details.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">What is your return policy?</h3>
              <p className="text-gray-600">
                We offer a 30-day return policy on most items. Products must be in unused condition with original packaging to qualify for a full refund.
              </p>
            </div>
            <div className="border border-gray-200 rounded-lg p-4">
              <h3 className="text-lg font-semibold mb-2">Do you offer installation services?</h3>
              <p className="text-gray-600">
                Yes, we partner with certified mechanics nationwide. You can add installation services to your order during checkout or contact us to arrange installation after purchase.
              </p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Contact; 