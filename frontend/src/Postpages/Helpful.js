import { api } from "../config";

export const likesHandle = async (postId, setPosts) => {
    try {
        const response = await fetch(`${api}/api/posts/like/${postId}`, {
            method: "POST",
            credentials: "include",
        });
        const result = await response.json();
        if (response.ok) {
            console.log("Post liked/unliked successfully");
            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === postId ? { ...post, likes: result.likes } : post
                )
            );
        } else {
            console.log("Error", result.error);
        }
    } catch (error) {
        console.log("Error", error);
    }
};

export const commentHandle = async (postId, setPostid, setOpenPostId, setComments, openPostId, setPresentUser) => {
    if (openPostId === postId) {
        setOpenPostId(null);
        return;
    }
    setPostid(postId);
    setOpenPostId(postId);
    try {
        const response = await fetch(`${api}/api/posts/getAllComments/${postId}`, {
            method: "GET",
            credentials: "include",
        });
        const result = await response.json();
        if (response.ok) {
            8
            console.log("Comments fetched successfully");
            console.log(result)
            setComments(result.allcomments);
            setPresentUser(result.presentuserid)
        } else {
            console.log("Error", result.error);
        }
    } catch (error) {
        console.log("Error", error);
    }
};

export const commentSubmitHandle = async (postid, text, setText, setComments, setPosts) => {
    try {
        const response = await fetch(`${api}/api/posts/comment/${postid}`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            credentials: "include",
            body: JSON.stringify({ text }),
        });
        const result = await response.json();
        if (response.ok) {
            console.log("Commented successfully");
            setComments(result.comments);

            setPosts((prevPosts) =>
                prevPosts.map((post) =>
                    post._id === postid ? { ...post, comments: result.comments } : post
                )
            );

            setText("");
        } else {
            console.log("Error", result.error);
        }
    } catch (error) {
        console.log("Error", error);
    }
};

export const deleteCommentHandle = async (commentid, postid, setPosts) => {
    console.log(commentid, postid)
    try {
        const response = await fetch(`${api}/api/posts/deletecomment/${commentid}`, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            credentials: "include",
            body: JSON.stringify({ postid })
        })
        const result = await response.json()
        if (response.ok) {
            alert("comment deleted, again open comments to see your comment is deleted-")
            setPosts((prevposts) =>
                prevposts.map((post) =>
                    post._id === postid ? { ...post, comments: result.comments || [] } : post
                )
            );
        }
        else {
            console.log("Error", result.error)
        }

    } catch (error) {
        console.log("Error", error);
    }
}

