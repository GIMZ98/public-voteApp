import { Link } from 'react-router-dom'

const Navbar = () => {
  return (
    <>
     <nav className="fixed flex top-0 justify-end w-full bg-slate-900 sm:px-[50px] px-0">
        <ul className="flex sm:w-[260px] w-screen justify-between">
            <Link to="/home"><li className="text-xl text-center font-bold text-white hover:bg-blue-900 py-5 sm:w-[130px] px-5">Home</li></Link>
            <Link to="/status"><li className="text-xl text-center font-bold text-white hover:bg-blue-900 py-5 sm:w-[130px] px-5">Status</li></Link>
        </ul>
    </nav>
    </>
  )
}

export default Navbar