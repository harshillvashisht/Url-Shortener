import  useAuth  from "../../hooks/useAuth";
import { useNavigate} from "react-router-dom";
import Button from "./Button";

export default function Navbar() {
    const { logout } = useAuth();
    const navigate = useNavigate();



    return (
        <nav className="navbar">
            <div className="navbar-left">
                <h1 className="navbar-title" onClick={() => navigate("/dashboard")}>URL Shortener</h1>
            </div>
            <div className="navbar-right">
                <Button onClick={logout}>Logout</Button>
            </div>
        </nav>
    );
}
