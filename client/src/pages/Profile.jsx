import { useSelector, useDispatch } from 'react-redux'
import { useEffect, useRef, useState } from 'react'
import { getDownloadURL, getStorage, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase'
import { Link } from 'react-router-dom'

import {
  updateUserStart,
  updateUserSuccess,
  updateUserFailure,
  deleteUserStart,
  deleteUserSuccess,
  deleteUserFailure,
  signOutUserStart,
  signOutUserSuccess,
  signOutUserFailure
} from '../redux/userSlice'



const Profile = () => {

  const fileRef = useRef();
  const { currentUser, loading, error } = useSelector((state) => state.user)
  const dispatch = useDispatch()

  const [file, setFile] = useState(undefined);

  const [filePercent, setFilePercent] = useState("");
  const [fileError, setFileError] = useState(false);

  const [formData, setFormData] = useState({});

  const [successfullyUpdated, setSuccessfullyUpdated] = useState(false);

  const [listError, setListError] = useState(false);

  const [listing, setListing] = useState([]);

  const [showListings, setShowListings] = useState(false);


  useEffect(() => {
    if (file) {
      handleFileUpload(file);
    }
  }, [file])

  const handleFileUpload = (file) => {
    const storage = getStorage(app)
    const fileName = new Date().getTime() + file.name
    const storageRef = ref(storage, fileName)
    const uploadTask = uploadBytesResumable(storageRef, file)

    uploadTask.on("state_changed",
      (snapshot) => {
        const progress = (snapshot.bytesTransferred / snapshot.totalBytes * 100);
        setFilePercent(Math.round(progress))
      },
      (error) => {
        setFileError(error)
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref)
          .then((downloadURL) => {
            setFormData({ ...formData, avatar: downloadURL })
          })
      }
    );
  }

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
  }

  const submitteHandler = async (e) => {
    e.preventDefault()

    try {
      dispatch(updateUserStart())
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          'Content-Type': 'application/json',
          credentials: 'include',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(updateUserFailure(data.message))
        return
      }
      dispatch(updateUserSuccess(data))
      setSuccessfullyUpdated(true)
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  const deleteUserHandler = async () => {
    try {
      dispatch(deleteUserStart())
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success === false) {
        dispatch(deleteUserFailure(data.message))
        return
      }
      dispatch(deleteUserSuccess(data))
    } catch (error) {
      dispatch(updateUserFailure(error.message))
    }
  }

  const signOutUserHandler = async () => {
    try {
      dispatch(signOutUserStart())
      const res = await fetch(`/api/auth/signout`, {
        credentials: 'include',
      })
      const data = await res.json()
      if (data.success === false) {
        return
      }
      dispatch(signOutUserSuccess())
    } catch (error) {
      dispatch(signOutUserFailure(error.message))
    }
  }

  const toggleListings = async () => {
    if (showListings) {
      setListError(false);
      setListing([]);
    } else {
      try {
        const res = await fetch(`/api/user/listings/${currentUser._id}`, {
          credentials: 'include',
        });
        const data = await res.json();
        if (data.success === false) {
          setListError(data.message);
          return;
        }
        if (data.length === 0) {
          setListError("You dont have list create to see!")
          return
        }
        setListing(data);
      } catch (error) {
        setListError("Something went wrong while loading the list");
      }
    }
    setShowListings(!showListings);
  };

  const deleteListing = async (id) => {
    try {
      const res = await fetch(`/api/listing/delete/${id}`, {
        method: "DELETE",
        credentials: 'include',
      });
      const data = await res.json();
      if (data.success === false) {
        setListError(data.message)
        return
      }
      setListing((prevListing) => prevListing.filter((list) => list._id !== id));
    } catch (error) {
      setListError("Something went wrong while deleting the list");
    }
  }

  return (
    <div className='p-2 max-w-lg mx-auto'>
      <h1 className='text-3xl font-semibold text-center my-7 '>Profile</h1>
      <form onSubmit={submitteHandler} className='flex flex-col gap-4'>

        <input
          onChange={(e) => setFile(e.target.files[0])}
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
        />

        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar ? `${formData.avatar}` : `${currentUser.avatar}`}
          alt="profile"
          className='rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 border-4 border-slate-700'
        />

        <p>
          {
            fileError ? (
              <span className='text-red-700 block text-center'>Error while uploading image</span>
            ) :
              filePercent > 0 && filePercent < 100 ? (
                <span className='text-slate-700 block text-center'>{`Uploading ${filePercent}%`}</span>
              ) :
                filePercent === 100 ? (
                  <span className='text-green-700 block text-center'>Image uploaded successfully!</span>
                ) : (
                  ""
                )
          }
        </p>

        <input
          type="text"
          placeholder='username'
          className='border p-3 rounded-lg'
          id='username'
          defaultValue={currentUser.username}
          onChange={handleChange}
        />

        <input
          type="email"
          placeholder='email'
          className='border p-3 rounded-lg'
          id='email'
          defaultValue={currentUser.email}
          onChange={handleChange}
        />

        <input
          type="password"
          placeholder='password'
          className='border p-3 rounded-lg'
          id='password'
          onChange={handleChange}
        />

        <button disabled={loading} className='bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 p-3'>
          {loading ? "Loading..." : "Update"}
        </button>
        <Link to="/create-listing" disabled={loading} className='bg-green-700 text-center text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-80 p-3'>
          Create Listing
        </Link>
      </form>

      <div className="flex justify-between mt-5">
        <span onClick={deleteUserHandler} className="text-red-700 cursor-pointer">Delete account</span>
        <span onClick={signOutUserHandler} className="text-red-700 cursor-pointer">Sign out</span>
      </div>

      {error && <p className='text-red-500 mt-5'>{error ? error : ""}</p>}
      {successfullyUpdated && <p className='text-green-500 mt-5'>Profile Updated successfully!</p>}

      <button onClick={toggleListings} className='text-center w-full text-green-400'>{showListings ? "Hide Listings" : "Show Listings"}</button>

      <p className='text-red-500 mt-5'>{listError ? listError : ""}</p>

      {
        showListings && listing.length > 0 && (
          listing.map((list) => (
            <div key={list._id} className="flex justify-between border border-solid my-3 p-3 bg-slate-200 gap-1">
              <Link to={`/listing/${list._id}`}>
                <img
                  src={list.imageUrls[0]}
                  alt="listing cover"
                  className='h-16 w-16 object-contain' />
              </Link>
              <Link to={`/listing/${list._id}`}>
                <p className='text-slate-600 truncate w-32 items-center'>{list.name}</p>
              </Link>
              <div className='flex flex-col gap-1'>
                <button onClick={() => deleteListing(list._id)} className='border border-red-600 hover:bg-red-500 hover:text-white  text-red-600 uppercase text-1xl rounded-lg py-1 px-2'>Delete</button>
                <Link to={`/update-listing/${list._id}`}>
                  <button className='border px-5 border-slate-400 text-slate-600 hover:bg-slate-500 hover:text-white uppercase text-1xl rounded-lg py-1'>Edit</button>
                </Link>
              </div>
            </div>
          ))
        )
      }
    </div>
  )
}

export default Profile
