import React, { useEffect, useMemo } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchFeaturedProducts } from '../redux/slices/productSlice';
import ProductSlider from './products/ProductSlider';
import { fetchCategories } from '../redux/slices/categorySlice';
import CategoryCard from './category/CategoryCard';
import FeaturedProducts from './products/FeaturedProducts';

const Home = () => {
  const dispatch = useDispatch();
  const { featuredProducts, featuredLoading } = useSelector(state => state.products);
  const { categories } = useSelector(state => state.categories);

  useEffect(() => {
    dispatch(fetchFeaturedProducts());
    dispatch(fetchCategories());
  }, [dispatch]);

  // Sample slider data with proper structure
  const sliderData = useMemo(() => (
    featuredProducts?.slice(0, 5).map(product => ({
      id: product.id,
      title: product.name,
      description: product.description?.length > 120 
        ? `${product.description.substring(0, 120)}...` 
        : product.description,
      imageUrl: product.image_url,
      link: `/products/${product.id}`
    })) || []
  ), [featuredProducts]);

  return (
    <div className="min-h-screen">
      {/* Hero Section with Product Slider */}
      <section className="container mx-auto px-4 pt-4 pb-8">
        {featuredLoading ? (
          <div className="w-full h-[500px] bg-gray-200 animate-pulse rounded-lg"></div>
        ) : (
          <ProductSlider slides={sliderData} autoPlaySpeed={6000} />
        )}
      </section>

      {/* Categories Section */}
      <section className="bg-gray-50 py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Shop by Category</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {categories?.slice(0, 8).map(category => (
              <CategoryCard key={category.id} category={category} />
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products Section */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-8 text-center">Featured Products</h2>
          <FeaturedProducts products={featuredProducts} loading={featuredLoading} />
        </div>
      </section>
    </div>
  );
};

export default Home; 