import { Link, useNavigate, useLocation } from "react-router-dom"
import { useSelector } from "react-redux"
import { FaHome, FaSearch } from "react-icons/fa"
import { useState, useEffect } from "react";

const Header = () => {
  const { currentUser } = useSelector((state) => state.user)
  const [searchTerm, setSearchTerm] = useState('')
  const navigate = useNavigate()
  const location = useLocation();

  const handleSubmit = (e) => {
    e.preventDefault()
    const urlParams = new URLSearchParams(window.location.search)
    urlParams.set('searchTerm', searchTerm)
    const searchQuery = urlParams.toString()
    navigate(`/search?${searchQuery}`)
  }

  useEffect(() => {
    const urlParams = new URLSearchParams(location.search)
    const searchTermFromUrl = urlParams.get('searchTerm')
    if (searchTermFromUrl) {
      setSearchTerm(searchTermFromUrl)
    }
  }, [location.search])

  return (
    <header className="bg-slate-200 shadow-md">
      <div className="flex justify-between items-center max-w-6xl mx-auto p-3">

        <Link to="/">
          <h1 className="font-bold text-sm sm:text-xl flex flex-wrap gap-1 items-center">
            <FaHome className="text-3xl" />
            <span className="text-slate-700 mt-auto">
              <span className="text-3xl">E</span>state
            </span>
          </h1>
        </Link>

        <form onSubmit={handleSubmit} className="bg-slate-100 p-3 rounded-lg flex items-center">
          <input
            type="text"
            placeholder="Search"
            className="bg-transparent  outline-none w-20 sm:w-64 md:w-96"
            onChange={(e) => setSearchTerm(e.target.value)}
            value={searchTerm} />
          <button>
            <FaSearch />
          </button>
        </form>

        <ul className="flex gap-4">
          <Link to="/">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              Home
            </li>
          </Link>

          <Link to="/about">
            <li className="hidden sm:inline text-slate-700 hover:underline">
              About
            </li>
          </Link>

          <Link to="/profile">
            {currentUser ? (
              <img
                src={currentUser.avatar}
                alt="profile"
                className="rounded-full h-7 w-7 object-cover border-2 border-teal-700"
              />
            ) : (
              <li className="sm:inline text-slate-700 hover:underline">
                Sign in
              </li>
            )}
          </Link>

        </ul>
      </div>
    </header>
  );
};

export default Header;
