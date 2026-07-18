import  useAuth  from "../../hooks/useAuth";
import { useNavigate} from "react-router-dom";
import Button from "./Button";

export default function Navbar() {
    const { logout } = useAuth();
    const navigate = useNavigate();



    return (
        <nav className="navbar flex items-center justify-between border-b border-slate-200/80 bg-slate-50/90 px-4 py-4 shadow-sm backdrop-blur-sm sm:px-6 lg:px-8">
            <div className="navbar-left flex items-center">
                <h1
                  className="navbar-title cursor-pointer text-lg font-semibold tracking-tight text-slate-900 transition-colors hover:text-blue-600 sm:text-xl"
                  onClick={() => navigate("/dashboard")}
                >
                  URL Shortener
                </h1>
            </div>
            <div className="navbar-right flex items-center">
                <Button className="!w-auto" onClick={logout}>Logout</Button>
            </div>
        </nav>
    );
}
