import React from 'react';

/**
 * ThemeDemo - A component to showcase the Urban Tech Auto theme
 */
const ThemeDemo = () => {
  return (
    <div className="page-container">
      <h1 className="page-title">Urban Tech Auto Theme</h1>
      <p className="text-center mb-8 description">
        A modern automotive marketplace theme with sophistication and clarity
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Color Palette Section */}
        <div className="card">
          <h2 className="text-2xl font-bold mb-4 font-poppins">Color Palette</h2>
          
          <div className="space-y-4">
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-md bg-primary-600"></div>
              <div className="ml-4">
                <p className="font-medium">Primary (Dark Teal)</p>
                <p className="text-sm text-steel-500">#0F766E</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-md bg-secondary-600"></div>
              <div className="ml-4">
                <p className="font-medium">Accent (Royal Blue)</p>
                <p className="text-sm text-steel-500">#1D4ED8</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-md bg-highlight-500"></div>
              <div className="ml-4">
                <p className="font-medium">Highlight (Sunset Orange)</p>
                <p className="text-sm text-steel-500">#F97316</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-md bg-background border border-soft-200"></div>
              <div className="ml-4">
                <p className="font-medium">Background (Ultra Light Gray)</p>
                <p className="text-sm text-steel-500">#F3F4F6</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-md bg-surface border border-soft-200"></div>
              <div className="ml-4">
                <p className="font-medium">Surface (White)</p>
                <p className="text-sm text-steel-500">#FFFFFF</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-md bg-slate-800"></div>
              <div className="ml-4">
                <p className="font-medium">Text Primary (Slate Black)</p>
                <p className="text-sm text-steel-500">#1E293B</p>
              </div>
            </div>
            
            <div className="flex items-center">
              <div className="w-12 h-12 rounded-md bg-steel-500"></div>
              <div className="ml-4">
                <p className="font-medium">Text Muted (Steel Grey)</p>
                <p className="text-sm text-steel-500">#64748B</p>
              </div>
            </div>
          </div>
        </div>

        {/* Typography & UI Elements */}
        <div className="space-y-8">
          <div className="card">
            <h2 className="text-2xl font-bold mb-4 font-poppins">Typography</h2>
            
            <div className="space-y-4">
              <div>
                <h1 className="text-4xl font-bold font-poppins">Heading 1</h1>
                <p className="text-sm text-steel-500">Poppins, Bold (700)</p>
              </div>
              
              <div>
                <h2 className="text-3xl font-semibold font-poppins">Heading 2</h2>
                <p className="text-sm text-steel-500">Poppins, Semi-Bold (600)</p>
              </div>
              
              <div>
                <h3 className="text-2xl font-medium font-poppins">Heading 3</h3>
                <p className="text-sm text-steel-500">Poppins, Medium (500)</p>
              </div>
              
              <div>
                <p className="text-base">Body Text - This is the standard paragraph style using Inter font family at 16px size with a line height of 1.6. Perfect for readability and clean aesthetics.</p>
                <p className="text-sm text-steel-500">Inter, Regular (400)</p>
              </div>
              
              <div>
                <p className="price">$29,999</p>
                <p className="text-sm text-steel-500">Price (Tabular Numbers)</p>
              </div>
            </div>
          </div>
          
          <div className="card">
            <h2 className="text-2xl font-bold mb-4 font-poppins">UI Elements</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <p className="font-medium">Buttons</p>
                <div className="flex flex-wrap gap-2">
                  <button className="btn-primary">Primary</button>
                  <button className="btn-secondary">Secondary</button>
                  <button className="btn-outline">Outline</button>
                  <button className="btn-danger">Danger</button>
                </div>
              </div>
              
              <div className="space-y-2">
                <p className="font-medium">Input Fields</p>
                <input 
                  type="text" 
                  className="input-field" 
                  placeholder="Enter your search term" 
                />
              </div>
              
              <div className="space-y-2">
                <p className="font-medium">Cards</p>
                <div className="card bg-surface rounded-card shadow-card p-4">
                  <p className="font-medium">Nested Card Example</p>
                  <p className="text-sm text-steel-500">With 16px rounded corners and soft shadow</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Car Card Example */}
      <h2 className="text-2xl font-bold mb-6 text-center font-poppins">Car Listing Example</h2>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((item) => (
          <div key={item} className="car-card card overflow-hidden">
            <div className="car-card-image relative h-48 bg-slate-100 rounded-t-card">
              <div className="absolute inset-0 flex items-center justify-center text-steel-500">
                Car Image Placeholder
              </div>
              <span className="absolute top-2 right-2 bg-highlight-500 text-white px-2 py-1 rounded-md text-sm font-medium">
                New
              </span>
            </div>
            <div className="car-card-content p-4">
              <div className="flex justify-between items-start mb-2">
                <h3 className="text-xl font-bold">Tesla Model 3</h3>
                <span className="price">$42,990</span>
              </div>
              <p className="description mb-3">Electric Sedan • 2023 • 358mi range</p>
              <div className="flex gap-2">
                <button className="btn-primary flex-1">View Details</button>
                <button className="btn-outline">Save</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Mobile Nav Demo */}
      <h2 className="text-2xl font-bold mt-12 mb-6 text-center font-poppins">Mobile Navigation</h2>
      <div className="card p-4 relative h-16 mb-12">
        <p className="text-center text-steel-500">On mobile devices, a sticky navigation appears here</p>
        <div className="mobile-nav-bottom mt-4 position-static">
          <button className="mobile-nav-button">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span className="text-xs">Home</span>
          </button>
          <button className="mobile-nav-button">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
            <span className="text-xs">Search</span>
          </button>
          <button className="mobile-nav-button">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span className="text-xs">Sell</span>
          </button>
          <button className="mobile-nav-button">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            <span className="text-xs">Profile</span>
          </button>
        </div>
      </div>
    </div>
  );
};

export default ThemeDemo; 