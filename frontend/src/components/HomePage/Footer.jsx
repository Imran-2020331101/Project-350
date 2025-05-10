
function Footer() {
  return (
      <footer className=" mt-9 w-full bg-gradient-to-b from-[#0f1a20] to-gray-800 py-6 text-center text-gray-200 font-medium tracking-wide">
        <p className="text-lg md:text-xl text-gray-100">
          &copy; {new Date().getFullYear()}{' '}
          <span className="font-semibold text-white">OnTheGo</span>. All rights reserved.
        </p>
        <p className="text-xs mt-2">Sylhet, Sylhet Division, Bangladesh</p>
      </footer>
  );
}

export default Footer;
