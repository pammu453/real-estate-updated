import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import {
    FaBed,
    FaBath,
    FaParking,
    FaChair,
    FaTag,
    FaShare,
    FaMapMarker
} from "react-icons/fa";

//swiper
import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from "swiper"
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'

import { useSelector } from 'react-redux'
import Contact from './Contact';
;


const Listing = () => {
    const { id } = useParams();
    const [loading, setLoading] = useState(false);
    const [listing, setListing] = useState(null);
    const [error, setError] = useState();

    //siwper
    SwiperCore.use([Navigation])

    const [copied, setCopied] = useState(false);

    const { currentUser } = useSelector((state) => state.user)
    const [contact, setContact] = useState(false);


    useEffect(() => {
        const updateList = async () => {
            try {
                setLoading(true)
                const res = await fetch(`/api/listing/getListing/${id}`, { credentials: 'include' })
                const data = await res.json()
                if (data.success === false) {
                    setError(true)
                    setLoading(false)
                    return
                }
                setListing(data)
                setLoading(false)
                setError(false)
            } catch (error) {
                setLoading(false)
                setError(true)
            }
        }
        updateList()
    }, [id])

    return (
        <main>
            {loading && <p className='text-center my-7 text-2xl text-green-500'>Loading...</p>}
            {error && <p className='text-center my-7 text-2xl text-red-500'>Oops! Something went wrong...</p>}

            {/*Swiper */}
            {listing && !loading && !error && (
                <>
                    <Swiper navigation>
                        {
                            listing.imageUrls.map((img) => (
                                <SwiperSlide key={img}>
                                    <div
                                        className="h-[550px] mt-1"
                                        style={{ background: `url(${img}) center no-repeat`, backgroundSize: "cover" }}>
                                    </div>
                                </SwiperSlide>
                            ))
                        }
                    </Swiper>

                    {/* copy to clipboard */}
                    <div onClick={() => {
                        navigator.clipboard.writeText(window.location.href)
                        setCopied(true)
                        setTimeout(() => {
                            setCopied(false)
                        }, 2000);
                    }} className='fixed top-[13%] right-[3%] z-10 border rounded-full w-12 h-12 flex justify-center items-center bg-slate-100 cursor-pointer text-slate-500' >
                        <FaShare />
                    </div>
                    {copied && (
                        <p className='fixed top-[23%] right-[5%] z-10 rounded-md bg-slate-100 p-2'>
                            Link copied!
                        </p>
                    )}

                    <div className='flex flex-col max-w-4xl mx-auto p-3 my-7 gap-4'>
                        <div className='flex flex-wrap gap-2 items-center'>
                            <p className='text-2xl font-semibold'>
                                {listing.name} -
                            </p>
                            <p className='text-xl text-slate-400  font-semibold line-through'>
                                ${listing.regularPrice}
                            </p>
                            <p className='flex items-center gap-1 text-green-600 text-xl font-semibold'>
                                {
                                    listing.offer ? (
                                        <span>${listing.regularPrice - listing.discountPrice} </span>
                                    ) : (
                                        <span>${listing.regularPrice} </span>
                                    )
                                }
                                <span>{listing.type === 'rent' ? ' / month' : ""}<FaTag className='inline ' /></span>
                            </p>
                        </div>
                        <p className='flex items-center mt-6 gap-2 text-slate-600  text-sm'>
                            <FaMapMarker />
                            {listing.address}
                        </p>
                        <div className='flex gap-4'>
                            <p className='bg-red-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                {listing.type === 'rent' ? 'For Rent' : 'For Sale'}
                            </p>
                            <p className='bg-green-900 w-full max-w-[200px] text-white text-center p-1 rounded-md'>
                                {
                                    listing.offer ? `$ ${listing.discountPrice} OFF` : "$0 OFF"
                                }
                            </p>
                        </div>
                        <p className='text-slate-800'>
                            <span className='font-semibold text-black'>Description - </span>
                            {listing.description}
                        </p>
                        <ul className='text-green-900 font-semibold text-sm flex flex-wrap items-center gap-4 sm:gap-6'>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaBed className='text-lg' />
                                {listing.bedrooms > 1
                                    ? `${listing.bedrooms} beds `
                                    : `${listing.bedrooms} bed `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaBath className='text-lg' />
                                {listing.bathrooms > 1
                                    ? `${listing.bathrooms} baths `
                                    : `${listing.bathrooms} bath `}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaParking className='text-lg' />
                                {listing.parking ? 'Parking spot' : 'No Parking'}
                            </li>
                            <li className='flex items-center gap-1 whitespace-nowrap '>
                                <FaChair className='text-lg' />
                                {listing.furnished ? 'Furnished' : 'Unfurnished'}
                            </li>
                        </ul>
                        {
                            currentUser && listing.userRef !== currentUser._id && !contact && (
                                <button onClick={() => setContact(true)} className='bg-slate-600 uppercase text-white hover:opacity-80 p-3 rounded-lg'>Contact landlord</button>
                            )
                        }
                        {
                            contact && <Contact listing={listing} />
                        }
                    </div>
                </>
            )}
        </main >
    )
}

export default Listing
