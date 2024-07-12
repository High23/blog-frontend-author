import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function LogIn() {
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [status, setStatus] = useState(null);
    const siteUrl = import.meta.env.VITE_SITEURL
    const navigate = useNavigate()
    useEffect(() => {
        async function checkIfLoggedIn() {
            let response;
            if (token !== null) {
                response = await fetch(siteUrl + 'login', {
                    headers: {
                        "Authorization": "Bearer " + token
                    }
                });
            } else {
                response = await fetch(siteUrl + 'login');
            }
            if (response.status >= 400) {
                navigate("/user", {replace: true});
                setStatus(response.status)
            }
        }
        checkIfLoggedIn()
    }, [])
    return (
        <>
            {(status === 200 || status === null) && <LogInForm siteUrl={siteUrl} navigate={navigate}></LogInForm>}
        </>
    )
}

function LogInForm({siteUrl, navigate}) {
    const [errors, setErrors] = useState(null)
    async function formSubmission(form) {
        form.preventDefault();
        const formData = new FormData(form.target)
        const data = `username=${formData.get('username')}&password=${formData.get('password')}`
        const response = await fetch(siteUrl + 'login', {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
            },
            body: data,
        });
        const info = await response.json()
        if (response.status >= 400) {
            setErrors(info.loginError);
        } else if (info.errors) {
            setErrors(info.errors);
        } else {
            localStorage.setItem('token', info.token);
            navigate("/user", {replace: true});
        }
    }

    return (
        <>
            <form action="" method='post' onSubmit={(form) => {formSubmission(form)}}>
                <div>
                    <label htmlFor="username">Username: </label>
                    {errors === 'Username does not exist.' && <div>{errors}</div>}
                    <input type="text" name="username"  id="username" minLength={1} maxLength={100} required />
                </div>
                <div>
                    <label htmlFor="password">Password: </label>
                    {errors === 'Invalid password' && <div>{errors}</div>}
                    <input type="password" name="password" id="password" minLength={7} required />
                </div>
                <button>Log In</button>
            </form>
            {(errors !== null && Array.isArray(errors)) && <LoginErrors errors={errors}></LoginErrors>}
        </>
    )
}

function LoginErrors({errors}) {
    return (
        <div> Errors:
            {errors.map((err, index) => {
                return (
                    <div key={index}>
                        <span>{err.msg}</span>
                    </div>
                )
            })}
        </div>
    )
}
