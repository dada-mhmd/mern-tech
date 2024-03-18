const Footer = () => {
  const currentYear = new Date().getFullYear();
  return (
    <footer className=' bg-gray-800 text-white py-3'>
      <div className='container mx-auto text-center'>
        <p className='text-sm'>Tech &copy; {currentYear}</p>
      </div>
    </footer>
  );
};

export default Footer;
