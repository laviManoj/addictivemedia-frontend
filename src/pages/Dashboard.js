import React, { useState, useRef, useEffect } from "react";
import LogoutButton from "../components/LogoutButton";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

const Dashboard = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [videoFile, setVideoFile] = useState(null);
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [vedioUrl, setvedioUrl] = useState([]);
  const [imgUrl, setImageUrl] = useState("");
  const [videoTitle, setVideoTitle] = useState("");
  const [videoDescription, setVideoDescription] = useState("");
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);


  const fileInputRef = useRef(null);

  const AuthToken = localStorage.getItem("token");

  const handleVideoUpload = (event) => {
    setVideoFile(event.target.files[0]);
  };
  const handleProfileImageChange = (event) => {
    setProfileImageFile(event.target.files[0]);
  };
  const handleProfileImageClick = () => {
    fileInputRef.current.click();
  };

  const handleProfileUpload = async () => {
    if (!profileImageFile) {
      alert("Please select a profile image to upload.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("image", profileImageFile);
      setIsLoading(true);

      const response = await fetch(
        "https://addictive-media-backend.vercel.app/api/media/profileImage",
        {
          // Replace with your API endpoint
          method: "POST",
          body: formData,
          headers: {
            Authorization: AuthToken,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setImageUrl(data?.data?.url);
      console.log("API response:", data);
      toast.success("Profile image uploaded successfully!");
      setProfileImageFile(null);
    } catch (error) {
      toast.error("Error uploading profile image:", error);
      alert(
        "There was an error uploading the profile image. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  
  const handleSubmit = async () => {
    if (!videoFile) {
      alert("Please select a video file to upload.");
      return;
    }

    try {
      const formData = new FormData();
      formData.append("videos", videoFile);
      setIsLoading(true);

      const response = await fetch(
        "https://addictive-media-backend.vercel.app/api/media/vedioUpload",
        {
          method: "POST",
          body: formData,
          headers: {
            Authorization: AuthToken,
          },
        }
      );

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("API response:", data);
      setvedioUrl((prevUrls) => [...prevUrls, data?.data?.urls]);
      toast.success("Video uploaded successfully!");
      setVideoFile(null);
      setVideoTitle("");
      setVideoDescription("");
      setShowPopup(false);
    } catch (error) {
      toast.error("Error uploading video:", error);
      alert("There was an error uploading the video. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleSubmitform = async () => {
    const firstName = document.getElementById("firstName").value;
    const lastName = document.getElementById("lastName").value;
    const email = document.getElementById("email").value;
    const phoneNumber = document.getElementById("phoneNumber").value;
    const bioData = document.getElementById("bio").value;
    const videoTitle = document.getElementById("vedio").value;

    const requestBody = {
      firstName,
      lastName,
      email,
      phoneNumber,
      videoTitle,
      bioData,
      profileImage: imgUrl,
      vedio: vedioUrl,
    };

    try {
      setIsLoading(true);

      const response = await fetch(
        "https://addictive-media-backend.vercel.app/api/updateAccount",
        {
          // Replace with your API endpoint
          method: "PUT",
          headers: {
            Authorization: AuthToken,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(requestBody),
        }
      );

      console.log(requestBody, "nnnnnnnnnnnnnnnnnnnnn");

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Form submission response:", data);
      toast.success("Form submitted successfully!");
    } catch (error) {
      toast.error("Error submitting form:", error);
      alert("There was an error submitting the form. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(
          "https://addictive-media-backend.vercel.app/api/accountDetails",
          {
            // Replace with your API endpoint
            method: "GET",
            headers: {
              Authorization: AuthToken,
              "Content-Type": "application/json",
            },
          }
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const result = await response.json();
        setData(result?.user);
      } catch (error) {
        setError(error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">UPLOAD DATA</h1>
          <LogoutButton />
        </div>
      </header>
      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="flex items-start space-x-6">
          <div className="flex flex-col items-center space-y-4">
            <div
              className="w-24 h-24 bg-gray-300 rounded-full overflow-hidden cursor-pointer"
              onClick={handleProfileImageClick}
            >
              <img
                src={data?.profileImage || "/path-to-profile-image.jpg"}
                alt="Profile"
                className="w-full h-full object-cover"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              ref={fileInputRef}
              onChange={handleProfileImageChange}
              className="hidden"
            />
            <button
              className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
              onClick={handleProfileUpload}
              disabled={isLoading}
            >
              {isLoading ? "Uploading..." : "Upload Profile"}
            </button>
          </div>
          <div className="flex-1">
            <div className="mb-4">
              <label
                htmlFor="firstName"
                className="block text-sm font-medium text-gray-700"
              >
                First Name
              </label>
              <input
                type="text"
                id="firstName"
                name="firstName"
                readOnly
                defaultValue={data?.firstName || ""}
                className="mt-1 block w-80 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="lastName"
                className="block text-sm font-medium text-gray-700"
              >
                Last Name
              </label>
              <input
                type="text"
                id="lastName"
                name="lastName"
                defaultValue={data?.lastName || ""}
                className="mt-1 block w-80 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                defaultValue={data?.email || ""}
                className="mt-1 block w-80 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="phoneNumber"
                className="block text-sm font-medium text-gray-700"
              >
                Phone Number
              </label>
              <input
                type="tel"
                id="phoneNumber"
                name="phoneNumber"
                defaultValue={data?.phoneNumber || ""}
                className="mt-1 block w-80 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
              />
            </div>
            <div className="mb-4">
              <label
                htmlFor="bio"
                className="block text-sm font-medium text-gray-700"
              >
                Add Bio
              </label>
              <textarea
                id="bio"
                name="bio"
                defaultValue={data?.bioData || ""}
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="Enter your Bio Information"
                maxLength={500}
                rows={4}
              ></textarea>
            </div>
            <div className="mb-4">
              <label
                htmlFor="vedio"
                className="block text-sm font-medium text-gray-700"
              >
                Vedio Title
              </label>
              <textarea
                id="vedio"
                name="vedio"
                defaultValue={data?.videoTitle || ""}
                className="mt-1 block w-80 rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="Enter your Bio Information"
                maxLength={50}
              ></textarea>
            </div>
            <div className="mb-4">
              <label
                htmlFor="uploadVideo"
                className="block text-sm font-medium text-gray-700"
              >
                Upload Video
              </label>
              <button
                onClick={() => setShowPopup(true)}
                className="mt-1 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300"
              >
                Upload Video
              </button>
            </div>

            <button
              onClick={handleSubmitform}
              disabled={isLoading}
              className="bg-blue-500 text-white px-4 py-2 w-full rounded-md hover:bg-green-600 transition duration-300"
            >
              {isLoading ? "Uploading..." : "Submit"}
            </button>
          </div>
        </div>
        <p className="mt-6">Welcome to your dashboard!</p>

        <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
  {data?.vedio?.map((video, index) => (
    <div key={index} className="bg-white shadow-md rounded-lg overflow-hidden">
      <video
        src={video}
        controls
        autoPlay
        muted
        className="w-full h-48 object-cover"
      />
      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-800">Video {index + 1}</h3>
      </div>
    </div>
  ))}
</div>

      </main>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
          <div className="bg-white p-8 rounded-lg max-w-md w-full">
            <h2 className="text-2xl font-bold mb-4">Upload Video</h2>
            <p className="mb-4">
              Please provide video details and select a file to upload.
            </p>

            <div className="mb-4">
              <label
                htmlFor="videoDescription"
                className="block text-sm font-medium text-gray-700"
              >
                Description
              </label>
              <textarea
                id="videoDescription"
                name="videoDescription"
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                placeholder="Enter video description"
                value={videoDescription}
                onChange={(e) => setVideoDescription(e.target.value)}
              ></textarea>
            </div>

            <div className="mb-4">
              <label
                htmlFor="uploadVideoFile"
                className="block text-sm font-medium text-gray-700"
              >
                Video File
              </label>
              <input
                type="file"
                id="uploadVideoFile"
                name="uploadVideoFile"
                accept="video/*"
                onChange={handleVideoUpload}
                className="mt-1 block w-full text-sm text-gray-500"
              />
            </div>

            <div className="flex justify-end">
              <button
                onClick={handleSubmit}
                disabled={isLoading}
                className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 transition duration-300 mr-2"
              >
                {isLoading ? "Uploading..." : "Submit"}
              </button>
              <button
                onClick={() => setShowPopup(false)}
                className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 transition duration-300"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
      <ToastContainer />
    </div>
  );
};

export default Dashboard;
