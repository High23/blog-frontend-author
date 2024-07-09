import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { format } from "date-fns";
import { UTCDate } from "@date-fns/utc";

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
                                <h3 className='post-title clickable' onClick={() => {
                                    navigate(`/post/${info._id}`, {replace: true})
                                }}>{info.title}</h3>
                                <button type="button" onClick={() => {
                                    navigate(`post/${info._id}/edit`)
                                }}>Edit</button>
                                <button type="button"  onClick={() => {
                                    changePostStatus(info.published, info._id)
                                }}>{info.published === true ? 'unpublish' : 'publish'}</button>
                            </>
                            }
                            { info.post && 
                            <>
                                <h4>Posted on: 
                                    <span className='post-title clickable' onClick={() => {
                                        navigate(`/post/${info.post._id}`, {replace: true})
                                    }}> {info.post.title}</span>
                                </h4>
                            </>
                            }
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
