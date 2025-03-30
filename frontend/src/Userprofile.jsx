import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import Sidebar from "./DashboardPages/Sidebar";
import { api } from "./config";

const Userprofile = () => {
  const [profile, setProfile] = useState(null);

  const [showtable, setShowtable] = useState(false); // Controls form visibility 
  const [showfollowingtable, setShowFollowingtable] = useState(false); // Controls form visibility 

  const navigate = useNavigate()

  const [followers, setFollowers] = useState([])
  const [following, setFollowing] = useState([])

  const [posts, showPosts] = useState(false)
  const [MyPosts, setMyPosts] = useState([])

  let { username, text } = useParams()

  const [name, setName] = useState(text)
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
  };

  const followHandle = async (id) => {
    try {
      const response = await fetch(`${api}/api/user/follow/${id}`, {
        method: 'POST',
        credentials: "include"
      })
      const result = await response.json()
      if (response.ok) {
        name == "Unfollow" ? setName("Follow") : name
        name == "Follow" ? setName("Unfollow") : name
      }
    } catch (error) {
      console.log("Error:", error)
    }
  }

  useEffect(() => {
    getProfile(username)
  }, [username]);

  const navigateHandle = async (username, id) => {
    try {
      const response = await fetch(`${api}/api/user/check/${id}`, {
        method: "GET",
        credentials: "include"
      })
      const result = await response.json()
      console.log(result.text)
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

  return (
    <div className="flex flex-row h-screen bg-gray-100">
      {/* Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex-1 p-8 flex-row justify-around mx-4">
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

            {/* Profile Image & Follow Button Container */}
            <div className="flex flex-col items-center ">
              <img
                src={profile.profileImg || "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"}
                alt="Profile"
                className="w-32 h-32 rounded-full border-4 border-white shadow-lg"
              />

              {/* Follow Button Directly Under the Image */}
              <button
                onClick={() => followHandle(profile._id)}
                className="mt-3 bg-blue-500 text-white font-bold border border-blue-600 
               rounded-md px-4 py-2 hover:bg-blue-600 hover:shadow-md 
               transition-all flex flex-row items-center justify-center"
              >
                {name}
              </button>
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
                    <div onClick={() => navigateHandle(follower.username, follower._id)}  >
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
        <div>
          <button onClick={() => { myposts(profile.username); showPosts(!posts) }} className="cursor-pointer bg-blue-500 text-white border hover:rounded-lg p-2 m-2">See Posts🙈 and click on it to view full.</button>
          <div className="flex flex-row w-1/2 max-h-100 overflow-y-auto flex-wrap  p-2 m-2">

            {posts && (MyPosts.length > 0 ? (
              MyPosts.map((post, index) => (
                <div className="m-2 p-2 border rounded-lg hover:rounded-2xl w-full" key={index}>

                  <div className="flex flex-row justify-between mx-2 items-center cursor-pointer" onClick={() => navigate(`/post/${post._id}`)}>
                    <div className="flex flex-row justify-around  items-center" >
                      <img
                        className="w-10 h-10 rounded-full object-cover border border-gray-300 p-2"
                        src={post.user.profileImg || "https://s3.amazonaws.com/37assets/svn/765-default-avatar.png"}
                        alt="Profile"
                      />
                      <h2>{post.user.username}</h2>
                    </div>

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
              <h2>No Posts Found...</h2>
            ))}
          </div>
        </div>
      </div>

    </div>
  );
};

export default Userprofile;