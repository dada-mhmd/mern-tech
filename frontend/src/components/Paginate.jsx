import { Link } from 'react-router-dom';

const Paginate = ({ pages, pageNumber, isAdmin = false, keyword = '' }) => {
  const pageNumbers = Array.from({ length: pages }, (_, i) => i + 1);

  return (
    pages > 1 && (
      <ul className='flex space-x-2'>
        {pageNumbers?.map((num) => (
          <Link
            key={num}
            to={
              !isAdmin
                ? keyword
                  ? `/search/${keyword}/page/${num}`
                  : `/page/${num}`
                : `/admin/products/${num}`
            }
            className={`px-3 py-2 rounded-md border ${
              pageNumber === num
                ? 'bg-blue-500 text-white'
                : 'border-gray-300 hover:bg-gray-100'
            }`}
          >
            {num}
          </Link>
        ))}
      </ul>
    )
  );
};

export default Paginate;
