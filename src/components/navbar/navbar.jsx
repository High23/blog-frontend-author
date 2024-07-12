import { Link } from 'react-router-dom'
import './navbar.css'

export default function NavBar() {
    return (
        <>
            <header>
                <Link to='https://high-blog-frontend-user.netlify.app/'>User site</Link>
                <Link to='/post/create'>Create a Post</Link>
                <Link to='/logout'>Log Out</Link>
                <Link to='/user'>Profile</Link>
            </header>
        </>
        
    )
}