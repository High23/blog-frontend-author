import { useState, useEffect } from "react"
import { useNavigate, useParams } from "react-router-dom"
import NavBar from "../navbar/navbar"

export function EditPost() {
    const token = localStorage.getItem('token')
    const [oldPost, setOldPost] = useState(null)
    const [error, setError] = useState(null)
    const params = useParams()
    useEffect(() => {
        if (token === null) {
            setError("You do not have a token!")
            return
        }
        async function verifyAuthorStatus() {
            const response = await fetch(import.meta.env.VITE_SITEURL + `post/${params.postId}/edit`, {
                headers: {
                    "Authorization": "Bearer " + token
                }
            });
            if (response.status === 500) {
                setError("An error has occurred fetching this page. You either do not have access or a valid token!")
                return;
            }
            const data = await response.json()
            setOldPost(data)
        }
        verifyAuthorStatus()
    }, [])
    return (
        <>
            {error === null && oldPost !== null ? 
            <EditPostForm token={token} oldPost={oldPost} params={params}></EditPostForm>
            : <>{error}</>}
        </>
    )
}

function EditPostForm({token, oldPost, params}) {
    const [errors, setErrors] = useState(null);
    const navigate = useNavigate()

    async function formSubmission(form) {
        form.preventDefault();
        const formData = new FormData(form.target);
        const data = `title=${formData.get('postTitle')}&text=${formData.get('postText')}&published=${formData.get('publishCheckBox')}`;
        const response = await fetch(import.meta.env.VITE_SITEURL + `post/${params.postId}/edit`, {
            method: "PUT",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Bearer " + token,
            },
            body: data,
        });
        if (response.status === 200) {
            return
        }
        const info = await response.json();
        if (info.errors) {
            setErrors(info.errors);
            return
        }
    }

    return (
        <>
            <form action="" method='post' onSubmit={(form) => {formSubmission(form)}}>
                <div>
                    <label htmlFor="postTitle">Title: </label>
                    <input type="text" name="postTitle" id="postTitle" autoComplete='off' defaultValue={oldPost.title}/>
                </div>
                <div>
                    <label htmlFor="postText">Text: </label>
                    <textarea type="text" name="postText" id="postText" cols={120} rows={30} defaultValue={oldPost.text} />
                </div>
                <div>
                    <label htmlFor="publishCheckBox">Publish: </label>
                    { oldPost.published ? 
                    <>
                        <input type="checkbox" name="publishCheckBox" id="publishCheckBox" defaultChecked/>
                    </> : 
                    <>
                        <input type="checkbox" name="publishCheckBox" id="publishCheckBox" />
                    </>}
                </div>
                <button>Save changes</button>
            </form>
            {errors !== null && <PostUpdateErrors errors={errors}></PostUpdateErrors>}
        </>
    )
}

function PostUpdateErrors({errors}) {
    return (
        <div> Post creation error(s):
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

export function CreatePost() {
    const [token, setToken] = useState(localStorage.getItem('token'))
    const [error, setError] = useState(null)
    useEffect(() => {
        if (token === null) {
            setError("You do not have a token!")
            return
        }
        async function verifyAuthorStatus() {
            const response = await fetch(import.meta.env.VITE_SITEURL + "post/create", {
                headers: {
                    "Authorization": "Bearer " + token
                }
            });
            if (response.status === 500) {
                setError("An error has occurred fetching this page. You either do not have access or a valid token!")
            }
        }
        verifyAuthorStatus()
    }, [])

    return (
        <>
            <NavBar token={token}></NavBar>
            {error === null ? 
            <CreateForm token={token}></CreateForm>
            : <>{error}</>}
        </>
    )
}

function CreateForm({token}) {
    const [errors, setErrors] = useState(null);
    const navigate = useNavigate()

    async function formSubmission(form) {
        form.preventDefault();
        const formData = new FormData(form.target);
        const data = `title=${formData.get('postTitle')}&text=${formData.get('postText')}&published=${formData.get('publishCheckBox')}`;
        const response = await fetch(import.meta.env.VITE_SITEURL + "post/create", {
            method: "post",
            headers: {
                "Content-Type": "application/x-www-form-urlencoded",
                "Authorization": "Bearer " + token,
            },
            body: data,
        });
        const info = await response.json();
        if (info.errors) {
            setErrors(info.errors);
            return
        }
        navigate(`/user`, {replace: true})
    }

    return (
        <>
            <form action="" method='post' onSubmit={(form) => {formSubmission(form)}}>
                <div>
                    <label htmlFor="postTitle">Title: </label>
                    <input type="text" name="postTitle" id="postTitle" autoComplete='off' />
                </div>
                <div>
                    <label htmlFor="postText">Text: </label>
                    <textarea type="text" name="postText" id="postText" cols={120} rows={30}  />
                </div>
                <div>
                    <label htmlFor="publishCheckBox">Publish: </label>
                    <input type="checkbox" name="publishCheckBox" id="publishCheckBox"/>
                </div>
                <button>Create post</button>
            </form>
            {errors !== null && <PostCreationErrors errors={errors}></PostCreationErrors>}
        </>
    )
}


function PostCreationErrors({errors}) {
    return (
        <div> Post creation error(s):
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