import React from 'react';
import { FaUsers, FaCheckCircle, FaAward } from 'react-icons/fa';
import teamData from './teamData';

const About = () => {
  return (
    <div className="page-container space-y-24">
      {/* Hero Section */}
      <section>
        <div className="container mx-auto text-center">
          <h1 className="page-title">About CarZone</h1>
          <p className="max-w-3xl mx-auto text-lg text-gray-600 mb-8">
            Your trusted destination for premium automotive accessories and parts.
            We're passionate about helping car enthusiasts enhance their vehicles.
          </p>
          <img
            src="https://images.unsplash.com/photo-1504222490345-c075b6008014?ixlib=rb-4.0.3&auto=format&fit=crop&w=1920&q=80"
            alt="Our team at CarZone"
            loading="lazy"
            className="w-full h-96 object-cover rounded-lg shadow-lg"
          />
        </div>
      </section>

      {/* Our Story */}
      <section>
        <div className="container mx-auto">
          <div className="card">
            <h2 className="text-3xl font-bold text-center mb-8">Our Story</h2>
            <div className="grid md:grid-cols-2 gap-10">
              <div className="space-y-4 text-gray-700">
                <p>
                  Founded in 2010, CarZone started as a small garage shop with a simple mission:
                  to provide high-quality automotive accessories to car enthusiasts.
                </p>
                <p>
                  Our founder, an avid car enthusiast, noticed a gap in the market for premium
                  car accessories that were both functional and stylish.
                </p>
                <p>
                  Today, we’re a nationwide retailer with a strong online presence, serving
                  thousands of satisfied customers.
                </p>
              </div>
              <div className="grid grid-cols-2 gap-6 items-center justify-center text-center">
                <StatBox value="10+" label="Years Experience" />
                <StatBox value="5000+" label="Products" />
                <StatBox value="50K+" label="Happy Customers" />
                <StatBox value="98%" label="Satisfaction Rate" />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Core Values */}
      <section>
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Our Core Values</h2>
          <div className="grid md:grid-cols-3 gap-6">
            <ValueCard icon={<FaCheckCircle />} title="Quality Assurance" text="We rigorously test all products to ensure they meet our high standards before they reach our customers." />
            <ValueCard icon={<FaUsers />} title="Customer Focus" text="Our customers are at the heart of everything we do. We strive to exceed expectations at every interaction." />
            <ValueCard icon={<FaAward />} title="Innovation" text="We continuously seek innovative products and solutions to enhance the driving experience." />
          </div>
        </div>
      </section>

      {/* Meet Our Team */}
      <section>
        <div className="container mx-auto">
          <h2 className="text-3xl font-bold text-center mb-8">Meet Our Team</h2>
          <div className="grid md:grid-cols-4 gap-6">
            {teamData.map((member, index) => (
              <div key={index} className="card text-center">
                <img
                  loading="lazy"
                  src={member.image}
                  alt={`Team member ${member.name}`}
                  className="w-32 h-32 rounded-full mx-auto mb-4 object-cover"
                />
                <h3 className="text-xl font-semibold">{member.name}</h3>
                <p className="text-gray-600 mb-2">{member.role}</p>
                <p className="text-gray-500 text-sm">{member.bio}</p>
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

const StatBox = ({ value, label }) => (
  <div className="p-4 text-center">
    <div className="text-4xl font-bold text-primary-600">{value}</div>
    <p className="text-gray-600">{label}</p>
  </div>
);

const ValueCard = ({ icon, title, text }) => (
  <div className="card text-center">
    <div className="flex justify-center mb-4">
      <div className="p-4 bg-primary-100 rounded-full" role="img" aria-label={title}>
        <span className="text-3xl text-primary-600">{icon}</span>
      </div>
    </div>
    <h3 className="text-xl font-semibold mb-3">{title}</h3>
    <p className="text-gray-600">{text}</p>
  </div>
);

export default About;
