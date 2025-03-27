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

export const commentHandle = async (postId, setPostid, setOpenPostId, setComments, openPostId) => {
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
            console.log("Comments fetched successfully");
            setComments(result);
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
