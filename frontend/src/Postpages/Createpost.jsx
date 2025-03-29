import React, { useState } from 'react'
import { api } from '../config'

const Createpost = () => {
    const [text, setText] = useState("")
    const [file, setFile] = useState(null)
    const [loading, setLoading] = useState(false)

    const submitHandle = async (e) => {
        let imageUrl = ""
        e.preventDefault()
        setLoading(true)

        // Upload image if there's a file
        if (file) {
            const formData = new FormData()
            formData.append("image", file)

            try {
                const response = await fetch(`${api}/upload`, {
                    method: "POST",
                    body: formData
                })
                if (!response.ok) throw new Error("Image upload failed")
                const result = await response.json()
                imageUrl = result.imageUrl
            } catch (error) {
                console.error("Upload Error:", error)
                alert("Image upload failed!")
                setLoading(false)
                return
            }
        }

        // Create post with the uploaded image URL (if available)
        try {
            const response = await fetch(`${api}/api/posts/create`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify({ text, img: imageUrl })
            })
            const result = await response.json()
            if (response.ok) {
                console.log("Post created:", result)
                alert("Post created successfully!")
                setText("")
                setFile(null)
            } else {
                console.error("Post Error:", result.error || "Failed to create post")
                alert("Failed to create post!")
            }
        } catch (error) {
            console.error("Error creating post:", error)
            alert("Error creating post!")
        }

        setLoading(false)
    }

    return (
        <div className="flex justify-center items-center p-4 bg-gray-100 rounded-lg max-w-md mx-auto shadow-md">
            <form className="w-full p-6 bg-white rounded-lg shadow-lg" onSubmit={submitHandle}>
                <textarea
                    className="w-full h-32 p-4 border border-gray-300 rounded-lg resize-none mb-4 text-lg"
                    placeholder="Write Something....."
                    value={text}
                    onChange={(e) => setText(e.target.value)}
                ></textarea>
                <div className="mb-4">
                    <input
                        className="w-full p-2 border border-gray-300 rounded-lg"
                        type="file"
                        accept="image/*"
                        onChange={(e) => setFile(e.target.files[0])}
                    />
                </div>
                <input
                    className="w-full p-3 text-white bg-blue-600 rounded-lg cursor-pointer hover:bg-blue-500 transition-all disabled:bg-gray-300"
                    type="submit"
                    value={loading ? "Posting..." : "Post"}
                    disabled={loading}
                />
            </form>
        </div>
    )
}

export default Createpost
