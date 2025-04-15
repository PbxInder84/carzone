import React, { useState } from 'react';
import { 
  FaMapMarkerAlt, 
  FaPhone, 
  FaEnvelope, 
  FaClock, 
  FaFacebookF, 
  FaTwitter, 
  FaInstagram, 
  FaLinkedinIn, 
  FaYoutube, 
  FaPaperPlane, 
  FaShippingFast, 
  FaExchangeAlt, 
  FaTools, 
  FaHeadset 
} from 'react-icons/fa';

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
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white pt-16 pb-20">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary-800 text-white">
        {/* Background effects */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 bg-gradient-to-r from-primary-900 to-primary-700"></div>
        </div>
        <div className="absolute -right-20 top-10 w-64 h-64 bg-secondary-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -left-20 bottom-10 w-64 h-64 bg-primary-400/10 rounded-full blur-3xl"></div>
        
        <div className="container mx-auto px-4 py-16 relative z-10">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Get in Touch With Us</h1>
            <p className="text-xl text-gray-100 mb-4 leading-relaxed">
              We're here to answer any questions about our products and services.
              Our team is ready to help enhance your automotive experience.
            </p>
          </div>
        </div>
      </section>
      
      <div className="container mx-auto px-4 py-12">
        {/* Contact Info Cards */}
        <section className="mb-16 -mt-20 relative z-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <ContactCard 
              icon={<FaMapMarkerAlt />}
              title="Our Location"
              content={
                <>
                  CarZone Headquarters<br />
                  Rajpura, Panjab, India - 140401
                </>
              }
            />
            
            <ContactCard 
              icon={<FaPhone />}
              title="Phone Number"
              content={
                <>
                  <a href="tel:+919876543210" className="hover:text-primary-600 transition-colors">+91 98765 43210</a><br />
                  <a href="tel:+911234567890" className="hover:text-primary-600 transition-colors">+91 12345 67890</a>
                </>
              }
            />
            
            <ContactCard 
              icon={<FaEnvelope />}
              title="Email Address"
              content={
                <>
                  <a href="mailto:info@carzone.in" className="hover:text-primary-600 transition-colors">info@carzone.in</a><br />
                  <a href="mailto:support@carzone.in" className="hover:text-primary-600 transition-colors">support@carzone.in</a>
                </>
              }
            />
            
            <ContactCard 
              icon={<FaClock />}
              title="Working Hours"
              content={
                <>
                  Monday - Friday: 9am - 6pm<br />
                  Saturday: 10am - 4pm<br />
                  Sunday: Closed
                </>
              }
            />
          </div>
        </section>
        
        {/* Map and Contact Form */}
        <section className="mb-16">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
            {/* Map */}
            <div className="lg:col-span-3 backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
              <div className="aspect-video w-full">
                <iframe 
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d27396.36767316924!2d76.5788957!3d30.5172566!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x390fea1aaaa9d7f1%3A0xb3e5bbe0929ac342!2sRajpura%2C%20Punjab%20140401!5e0!3m2!1sen!2sin!4v1684232041230!5m2!1sen!2sin" 
                  width="100%" 
                  height="100%" 
                  style={{ border: 0 }} 
                  allowFullScreen="" 
                  loading="lazy"
                  title="CarZone Location in Rajpura, Panjab"
                ></iframe>
              </div>
            </div>
            
            {/* Contact Form */}
            <div className="lg:col-span-2 backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl border border-gray-100 p-6">
              <div className="mb-6">
                <div className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium">GET IN TOUCH</div>
                <h2 className="text-2xl font-bold mt-3 mb-3 text-gray-800">Send Us a Message</h2>
                <p className="text-gray-600 text-sm">Fill out the form below and we'll get back to you as soon as possible.</p>
              </div>
              
              {submitSuccess ? (
                <div className="bg-green-100 border border-green-200 text-green-700 px-4 py-3 rounded-lg mb-4">
                  <div className="flex">
                    <div className="py-1"><svg className="fill-current h-6 w-6 text-green-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM6.7 9.29L9 11.6l4.3-4.3 1.4 1.42L9 14.4l-3.7-3.7 1.4-1.42z"/></svg></div>
                    <div>
                      <p className="font-bold">Thank you for your message!</p>
                      <p className="text-sm">We'll get back to you shortly.</p>
                    </div>
                  </div>
                </div>
              ) : submitError ? (
                <div className="bg-red-100 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-4">
                  <div className="flex">
                    <div className="py-1"><svg className="fill-current h-6 w-6 text-red-500 mr-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"><path d="M2.93 17.07A10 10 0 1 1 17.07 2.93 10 10 0 0 1 2.93 17.07zm12.73-1.41A8 8 0 1 0 4.34 4.34a8 8 0 0 0 11.32 11.32zM10 13.41l3.71 3.72 1.42-1.42L11.41 12l3.72-3.71-1.42-1.42L10 10.59 6.29 6.88 4.87 8.3 8.59 12l-3.72 3.71 1.42 1.42L10 13.41z"/></svg></div>
                    <div>
                      <p className="font-bold">There was an error sending your message.</p>
                      <p className="text-sm">Please try again later or contact us directly.</p>
                    </div>
                  </div>
                </div>
              ) : null}
              
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="name" className="block text-gray-700 text-sm font-medium mb-1">Your Name</label>
                  <input 
                    type="text" 
                    id="name" 
                    name="name" 
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                    required 
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-gray-700 text-sm font-medium mb-1">Your Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    name="email" 
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                    required 
                  />
                </div>
                
                <div>
                  <label htmlFor="subject" className="block text-gray-700 text-sm font-medium mb-1">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    name="subject" 
                    value={formData.subject}
                    onChange={handleChange}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                    required 
                  />
                </div>
                
                <div>
                  <label htmlFor="message" className="block text-gray-700 text-sm font-medium mb-1">Your Message</label>
                  <textarea 
                    id="message" 
                    name="message" 
                    value={formData.message}
                    onChange={handleChange}
                    rows="4" 
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary-500 focus:border-primary-500" 
                    required
                  ></textarea>
                </div>
                
                <button 
                  type="submit" 
                  className="w-full bg-primary-600 hover:bg-primary-700 text-white font-bold py-2 px-4 rounded-lg transition-colors duration-300 flex items-center justify-center"
                  disabled={isSubmitting}
                >
                  <FaPaperPlane className="mr-2" />
                  {isSubmitting ? 'Sending...' : 'Send Message'}
                </button>
              </form>
            </div>
          </div>
        </section>
        
        {/* FAQ Section */}
        <section className="mb-16">
          <div className="text-center mb-10">
            <div className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-3">CUSTOMER SUPPORT</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-4 text-gray-800">Frequently Asked Questions</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Find quick answers to common questions about our products, shipping, returns, and services.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 gap-6">
            <FAQCard 
              icon={<FaShippingFast />}
              title="What are your shipping policies?"
              text="We offer free shipping on orders over $50. Standard shipping typically takes 3-5 business days, while express shipping options are available for an additional fee."
            />
            
            <FAQCard 
              icon={<FaHeadset />}
              title="Do you offer international shipping?"
              text="Yes, we ship to select international destinations. Shipping costs and delivery times vary by location. Please contact our customer service for more details."
            />
            
            <FAQCard 
              icon={<FaExchangeAlt />}
              title="What is your return policy?"
              text="We offer a 30-day return policy on most items. Products must be in unused condition with original packaging to qualify for a full refund."
            />
            
            <FAQCard 
              icon={<FaTools />}
              title="Do you offer installation services?"
              text="Yes, we partner with certified mechanics nationwide. You can add installation services to your order during checkout or contact us to arrange installation after purchase."
            />
          </div>
        </section>
        
        {/* Social Media */}
        <section className="mb-16">
          <div className="backdrop-blur-sm bg-white/80 rounded-2xl shadow-xl border border-gray-100 p-8 text-center">
            <div className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-3">STAY CONNECTED</div>
            <h2 className="text-2xl font-bold mb-4 text-gray-800">Connect With Us</h2>
            <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
              Stay updated with our latest products, promotions, and automotive news by following us on social media.
            </p>
            <div className="flex flex-wrap justify-center gap-4">
              <SocialButton icon={<FaFacebookF />} color="bg-[#1877F2]" href="https://facebook.com" />
              <SocialButton icon={<FaTwitter />} color="bg-[#1DA1F2]" href="https://twitter.com" />
              <SocialButton icon={<FaInstagram />} color="bg-gradient-to-r from-[#833AB4] via-[#FD1D1D] to-[#FCAF45]" href="https://instagram.com" />
              <SocialButton icon={<FaLinkedinIn />} color="bg-[#0A66C2]" href="https://linkedin.com" />
              <SocialButton icon={<FaYoutube />} color="bg-[#FF0000]" href="https://youtube.com" />
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const ContactCard = ({ icon, title, content }) => (
  <div className="backdrop-blur-sm bg-white/90 rounded-xl shadow-lg border border-gray-100 p-6 flex flex-col items-center text-center transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div className="bg-primary-100 p-4 rounded-full mb-4 text-primary-600 text-2xl">
      {icon}
    </div>
    <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
    <div className="text-gray-600">
      {content}
    </div>
  </div>
);

const FAQCard = ({ icon, title, text }) => (
  <div className="backdrop-blur-sm bg-white/80 rounded-xl shadow-lg border border-gray-100 p-6 transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div className="flex items-start">
      <div className="bg-primary-100 p-3 rounded-full mr-4 text-primary-600 text-xl flex-shrink-0">
        {icon}
      </div>
      <div>
        <h3 className="text-lg font-bold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600">{text}</p>
      </div>
    </div>
  </div>
);

const SocialButton = ({ icon, color, href }) => (
  <a 
    href={href} 
    target="_blank" 
    rel="noopener noreferrer" 
    className={`${color} text-white p-4 rounded-full shadow-md hover:shadow-lg transform transition-all duration-300 hover:-translate-y-1`}
  >
    <span className="text-xl">{icon}</span>
  </a>
);

export default Contact; 