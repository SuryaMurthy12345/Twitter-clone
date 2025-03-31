import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../config";
import Createpost from "./Createpost";
import { commentHandle, commentSubmitHandle, deleteCommentHandle, likesHandle } from "./Helpful";

const Foryou = () => {
  const [posts, setPosts] = useState([]);
  const [postid, setPostid] = useState("");
  const [text, setText] = useState("");
  const [comments, setComments] = useState([]);
  const [openPostId, setOpenPostId] = useState(null); // Tracks which post's comments are open  
  const [presentuser, setPresentUser] = useState("");
  const navigate = useNavigate()

  const fetchPosts = async () => {
    try {
      const response = await fetch(`${api}/api/posts/getFollowingPosts`, {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok) {
        console.log("Posts fetched successfully");
        setPosts(result.allposts);
        setPresentUser(result.presentuser)
      } else {
        console.log("Error", result.error);
      }
    } catch (error) {
      console.log("Error", error);
    }
  };

  const navigateHandle = async (username, id) => {
    try {
      const response = await fetch(`${api}/api/user/check/${id}`, {
        method: "GET",
        credentials: "include"
      })
      const result = await response.json()
      if (response.ok) {

        navigate(`/userprofile/${username}/${result.text}`)
      }
    } catch (error) {
      console.log("Error:", error)
    }

  }

  useEffect(() => {
    fetchPosts();
  }, []);

  return (
    <div className="flex flex-col m-2 p-4 max-h-screen overflow-y-auto">
      <div>
        <Createpost />
      </div>
      <div className="flex flex-col space-y-4">
        {posts.length > 0 ? (
          posts.map((post) => (
            <div key={post._id} className="border p-4 m-4 rounded-xl shadow-lg bg-white">
              <div className="flex flex-row p-2 cursor-pointer" onClick={() => { post.user._id === presentuser ? (navigate('/profile')) : (navigateHandle(post.user.username, post.user._id)) }} >
                <img
                  className="w-10 h-10 rounded-full object-cover border border-gray-300"
                  src={post.user.profileImg || "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"}
                  alt="Profile"
                />
                <h2 className="font-bold text-xl mb-2 m-2">@{post.user.username}</h2>
              </div>
              <p className="font-black p-2 text-lg">{post.text}</p>

              {/* Image Section */}
              {post.img && (
                <div className="w-full max-h-[500px] overflow-hidden rounded-lg">
                  <img
                    src={post.img}
                    className="w-full h-auto object-cover rounded-lg"
                    alt="Post"
                  />
                </div>
              )}

              {/* Like & Comment Section */}
              <div className="flex justify-between mt-4 px-2">
                <button
                  className="flex items-center gap-2 bg-blue-500 text-white px-4 py-2 rounded-lg shadow-md transition-all duration-300 hover:bg-blue-600 hover:scale-105 cursor-pointer"
                  onClick={() => likesHandle(post._id, setPosts)}
                >
                  <span>👍</span>
                  <span className="font-semibold">Likes:</span>
                  <span>{post.likes.length}</span>
                </button>

                <button
                  className="flex items-center gap-2 text-gray-600 px-4 py-2 rounded-lg shadow-md border border-gray-300 transition-all duration-300 hover:bg-gray-100 hover:scale-105 cursor-pointer"
                  onClick={() => commentHandle(post._id, setPostid, setOpenPostId, setComments, openPostId, setPresentUser)}
                >
                  <span>💬</span>
                  <span className="font-semibold">Comments:</span>
                  <span>{post.comments.length}</span>
                </button>
              </div>

              {/* Comment Section (Visible for the respective post) */}
              {openPostId === post._id && (
                <div className="mt-4 p-3 border rounded-lg bg-gray-50 shadow-md">
                  <div className="max-h-[200px] overflow-y-auto border p-2 rounded-lg bg-white">
                    {comments.length > 0 ? (
                      comments.map((comment) => (
                        <div key={comment._id} className="border-b p-2 flex gap-3 items-center hover:cursor-pointer">
                          {/* User Profile Image */}
                          <div onClick={() => { comment.user._id === presentuser ? (navigate('/profile')) : (navigateHandle(comment.user.username, comment.user._id)) }} className="flex gap-3 items-center cursor-pointer">
                            <img
                              className="w-8 h-8 rounded-full object-cover border border-gray-300"
                              src={comment.user.profileImg || "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"}
                              alt="Profile"
                            />
                            <div className="flex flex-col w-full">
                              <h2 className="font-bold text-sm">@{comment.user.username}</h2>
                              <p className="text-gray-700 text-sm">{comment.text}</p>
                            </div>
                          </div>

                          {/* Delete Button (Only for the comment owner) */}
                          {comment.user._id === presentuser && (
                            <button
                              className="text-white bg-red-400 px-3 py-1 text-sm rounded-md hover:bg-red-500 transition"
                              onClick={() => deleteCommentHandle(comment._id, openPostId, setPosts)}
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

                  <textarea
                    placeholder="Write a comment..."
                    className="border p-2 w-full rounded-md mt-2"
                    rows="3"
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                  />
                  <button
                    className="w-full mt-2 p-2 bg-blue-500 text-white rounded-md cursor-pointer hover:bg-blue-600"
                    onClick={() => commentSubmitHandle(postid, text, setText, setComments, setPosts)}
                  >
                    Comment
                  </button>
                </div>
              )}
            </div>
          ))
        ) : (
          <div className="text-center text-gray-500">No Posts Found</div>
        )}
      </div>
    </div>
  );
};

export default Foryou;