import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../config";
import Sidebar from "../DashboardPages/Sidebar";

const Profile = () => {
  const [profile, setProfile] = useState(null);
  const [showForm, setShowForm] = useState(false); // Controls form visibility 
  const [showtable, setShowtable] = useState(false); // Controls form visibility 
  const [showfollowingtable, setShowFollowingtable] = useState(false); // Controls form visibility 
  const [loading, setLoading] = useState(false)

  const [MyPosts, setMyPosts] = useState([])
  const [posts, showPosts] = useState(false)
  const navigate = useNavigate()
  const [data, setData] = useState({
    fullName: "", username: "", bio: "", link: "", email: "", profileImg: "", coverImg: ""
  });

  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])

  const [likedPosts, setlikedPosts] = useState([])
  const [showLikedPosts, setShowLikedPosts] = useState(false)

  const changeHandle = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleFileChange = (e, type) => {
    if (type === "profileImg") {
      setData({ ...data, profileImg: e.target.files[0] });
    } else if (type === "coverImg") {
      setData({ ...data, coverImg: e.target.files[0] });
    }
  };

  const getProfile = async (username) => {
    try {
      const response = await fetch(`${api}/api/user/profile/${username}`, {
        method: "GET",
        credentials: "include",
      });
      const result = await response.json();
      if (response.ok) {
        setProfile(result);
        console.log(result)
      } else {
        console.log("Error:", result.error);
      }
    } catch (error) {
      console.log("Error:", error);
    }
  }

  const verifyUser = () => {
    fetch(`${api}/api/auth/me`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
      credentials: "include",
    })
      .then((response) => response.json())
      .then((data) => {
        getProfile(data.username);
      })
      .catch((error) => {
        console.error("Verify Error:", error);
      });
  };

  useEffect(() => {
    verifyUser();
  }, []);

  const submitHandle = async (e) => {
    e.preventDefault();
    setLoading(true)
    let updatedData = ""

    // Create FormData and append the selected images
    const formData = new FormData();
    if (data.profileImg) formData.append("image", data.profileImg);
    if (data.coverImg) formData.append("image", data.coverImg);
    if (data.profileImg || data.coverImg) {
      let presentimage = ""
      if (data.coverImg && !data.profileImg) {
        presentimage = data.coverImg
      }
      if (!data.coverImg && data.profileImg) {
        presentimage = data.profileImg
      }
      try {
        // Upload images first
        const response = await fetch(`${api}/upload/profile`, {
          method: "POST",
          body: formData
        });

        const result = await response.json();

        if (response.ok) {
          if (result.length === 1) {
            if (presentimage == data.coverImg) {
              updatedData = {
                ...data,
                coverImg: result[0] || ""
              }
            }
            else {
              updatedData = {
                ...data,
                profileImg: result[0] || ""
              }
            }
          }
          else {
            updatedData = {
              ...data,
              profileImg: result[0] || "",
              coverImg: result[1] || ""
            };
          }
          console.log(profile)
        } else {
          console.log("Image Upload Error:", result.error);
          return;
        }
      } catch (error) {
        console.log("Error uploading images", error);
        setLoading(false)
        return;
      }
    }

    try {

      const response = await fetch(`${api}/api/user/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedData || data),
        credentials: "include"
      });

      const result = await response.json();

      if (response.ok) {
        console.log("Profile updated:", result);
        setProfile(prevProfile => ({ ...prevProfile, ...result }));
        setShowForm(false);
        setData({
          fullName: "", username: "", bio: "", link: "", email: "", profileImg: "", coverImg: ""
        });
      } else {
        console.log("Profile Update Error:", result.error);
      }
    } catch (error) {
      console.error("Update Error:", error);
    }
    setLoading(false)
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

  const myposts = async (username) => {
    try {
      const response = await fetch(`${api}/api/posts/user/${username}`, {
        method: "GET",
        credentials: "include"
      })
      const result = await response.json()
      if (response.ok) {
        setMyPosts(result)
      }
    } catch (error) {
      console.log("Error:", error)
    }
  }

  const deletePost = async (id) => {
    try {
      const response = await fetch(`${api}/api/posts/delete/${id}`, {
        method: "DELETE",
        credentials: "include"
      })
      const result = await response.json()
      if (response.ok) {
        alert("POST Deleted Successfully.. Again open posts button")
        showPosts(result.posts)
      }

    } catch (error) {
      console.log("ERROR:", error)
    }
  }

  const likedposts = async () => {
    try {
      const response = await fetch(`${api}/api/posts/likedposts`, {
        method: "GET",
        credentials: "include"
      })
      const result = await response.json()
      if (response.ok) {
        setlikedPosts(result)
      }
    } catch (error) {
      console.log("ERROR:", error)
    }
  }

  return (
    <div className="flex flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 flex-row justify-centeryyyy mx-4">
        {profile ? (
          <div className="w-full max-w-2xl bg-white shadow-lg rounded-2xl overflow-hidden">
            {/* Cover Image */}
            <div className="relative h-44 bg-gray-300">
              <img
                src={profile.coverImg || "https://rukminim2.flixcart.com/image/850/1000/xif0q/poster/5/i/m/medium-wallpaper-ben-10-ultimate-alien-and-gwen-on-quality-paper-original-imah34vefvk97dpw.jpeg?q=90&crop=false"}
                alt="Cover"
                className="w-full h-full object-cover"
              />
            </div>

            {/* Profile Image */}
            <div className="flex justify-center">
              <img
                src={profile.profileImg || "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />
            </div>

            {/* User Details */}
            <div className="text-center mt-5 p-5">
              <h2 className="text-2xl font-bold text-gray-800">{profile.fullName}</h2>
              <p className="text-gray-500">@{profile.username}</p>
              <p className="text-gray-600">{profile.email}</p>
              {profile.bio && <p className="mt-2 text-gray-700 italic">{profile.bio}</p>}

              {profile.link && (
                <a
                  href={profile.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-2 text-blue-600 hover:underline block"
                >
                  {profile.link}
                </a>
              )}
            </div>

            {/* Stats */}
            <div className="flex justify-around p-5 border-t mt-4">
              <div className="text-center cursor-pointer border-2 border-transparent rounded-lg p-4 min-h-[100px] max-h-[200px] overflow-y-auto" onClick={() => { setFollowers(profile.followers); setShowtable(!showtable) }}>
                <h3 className="text-lg font-semibold text-gray-800">{profile.followers.length}</h3>
                <p className="text-gray-500">Followers</p>
                {showtable && (followers.length > 0 && followers.map((follower, index) => (
                  <div key={index} className="flex items-center space-x-3 my-2 border-b p-2">
                    <div onClick={() => navigateHandle(follower.username, follower._id)} >
                      <img className="w-10 h-10 bg-gray-300 rounded-full" src={follower.profileImg || "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"} />
                      <h2 className="text-md font-semibold text-gray-900">{follower.username}</h2>
                    </div>
                  </div>
                ))
                )}

              </div>
              <div className="text-center cursor-pointer border-2 border-transparent rounded-lg p-4 min-h-[100px] max-h-[200px] overflow-y-auto" onClick={() => { setFollowing(profile.following); setShowFollowingtable(!showfollowingtable) }}>
                <h3 className="text-lg font-semibold text-gray-800">{profile.following.length}</h3>
                <p className="text-gray-500">Following</p>
                {showfollowingtable && following.length > 0 && following.map((follow, index) => (
                  <div key={index} className="flex items-center space-x-3 my-2 border-b p-2">
                    <div onClick={() => navigateHandle(follow.username, follow._id)} >
                      <img className="w-10 h-10 bg-gray-300 rounded-full" src={follow.profileImg || "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"} />
                      <h2 className="text-md font-semibold text-gray-900">{follow.username}</h2>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        ) : (
          <h1 className="text-center text-gray-600 text-xl animate-pulse">Loading...</h1>
        )}
        <div className="flex flexrow justify-around m-2 w-full">
          <div className="w-1/2">
            <button onClick={() => { myposts(profile.username); showPosts(!posts) }} className="cursor-pointer bg-blue-500 text-white border hover:rounded-lg p-2 m-2">MyPosts🔥 click on post to see fully.</button>
            <div className="flex flex-row max-h-100 overflow-y-auto flex-wrap  p-2 m-2">

              {posts && (MyPosts.length > 0 ? (
                MyPosts.map((post, index) => (
                  <div className="m-2 p-2 border rounded-lg hover:rounded-2xl w-full" key={index}>

                    <div className="flex flex-row justify-between mx-2 items-center cursor-pointer">
                      <div className="flex flex-row justify-around  items-center" >
                        <img
                          className="w-10 h-10 rounded-full object-cover border border-gray-300 p-2"
                          src={post.user.profileImg || "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"}
                          alt="Profile"
                        />
                        <h2>{post.user.username}</h2>
                      </div>
                      <button className="bg-red-400 text-white border hover:rounded-2xl p-2 m-2 rounded-lg" onClick={() => deletePost(post._id)}>Delete</button>
                    </div >
                    {post.text && <p className="font-black p-2 text-lg">{post.text}</p>}
                    {post.img && (
                      <div className="w-100 h-100  overflow-hidden rounded-lg object-cover cursor-pointer" onClick={() => navigate(`/post/${post._id}`)}>
                        <img
                          src={post.img}
                          className="w-full h-full object-cover rounded-lg"
                          alt="Post"
                        />
                      </div>

                    )}

                  </div>

                ))) : (
                <h2>No Posts Found....</h2>
              ))}
            </div>
          </div>
          <div className="w-1/2">
            <button onClick={() => { likedposts(); setShowLikedPosts(!showLikedPosts) }} className="cursor-pointer bg-blue-500 text-white border hover:rounded-lg p-2 m-2">Liked Posts.👍,Click on post to see fully</button>
            <div className="flex flex-row max-h-100 overflow-y-auto flex-wrap  p-2 m-2">
              {showLikedPosts && (likedPosts.length > 0 ? (
                likedPosts.map((post, index) => (
                  <div className="m-2 p-2 border rounded-lg hover:rounded-2xl w-full" key={index}>

                    <div className="flex flex-row justify-between mx-2 items-center cursor-pointer">
                      <div className="flex flex-row justify-around  items-center" >
                        <img
                          className="w-10 h-10 rounded-full object-cover border border-gray-300 p-2"
                          src={post.user.profileImg || "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"}
                          alt="Profile"
                        />
                        <h2>{post.user.username}</h2>
                      </div>
                      <button className="bg-red-400 text-white border hover:rounded-2xl p-2 m-2 rounded-lg" onClick={() => deletePost(post._id)}>Delete</button>
                    </div >
                    {post.text && <p className="font-black p-2 text-lg">{post.text}</p>}
                    {post.img && (
                      <div className="w-100 h-100  overflow-hidden rounded-lg object-cover cursor-pointer" onClick={() => navigate(`/post/${post._id}`)}>
                        <img
                          src={post.img}
                          className="w-full h-full object-cover rounded-lg"
                          alt="Post"
                        />
                      </div>

                    )}

                  </div>

                ))) : (
                <h2>No Posts Found....</h2>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Update Button */}
      <div className="absolute top-10 right-10">
        <button
          className="bg-blue-600 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700"
          onClick={() => setShowForm(!showForm)}
        >
          Update your profile
        </button>

        {/* Form (Visible only if showForm is true) */}
        {showForm && (
          <div className="mt-4 p-6 bg-white shadow-lg rounded-lg absolute right-0">
            <form onSubmit={submitHandle} className="flex flex-col gap-3">
              <input type='text' name='fullName' placeholder='Full Name' onChange={changeHandle} value={data.fullName} className="p-2 border rounded" />
              <input type='text' name='username' placeholder='Username' onChange={changeHandle} value={data.username} className="p-2 border rounded" />
              <input type='text' name='bio' placeholder='Bio' onChange={changeHandle} value={data.bio} className="p-2 border rounded" />
              <input type='text' name='link' placeholder='Link' onChange={changeHandle} value={data.link} className="p-2 border rounded" />
              <input type='email' name='email' placeholder='Email' onChange={changeHandle} value={data.email} className="p-2 border rounded" />
              <label>Upload Profile Image</label>
              <input type="file" accept="image/*" placeholder="upload profile image" onChange={(e) => handleFileChange(e, "profileImg")} />
              <label>Upload Cover Image</label>
              <input type="file" accept="image/*" placeholder="upload cover image" onChange={(e) => handleFileChange(e, "coverImg")} />

              <input type='submit' value={loading ? "Loading..." : "Update"} className="bg-green-600 text-white px-4 py-2 rounded cursor-pointer hover:bg-green-700" />
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;