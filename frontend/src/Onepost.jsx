import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { api } from "./config";

const Onepost = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [post, setPost] = useState(null);
  const [showComments, setShowComments] = useState(false);
  const [presentUser, setPresentUser] = useState("");
  const [commentText, setCommentText] = useState("");

  useEffect(() => {
    fetchPost();
  }, []);

  const fetchPost = async () => {
    try {
      const response = await fetch(`${api}/api/posts/onepost/${id}`, {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok) {
        setPost(result);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`${api}/api/posts/like/${postId}`, {
        method: "POST",
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok) {
        setPost((prevPost) => ({
          ...prevPost,
          likes: result.likes,
        }));
      } else {
        console.log("Error", result.error);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleComments = async (postId) => {
    setShowComments(!showComments);
    try {
      const response = await fetch(`${api}/api/posts/getAllComments/${postId}`, {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok) {
        setPost((prevPost) => ({
          ...prevPost,
          comments: result.allcomments,
        }));
        setPresentUser(result.presentuserid);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleDeleteComment = async (commentId, postId) => {
    try {
      const response = await fetch(`${api}/api/posts/deletecomment/${commentId}`, {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ postid: postId }),
      });
      const result = await response.json();
      if (response.ok) {
        alert("Comment deleted! Refresh comments to see the update.");
        setPost((prevPost) => ({
          ...prevPost,
          comments: result.comments,
        }));
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleCommentSubmit = async (postId) => {
    try {
      const response = await fetch(`${api}/api/posts/comment/${postId}`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ text: commentText }),
      });
      const result = await response.json();
      if (response.ok) {
        setPost((prevPost) => ({
          ...prevPost,
          comments: result.comments,
        }));
        setCommentText("");
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const handleUserProfileNavigation = async (username, userId) => {
    try {
      const response = await fetch(`${api}/api/user/check/${userId}`, {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok) {
        navigate(`/userprofile/${username}/${result.text}`);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      {post ? (
        <div className="bg-white shadow-lg rounded-lg p-6 max-w-lg w-full">
          {/* User Profile Section */}
          <div className="flex items-center gap-4">
            <img
              src={post.user.profileImg || "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"}
              className="w-12 h-12 rounded-full border-2 border-blue-500"
              alt="Profile"
            />
            <h2 className="text-lg font-semibold">{post.user.username}</h2>
          </div>

          {post.text && <p className="font-black p-2 text-lg">{post.text}</p>}

          {/* Post Image */}
          {post.img && (<div className="mt-4 w-full max-h-[500px] overflow-hidden rounded-lg">
            <img
              src={post.img}
              className="w-full h-auto object-cover rounded-lg transition-transform duration-300 hover:scale-105"
              alt="Post"
            />
          </div>)}


          {/* Like & Comment Buttons */}
          <div className="flex justify-between mt-4 px-2">
            <button
              className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:bg-blue-600 hover:scale-105 cursor-pointer"
              onClick={() => handleLike(post._id)}
            >
              👍 <span className="font-semibold">Likes:</span> {post.likes.length}
            </button>

            <button
              className="flex items-center gap-2 text-gray-600 px-4 py-2 rounded-lg shadow-md border border-gray-300 transition-all duration-300 hover:bg-gray-100 hover:scale-105 cursor-pointer"
              onClick={() => handleComments(post._id)}
            >
              💬 <span className="font-semibold">Comments:</span> {post.comments.length}
            </button>
          </div>

          {/* Post Content */}
          <p className="mt-4 text-gray-700 text-sm">{post.content}</p>

          {/* Comments Section */}
          {showComments && (
            <div className="mt-4 p-3 border rounded-lg bg-gray-50 shadow-md">
              <div className="max-h-[300px] overflow-y-auto border p-2 rounded-lg bg-white">
                {post.comments.length > 0 ? (
                  post.comments.map((comment) => (
                    <div key={comment._id} className="border-b p-2 flex justify-between items-center">
                      <div
                        onClick={() =>
                          comment.user._id === presentUser
                            ? navigate("/profile")
                            : handleUserProfileNavigation(comment.user.username, comment.user._id)
                        }
                        className="flex gap-3 items-center cursor-pointer"
                      >
                        <img
                          className="w-8 h-8 rounded-full object-cover border border-gray-300"
                          src={comment.user.profileImg || "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"}
                          alt="Profile"
                        />
                        <div className="flex flex-col">
                          <h2 className="font-bold text-sm">@{comment.user.username}</h2>
                          <p className="text-gray-700 text-sm">{comment.text}</p>
                        </div>
                      </div>

                      {comment.user._id === presentUser && (
                        <button
                          className="text-white bg-red-400 px-3 py-1 text-sm rounded-md hover:bg-red-500 transition"
                          onClick={() => handleDeleteComment(comment._id, post._id)}
                        >
                          🚮 Delete
                        </button>
                      )}
                    </div>
                  ))
                ) : (
                  <p className="text-gray-500 text-sm">No comments yet.</p>
                )}
              </div>

              {/* Add Comment Input */}
              <textarea
                placeholder="Write a comment..."
                className="border p-2 w-full rounded-md mt-2"
                rows="3"
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
              />
              <button
                className="w-full mt-2 p-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
                onClick={() => handleCommentSubmit(post._id)}
              >
                Comment
              </button>
            </div>
          )}
        </div>
      ) : (
        <p className="text-lg font-semibold text-gray-500">Loading...</p>
      )}
    </div>
  );
};

export default Onepost;