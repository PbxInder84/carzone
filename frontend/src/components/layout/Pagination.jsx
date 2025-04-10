import { FaChevronLeft, FaChevronRight } from 'react-icons/fa';

const Pagination = ({ currentPage, totalPages, onPageChange }) => {
  const getPageNumbers = () => {
    const pageNumbers = [];
    const maxPagesToShow = 5;
    
    // If total pages <= maxPagesToShow, show all pages
    if (totalPages <= maxPagesToShow) {
      for (let i = 1; i <= totalPages; i++) {
        pageNumbers.push(i);
      }
      return pageNumbers;
    }
    
    // Always show first and last page
    // Show current page and one page before and after it
    const startPage = Math.max(2, currentPage - 1);
    const endPage = Math.min(totalPages - 1, currentPage + 1);
    
    pageNumbers.push(1);
    
    // Add ellipsis after first page if needed
    if (startPage > 2) {
      pageNumbers.push('...');
    }
    
    // Add pages around current page
    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }
    
    // Add ellipsis before last page if needed
    if (endPage < totalPages - 1) {
      pageNumbers.push('...');
    }
    
    pageNumbers.push(totalPages);
    
    return pageNumbers;
  };
  
  if (totalPages <= 1) {
    return null;
  }
  
  return (
    <div className="flex justify-center items-center space-x-2 my-8">
      {/* Previous button */}
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className={`flex items-center justify-center w-10 h-10 rounded-full border ${
          currentPage === 1
            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
            : 'border-primary-600 text-primary-600 hover:bg-primary-50'
        }`}
        aria-label="Previous Page"
      >
        <FaChevronLeft />
      </button>
      
      {/* Page numbers */}
      {getPageNumbers().map((page, index) => (
        <button
          key={index}
          onClick={() => typeof page === 'number' && onPageChange(page)}
          disabled={page === '...'}
          className={`w-10 h-10 rounded-full flex items-center justify-center ${
            page === currentPage
              ? 'bg-primary-600 text-white'
              : page === '...'
              ? 'cursor-default'
              : 'border border-gray-200 hover:border-primary-600 hover:text-primary-600'
          }`}
        >
          {page}
        </button>
      ))}
      
      {/* Next button */}
      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className={`flex items-center justify-center w-10 h-10 rounded-full border ${
          currentPage === totalPages
            ? 'border-gray-200 text-gray-400 cursor-not-allowed'
            : 'border-primary-600 text-primary-600 hover:bg-primary-50'
        }`}
        aria-label="Next Page"
      >
        <FaChevronRight />
      </button>
    </div>
  );
};

export default Pagination; 