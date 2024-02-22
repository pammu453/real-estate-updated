import { useEffect, useState } from 'react'
import { getStorage, getDownloadURL, ref, uploadBytesResumable } from 'firebase/storage'
import { app } from '../firebase';
import { useSelector } from 'react-redux'
import { useNavigate, useParams } from "react-router-dom"
    ;

const UpdateListings = () => {
    const [files, setfiles] = useState([]);

    const { id } = useParams()

    const [formData, setFormData] = useState({
        imageUrls: [],
        name: '',
        description: "",
        address: "",
        type: "rent",
        bathrooms: 1,
        bedrooms: 1,
        regularPrice: 50,
        discountPrice: 0,
        offer: false,
        parking: false,
        furnished: false
    });

    const [imageUploadError, setImageUploadError] = useState(false);
    const [uploading, setUploading] = useState(false);

    const [listError, setListError] = useState(false);
    const [createListingLoding, setCreateListingLoding] = useState(false);

    const { currentUser } = useSelector((state) => state.user)

    const navigate = useNavigate()

    const [loading, setLoading] = useState(false);


    useEffect(() => {
        const updateList = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/listing/getListing/${id}`, { credentials: 'include', })
                const data = await res.json()
                if (data.success === false) {
                    setListError(data.message)
                    return
                }
                setFormData(data)
                setLoading(false)
            } catch (error) {
                console.log(error)
            }
        }
        updateList()
    }, [])

    const handleImagesubbmit = () => {

        if (files.length > 0 && files.length + formData.imageUrls.length < 7) {
            setUploading(true)
            setImageUploadError(false)
            const promises = [];
            for (let i = 0; i < files.length; i++) {
                promises.push(storeImage(files[i]));
            }
            Promise.all(promises)
                .then((urls) => {
                    setFormData({ ...formData, imageUrls: formData.imageUrls.concat(urls) });
                    setImageUploadError(false)
                    setUploading(false)
                })
                .catch((error) => {
                    setImageUploadError("Image upload failed (2mb per images)")
                    setUploading(false)
                });
        } else if (files.length + formData.imageUrls.length === 0) {
            setImageUploadError("You have to upload atleast one image")
            setUploading(false)
        } else {
            setImageUploadError("You can upload max 6 images")
            setUploading(false)
        }
    }


    const storeImage = async (file) => {
        return new Promise((resolve, reject) => {
            const storage = getStorage(app)
            const fileName = new Date().getTime() + file.name
            const storageRef = ref(storage, fileName)
            const uploadTask = uploadBytesResumable(storageRef, file)

            uploadTask.on("state_changed",
                (snapshot) => {
                },
                (error) => {
                    reject(error)
                },
                () => {
                    getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
                        resolve(downloadURL)
                    })
                }
            );
        })
    }

    const deleteImage = (url) => {
        setFormData({
            ...formData,
            imageUrls: formData.imageUrls.filter((imgUrl) => imgUrl !== url)
        })
    }


    const handleChange = (e) => {
        if (e.target.id === "sale" || e.target.id === "rent") {
            setFormData({
                ...formData,
                type: e.target.id
            })
        }

        if (e.target.id === "parking" || e.target.id === "furnished" || e.target.id === "offer") {
            setFormData({
                ...formData,
                [e.target.id]: e.target.checked
            })
        }

        if (e.target.type === "text" || e.target.type === "textarea") {
            setFormData({
                ...formData,
                [e.target.id]: e.target.value
            })
        }
        if (e.target.type === "number") {
            const numericValue = Number(e.target.value);
            if (!isNaN(numericValue)) {
                setFormData({
                    ...formData,
                    [e.target.id]: numericValue
                });
            }
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        try {
            if (formData.imageUrls.length === 0) return setListError("You have to upload atleast one image")
            if (formData.regularPrice < formData.discountPrice) return setListError("Discount prise must be less than regular price")

            setCreateListingLoding(true)
            setListError(false)
            const data = await fetch(`/api/listing/update/${id}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json',
                    credentials: 'include',
                },
                body: JSON.stringify({
                    ...formData,
                    userRef: currentUser._id
                }),
                credentials: 'include',
            })
            const response = await data.json();
            setCreateListingLoding(false)
            if (response.success === false) {
                setListError(response.message)
                return
            }
            navigate(`/listing/${response._id}`)
        } catch (error) {
            setListError("Something went wrong!")
        }
    }

    return (
        <div>
            <main className='p-3 max-w-4xl mx-auto'>
                <h1 className='text-3xl font-semibold text-center my-7'>Update a Listing</h1>

                <h1 className='text-1xl text-green-600 font-semibold text-center my-7'>{loading ? "Fetching data..." : ""}</h1>
                <form onSubmit={handleSubmit} className='flex flex-col sm:flex-row gap-4'>
                    <div className='flex flex-col gap-4 flex-1'>
                        <input
                            type="text"
                            placeholder='name'
                            className='border p-3 rounded-lg'
                            id='name'
                            maxLength={63}
                            minLength={10}
                            required
                            onChange={handleChange}
                            value={formData.name} />

                        <textarea
                            type="text"
                            placeholder='description'
                            className='border p-3 rounded-lg'
                            id='description'
                            required
                            onChange={handleChange}
                            value={formData.description} />

                        <input
                            type="text"
                            placeholder='address'
                            className='border p-3 rounded-lg'
                            id='address'
                            required
                            onChange={handleChange}
                            value={formData.address} />

                        <div className="flex gap-6 flex-wrap">
                            <div className="flex gap-2">
                                <input
                                    type="checkbox"
                                    id="sale"
                                    className='w-5 '
                                    onChange={handleChange}
                                    checked={formData.type === "sale"} />
                                <span>Sell</span>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="checkbox"
                                    id="rent"
                                    className='w-5 '
                                    onChange={handleChange}
                                    checked={formData.type === "rent"} />
                                <span>Rent</span>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="checkbox"
                                    id="parking"
                                    className='w-5 '
                                    onChange={handleChange}
                                    checked={formData.parking} />
                                <span>Parking spot</span>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="checkbox"
                                    id="furnished"
                                    className='w-5 '
                                    onChange={handleChange}
                                    checked={formData.furnished} />
                                <span>Furnished</span>
                            </div>
                            <div className="flex gap-2">
                                <input
                                    type="checkbox"
                                    id="offer"
                                    className='w-5 '
                                    onChange={handleChange}
                                    checked={formData.offer} />
                                <span>Offer</span>
                            </div>
                            <div className='flex flex-wrap  gap-6'>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        id="bedrooms"
                                        min={1}
                                        max={10}
                                        className='p-3 border border-gray-300 rounded-lg'
                                        required
                                        onChange={handleChange}
                                        value={formData.bedrooms} />
                                    <span>Bedrooms</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        id="bathrooms"
                                        min={1}
                                        max={10}
                                        className='p-3 md:ml-5 border border-gray-300 rounded-lg'
                                        required
                                        onChange={handleChange}
                                        value={formData.bathrooms} />
                                    <span>Bathrooms</span>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="number"
                                        id="regularPrice"
                                        min={50}
                                        max={100000}
                                        className='p-3 border border-gray-300 rounded-lg'
                                        required
                                        onChange={handleChange}
                                        value={formData.regularPrice} />
                                    <div className="flex flex-col items-center">
                                        <p>Regular Price</p>
                                        {formData.type == "rent" && <span className='text-sm'>($ / month)</span>}
                                    </div>
                                </div>
                                {
                                    formData.offer && (
                                        <div className="flex items-center gap-2">
                                            <input
                                                type="number"
                                                id="discountPrice"
                                                min={0}
                                                max={100000}
                                                className='p-3 border border-gray-300 rounded-lg'
                                                required
                                                onChange={handleChange}
                                                value={formData.discountPrice} />
                                            <div className="flex flex-col items-center">
                                                <p>Discount Price</p>
                                                {formData.type == "rent" && <span className='text-sm'>($ / month)</span>}
                                            </div>
                                        </div>
                                    )
                                }
                            </div>
                        </div>
                    </div>
                    <div className="flex flex-col flex-1 gap-2">
                        <p className='font-semibold'>Images:
                            <span className='font-normal text-gray-700 ml-2'>The first image will be cover (max 6)</span>
                        </p>
                        <div className="flex gap-4">
                            <input
                                onChange={(e) => setfiles(e.target.files)}
                                className='p-3 border border-gray-300 rounded w-full'
                                type="file"
                                id="images"
                                accept='image/*'
                                multiple
                            />
                            <button
                                type='button'
                                onClick={handleImagesubbmit}
                                className='p-3 text-white bg-green-600 border rounded hover:shadow-lg disabled:opacity-80'>
                                {uploading ? "Uploading..." : "Upload"}
                            </button>
                        </div>
                        <p className='text-red-500'>{imageUploadError && imageUploadError}</p>

                        <div className="max-h-72 overflow-y-scroll">
                            {formData.imageUrls.length > 0 &&
                                formData.imageUrls.map((url) => (
                                    <div key={url} className="flex justify-between p-3 border items-center">
                                        <img src={url} alt="listing image" className="w-20 h-20 object-contain rounded-lg" />
                                        <button
                                            onClick={() => deleteImage(url)}
                                            type="button"
                                            className="p-2 text-white bg-red-500 rounded-lg hover:opacity-80">
                                            Delete
                                        </button>
                                    </div>
                                ))
                            }
                        </div>
                        <button
                            className='text-center mt-3 p-3 bg-slate-700 text-white rounded-lg uppercase hover:opacity-95 disabled:opacity-90'
                            disabled={createListingLoding || uploading}>
                            {createListingLoding ? "Updating list.." : "Update List"}
                        </button>
                        {listError && <p className='text-sm text-red-600'>{listError}</p>}
                    </div>
                </form>
            </main>
        </div>
    )
}

export default UpdateListings