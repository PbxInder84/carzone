import React from 'react';
import { FaCar, FaTools, FaUsers, FaCheckCircle, FaAward } from 'react-icons/fa';

const About = () => {
  return (
    <div className="page-container">
      {/* Hero Section */}
      <section className="mb-16">
        <div className="container mx-auto">
          <div className="text-center">
            <h1 className="page-title">About CarZone</h1>
            <p className="max-w-3xl mx-auto text-lg text-gray-600 mb-8">
              Your trusted destination for premium automotive accessories and parts. 
              We're passionate about helping car enthusiasts enhance their vehicles.
            </p>
          </div>
          <div className="mt-8">
            <img 
              src="https://images.unsplash.com/photo-1504222490345-c075b6008014?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80" 
              alt="CarZone Team" 
              className="w-full h-96 object-cover rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Our Story */}
      <section className="mb-16">
        <div className="container mx-auto">
          <div className="card">
            <h2 className="text-3xl font-bold mb-6 text-center">Our Story</h2>
            <div className="grid md:grid-cols-2 gap-8">
              <div>
                <p className="text-gray-700 mb-4">
                  Founded in 2010, CarZone started as a small garage shop with a simple mission: to provide high-quality automotive accessories to car enthusiasts. What began as a passion project quickly evolved into a trusted name in the automotive accessory market.
                </p>
                <p className="text-gray-700 mb-4">
                  Our founder, an avid car enthusiast, noticed a gap in the market for premium car accessories that were both functional and aesthetically pleasing. With this vision, CarZone was born to bridge this gap and offer products that truly enhance the driving experience.
                </p>
                <p className="text-gray-700">
                  Today, we've grown into a nationwide retailer with an extensive online presence, serving thousands of satisfied customers. Despite our growth, we remain committed to our core values of quality, innovation, and exceptional customer service.
                </p>
              </div>
              <div className="flex items-center justify-center">
                <div className="grid grid-cols-2 gap-4">
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold text-primary-600">10+</div>
                    <p className="text-gray-600">Years Experience</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold text-primary-600">5000+</div>
                    <p className="text-gray-600">Products</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold text-primary-600">50K+</div>
                    <p className="text-gray-600">Happy Customers</p>
                  </div>
                  <div className="text-center p-4">
                    <div className="text-4xl font-bold text-primary-600">98%</div>
                    <p className="text-gray-600">Satisfaction Rate</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Values */}
      <section className="mb-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary-100 rounded-full">
                  <FaCheckCircle className="text-3xl text-primary-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Quality Assurance</h3>
              <p className="text-gray-600">
                We rigorously test all products to ensure they meet our high standards before they reach our customers.
              </p>
            </div>
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary-100 rounded-full">
                  <FaUsers className="text-3xl text-primary-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Customer Focus</h3>
              <p className="text-gray-600">
                Our customers are at the heart of everything we do. We strive to exceed expectations at every interaction.
              </p>
            </div>
            <div className="card text-center">
              <div className="flex justify-center mb-4">
                <div className="p-4 bg-primary-100 rounded-full">
                  <FaAward className="text-3xl text-primary-600" />
                </div>
              </div>
              <h3 className="text-xl font-semibold mb-3">Innovation</h3>
              <p className="text-gray-600">
                We continuously seek innovative products and solutions to enhance the driving experience.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="mb-16">
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold mb-8 text-center">Meet Our Team</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map((item) => (
              <div key={item} className="card text-center">
                <img
                  src={`https://randomuser.me/api/portraits/${item % 2 === 0 ? 'women' : 'men'}/${item + 10}.jpg`}
                  alt="Team Member"
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold">John Doe</h3>
                <p className="text-gray-600 mb-2">Co-Founder & CEO</p>
                <p className="text-gray-500 text-sm">
                  Car enthusiast with over 15 years of experience in the automotive industry.
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action */}
      <section className="bg-primary-600 text-white py-12 rounded-lg">
        <div className="container mx-auto text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Transform Your Vehicle?</h2>
          <p className="text-lg mb-8 max-w-2xl mx-auto">
            Explore our extensive collection of premium automotive accessories and parts.
          </p>
          <button className="bg-white text-primary-600 hover:bg-gray-100 font-bold py-3 px-8 rounded">
            Shop Now
          </button>
        </div>
      </section>
    </div>
  );
};

export default About; 