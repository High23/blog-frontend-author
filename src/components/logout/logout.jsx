import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export function LogOut() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [error, setError] = useState(null);
    const navigate = useNavigate();
    
    useEffect(() => {
        if (token === null) {
            setError("You can not log out when you are not logged in!");
        } else {
            localStorage.removeItem('token');
        }
        setTimeout(() => {
            navigate('/', {replace: true});
        }, 3000);
    }, [])
    
    return(
        <>
            { error !== null ? 
            <p>
                {error}
            </p> :
            <p>
                Logging you out, please wait...
            </p>
            }
        </>
    )
}