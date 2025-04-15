import React from 'react';
import { FaUsers, FaCheckCircle, FaAward, FaTrophy, FaHandshake, FaLeaf, FaCar, FaTools, FaShippingFast } from 'react-icons/fa';
import teamData from './teamData';
import { Link } from 'react-router-dom';

const About = () => {
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
            <h1 className="text-4xl md:text-5xl font-bold mb-6 leading-tight">Driving Excellence in Automotive Accessories</h1>
            <p className="text-xl text-gray-100 mb-10 leading-relaxed">
              Your trusted destination for premium automotive parts and accessories.
              We're passionate about helping car enthusiasts enhance their driving experience.
            </p>
          </div>
        </div>
        
        {/* Hero image with overlay */}
        <div className="relative h-80 md:h-96">
          <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent z-10"></div>
          <img
            src="https://images.unsplash.com/photo-1504222490345-c075b6008014?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="CarZone team and showroom"
            className="w-full h-full object-cover"
          />
        </div>
      </section>

      <div className="container mx-auto px-4 py-8">
        {/* Our Mission */}
        <section className="py-12">
          <div className="max-w-4xl mx-auto text-center mb-12">
            <div className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-3">OUR MISSION</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">Enhancing Your Driving Experience</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              At CarZone, we believe that every drive should be extraordinary. Our mission is to provide car enthusiasts and everyday drivers alike with premium automotive accessories that enhance performance, comfort, safety, and style.
            </p>
          </div>
        </section>

        {/* Our Story */}
        <section className="py-12">
          <div className="backdrop-blur-sm bg-white/90 rounded-2xl shadow-xl border border-gray-100 overflow-hidden">
            <div className="md:flex">
              <div className="md:w-1/2 bg-primary-700">
                <img 
                  src="https://images.unsplash.com/photo-1567361808960-dec9cb578182?ixlib=rb-4.0.3&auto=format&fit=crop&w=800&q=80" 
                  alt="CarZone store front" 
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="md:w-1/2 p-8 md:p-12 flex flex-col justify-center">
                <div className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-3">OUR STORY</div>
                <h2 className="text-3xl font-bold mb-6 text-gray-800">From Garage to Global</h2>
                <div className="space-y-4 text-gray-700">
                  <p className="leading-relaxed">
                    Founded in 2010, CarZone started as a small garage shop with a passionate team of automotive enthusiasts. We noticed a gap in the market for premium car accessories that combined functionality, style and quality.
                  </p>
                  <p className="leading-relaxed">
                    What began as a local shop serving our community has grown into a nationwide retailer with a strong online presence, serving thousands of satisfied customers across the country and beyond.
                  </p>
                  <p className="leading-relaxed">
                    Despite our growth, we remain true to our founding principles: exceptional product quality, outstanding customer service, and a genuine passion for everything automotive.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-12">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            <StatBox value="10+" label="Years of Excellence" icon={<FaTrophy />} />
            <StatBox value="5000+" label="Premium Products" icon={<FaTools />} />
            <StatBox value="50K+" label="Happy Customers" icon={<FaUsers />} />
            <StatBox value="98%" label="Satisfaction Rate" icon={<FaCheckCircle />} />
          </div>
        </section>

        {/* Our Core Values */}
        <section className="py-12">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-3">OUR VALUES</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">The Principles That Drive Us</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Our core values shape everything we do – from the products we select to how we interact with our customers.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <ValueCard 
              icon={<FaCheckCircle />} 
              title="Quality Assurance" 
              text="We rigorously test all products to ensure they meet our high standards before they reach you. We stand behind every item we sell with confidence."
            />
            <ValueCard 
              icon={<FaHandshake />} 
              title="Customer Focus" 
              text="Our customers are at the heart of everything we do. We listen to your needs and strive to exceed your expectations at every interaction."
            />
            <ValueCard 
              icon={<FaAward />} 
              title="Innovation" 
              text="We continuously seek innovative products and solutions to enhance your driving experience, staying ahead of trends in the automotive industry."
            />
            <ValueCard 
              icon={<FaCar />} 
              title="Automotive Passion" 
              text="We're car enthusiasts first and foremost. Our team's passion for automobiles drives us to find the best accessories for your vehicle."
            />
            <ValueCard 
              icon={<FaLeaf />} 
              title="Sustainability" 
              text="We're committed to eco-friendly practices and offering products that help reduce environmental impact without compromising performance."
            />
            <ValueCard 
              icon={<FaShippingFast />} 
              title="Reliability" 
              text="Count on us for fast shipping, accurate information, and dependable service. We deliver on our promises so you can focus on the road ahead."
            />
          </div>
        </section>

        {/* Meet Our Team */}
        <section className="py-12">
          <div className="text-center mb-12">
            <div className="inline-block px-3 py-1 bg-primary-100 text-primary-800 rounded-full text-sm font-medium mb-3">OUR TEAM</div>
            <h2 className="text-3xl md:text-4xl font-bold mb-6 text-gray-800">Leadership Team</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Meet the passionate professionals who drive CarZone's commitment to automotive excellence.
            </p>
          </div>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamData.map((member, index) => (
              <div key={index} className="backdrop-blur-sm bg-white/90 rounded-xl shadow-lg border border-gray-100 p-6 text-center transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
                <div className="relative w-32 h-32 mx-auto mb-6">
                  <div className="absolute inset-0 bg-primary-200 rounded-full opacity-50 blur-md"></div>
                  <img
                    loading="lazy"
                    src={member.image}
                    alt={`${member.name} - ${member.role}`}
                    className="relative z-10 w-32 h-32 rounded-full mx-auto object-cover border-4 border-white shadow-md"
                  />
                </div>
                <h3 className="text-xl font-bold text-gray-800">{member.name}</h3>
                <p className="text-primary-600 font-medium mb-3">{member.role}</p>
                <p className="text-gray-600 text-sm mb-4">{member.bio}</p>
                <div className="flex justify-center space-x-3">
                  <a href="#" className="text-gray-500 hover:text-primary-600" aria-label={`${member.name}'s LinkedIn profile`}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z" />
                    </svg>
                  </a>
                  <a href="#" className="text-gray-500 hover:text-primary-600" aria-label={`${member.name}'s Twitter profile`}>
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                      <path d="M23.953 4.57a10 10 0 01-2.825.775 4.958 4.958 0 002.163-2.723c-.951.555-2.005.959-3.127 1.184a4.92 4.92 0 00-8.384 4.482C7.69 8.095 4.067 6.13 1.64 3.162a4.822 4.822 0 00-.666 2.475c0 1.71.87 3.213 2.188 4.096a4.904 4.904 0 01-2.228-.616v.06a4.923 4.923 0 003.946 4.827 4.996 4.996 0 01-2.212.085 4.936 4.936 0 004.604 3.417 9.867 9.867 0 01-6.102 2.105c-.39 0-.779-.023-1.17-.067a13.995 13.995 0 007.557 2.209c9.053 0 13.998-7.496 13.998-13.985 0-.21 0-.42-.015-.63A9.935 9.935 0 0024 4.59z" />
                    </svg>
                  </a>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* Call to Action */}
        <section className="py-12">
          <div className="relative overflow-hidden backdrop-blur-md bg-gradient-to-r from-primary-600 to-primary-800 rounded-2xl shadow-xl p-12 text-white">
            <div className="absolute top-0 right-0 -mr-16 -mt-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
            <div className="absolute bottom-0 left-0 -ml-16 -mb-16 w-64 h-64 rounded-full bg-white/10 blur-3xl"></div>
            
            <div className="relative z-10 text-center max-w-2xl mx-auto">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Transform Your Vehicle?</h2>
              <p className="text-lg mb-8">
                Explore our extensive collection of premium automotive accessories and parts. Your perfect driving experience awaits.
              </p>
              <Link to="/products" className="inline-block bg-white text-primary-700 hover:bg-gray-100 font-bold py-3 px-8 rounded-full shadow-lg transition-all duration-300 hover:shadow-xl transform hover:-translate-y-1">
                Shop Now
              </Link>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

const StatBox = ({ value, label, icon }) => (
  <div className="backdrop-blur-sm bg-white/80 rounded-xl shadow-lg border border-gray-100 p-6 text-center transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div className="text-primary-600 mb-3 flex justify-center text-3xl">
      {icon}
    </div>
    <div className="text-4xl font-bold text-gray-800 mb-1">{value}</div>
    <p className="text-gray-600 font-medium">{label}</p>
  </div>
);

const ValueCard = ({ icon, title, text }) => (
  <div className="backdrop-blur-sm bg-white/80 rounded-xl shadow-lg border border-gray-100 p-6 text-center transform transition-all duration-300 hover:shadow-xl hover:-translate-y-1">
    <div className="inline-flex justify-center items-center w-16 h-16 rounded-full bg-primary-100 text-primary-600 mb-6">
      <span className="text-2xl">{icon}</span>
    </div>
    <h3 className="text-xl font-bold text-gray-800 mb-3">{title}</h3>
    <p className="text-gray-600">{text}</p>
  </div>
);

export default About;
