import { useState, useEffect  } from "react";
import { useNavigate, useParams} from "react-router-dom";
import { format } from "date-fns";
import { UTCDate } from "@date-fns/utc";
import NavBar from "../navbar/navbar";

export function CurrentUser() {
    const [currentUser, setCurrentUser] = useState(null)
    const [token, setToken] = useState(localStorage.getItem('token'));
    const navigate = useNavigate()

    useEffect(() => {
        if (token === null) {
            throw new Error('You can not access this page');
        }
        async function fetchCurrentUser() {
            const response = await fetch(import.meta.env.VITE_SITEURL + 'user', {
                headers: {
                    "Authorization": "Bearer " + token
                }
            });
            const data = await response.json()
            setCurrentUser(data.user)
        }
        fetchCurrentUser()
    }, [token]);

    return (
        <>
            <NavBar></NavBar>
            { (currentUser !== null) && 
            <>
                <div> 
                    <h3>Username: { currentUser.username }</h3>
                    <div>Author status: { currentUser.author === false ? "Not an author" : "Is an author" }</div>
                    <button type="button" onClick={() => {
                        navigate(`${currentUser._id}/edit`)
                    }}>Edit user </button>
                </div>
                <ShowPostsOrComments userId={currentUser._id} token={token}></ShowPostsOrComments>
            </>
            }
        </>
    )
}

function ShowPostsOrComments({ userId, token }) {
    const [data, setData] = useState(null);
    const [refresh, setRefresh] = useState(0)
    const navigate = useNavigate()
    
    useEffect(() => {
        getPostsOrComments('allPosts', userId, setData, token)
    }, [refresh])
    
    async function changePostStatus(status, postId) {
        if (status) {
            status = 'unpublish'
        } else {
            status = 'publish'
        }
        await fetch(import.meta.env.VITE_SITEURL + `post/${postId}/${status}`, {
            method: "PUT",
            headers: {
                "Authorization": "Bearer " + token
            }
        });
        setRefresh(num => num + 1)
    }

    return (
        <>
            <div>
                <button type="button" className='user-buttons' onClick={() => {
                    getPostsOrComments('allPosts', userId, setData, token)
                }}>Posts</button>
                <button type="button" className='user-buttons' onClick={() => {
                    getPostsOrComments('comments', userId, setData, token)
                }}>Comments</button>
            </div>
            <section>
                {data !== null && data.map((info) => {
                    return (
                        <div key={ info._id }>
                            { info.title && 
                            <>
                                <h3 className='post-title clickable'>{info.title}</h3>
                                <button type="button" onClick={() => {
                                    navigate(`/post/${info._id}/edit`, {replace: true})
                                }}>Edit</button>
                                <button type="button"  onClick={() => {
                                    changePostStatus(info.published, info._id)
                                }}>{info.published === true ? 'unpublish' : 'publish'}</button>
                            </>
                            }
                            { info.post && <h4>Posted on: {info.post.title}</h4> }
                            <div>Created on: {format(new UTCDate(info.date), 'LL/dd/yy KK:mm a')} UTC</div>
                            <p className='user-comment'>{info.text}</p>
                        </div>
                    )
                })} 
            </section>
        </>
    )
}

async function getPostsOrComments(btnClicked, userId, setData, token) {
    const response = await fetch(import.meta.env.VITE_SITEURL + `user/${userId}/${btnClicked}`, {
        headers: {
            "Authorization": "Bearer " + token
        }
    });
    const fetchData = await response.json()
    if (fetchData.userPosts) {
        setData(fetchData.userPosts)
    } else if (fetchData.userComments) {
        setData(fetchData.userComments)
    }
}


export function EditCurrentUser() {
    const [user, setUser] = useState(undefined)
    const [fetchError, setFetchError] = useState(null);
    const navigate = useNavigate();
    const [token, setToken] = useState(localStorage.getItem('token'));
    const params = useParams()
    const siteUrl = import.meta.env.VITE_SITEURL + `/user/${params.userId}/edit`;

    useEffect(() => {
        async function checkIfCurrentUser() {
            const response = await fetch(siteUrl, {
                method: "GET",
                headers: {
                    "Content-Type": "application/x-www-form-urlencoded",
                    "Authorization": "Bearer " + token
                }
            });
            const data = await response.json()
            if (response.status !== 200) {
                setFetchError(data.error);
                setTimeout(() => {
                    navigate('/logout', {replace: true});
                }, 3000);
            } else {
                setUser(data.user)
            }
        }
        checkIfCurrentUser()
    }, [token])

    return (
        <>
            <NavBar token={token}></NavBar>
            <EditForm siteUrl={siteUrl} token={token} setToken={setToken} navigate={navigate} user={user}></EditForm>
            {fetchError !== null &&
            <p>
                An fetch error has occurred. Error: {fetchError}. Logging you out.
            </p>
            }
        </>
    )
}

function EditForm({siteUrl, token, setToken, navigate, user}) {
    const [errors, setErrors] = useState(null);

    async function formSubmission(form) {
        form.preventDefault();
        const formData = new FormData(form.target);
        const data = `username=${formData.get('username')}&password=${formData.get('password')}&author=${formData.get('authorCheckBox')}`;
        const response = await fetch(siteUrl, {
            method: "POST",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Bearer " + token
            },
            body: data,
        });
        
        const info = await response.json();
        if (info.errors) {
            setErrors(info.errors);
        } else {
            localStorage.setItem('token', info.token);
            setToken(info.token)
            navigate('/user', {replace: true})
        }
    }

    return (
        <>
        {
            user !== undefined &&
            <form action="" method='post' onSubmit={(form) => {formSubmission(form)}}>
                <div>
                    <label htmlFor="username">Username: </label>
                    {errors === 'Username does not exist.' && <div>{errors}</div>}
                    <input type="text" name="username" id="username" min={1} maxLength={100} defaultValue={user.username === undefined ? '' : user.username} required/>
                </div>
                <div>
                    <label htmlFor="password">Password: </label>
                    {errors === 'Invalid password' && <div>{errors}</div>}
                    <input type="password" name="password" id="password" autoComplete='off' min={7} />
                </div>
                <div>
                    <label htmlFor="authorCheckBox">Author: </label>
                    { user.author ? 
                    <>
                        <input type="checkbox" name="authorCheckBox" id="authorCheckBox" defaultChecked/>
                    </> : 
                    <>
                        <input type="checkbox" name="authorCheckBox" id="authorCheckBox" />
                    </>}
                </div>
                <button>Save Changes</button>
            </form>
        }
        </>
    )
}
