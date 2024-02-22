import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'

import { Swiper, SwiperSlide } from 'swiper/react'
import SwiperCore from "swiper"
import { Navigation } from 'swiper/modules'
import 'swiper/css/bundle'
import LIstingItem from '../components/LIstingItem';

const Home = () => {
  const [offerListing, setOfferListing] = useState([]);
  const [saleListing, setSaleListing] = useState([]);
  const [rentListing, setRentListing] = useState([]);

  //siwper
  SwiperCore.use([Navigation])


  useEffect(() => {
    const fetchOfferListing = async () => {
      try {
        const res = await fetch(`/api/listing/get/?offer=true&limit=4`, { credentials: 'include' })
        const data = await res.json()
        setOfferListing(data)
        fetchSaleListing()
      } catch (error) {
        console.log(error)
      }
    }
    const fetchSaleListing = async () => {
      try {
        const res = await fetch(`/api/listing/get/?type=sale&limit=4`, { credentials: 'include' })
        const data = await res.json()
        setSaleListing(data)
        fetchRentListing()
      } catch (error) {
        console.log(error)
      }
    }

    const fetchRentListing = async () => {
      try {
        const res = await fetch(`/api/listing/get/?type=rent&limit=4`, { credentials: 'include' })
        const data = await res.json()
        setRentListing(data)
      } catch (error) {
        console.log(error)
      }
    }
    fetchOfferListing()
  }, [])

  return (
    <div>
      {/* {top} */}
      <div className="flex flex-col gap-6 sm:p-16 p-20 px-3 max-w-6xl mx-auto">
        <h1 className='text-slate-700 font-bold text-3xl lg:text-6xl'>
          Find your next <span className='text-slate-500'>perfect</span>
          <br />
          place with ease
        </h1>
        <div className="text-gray-400 text-xs sm:text-sm">
          Savant Estate is the best place to find your next perfect place to live
          <br />
          We have wide range of properties for you to choose from.
        </div>
        <Link to={`/search`} className='text-xs sm:text-sm text-blue-700 font-bold hover:underline'>
          Lets get start...
        </Link>
      </div>

      {/* {swiper} */}
      {
        offerListing && offerListing.length > 0 &&
        <Swiper navigation>
          {
            offerListing.map((listing) => (
              <SwiperSlide key={listing._id}>
                <div
                  className="h-[550px] mt-1"
                  style={{ background: `url(${listing.imageUrls[0]}) center no-repeat`, backgroundSize: "cover" }}>
                </div>
              </SwiperSlide>
            ))
          }
        </Swiper>
      }

      {/* listings */}
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {
          offerListing && offerListing.length > 0 && (
            <div className="my-3">
              <div className="text-center">
                <h2 className='text-2xl font-semibold text-slate-700'>Resent Offer</h2>
                <Link to="search?offer=true" className='text-sm text-blue-500 hover:underline'>
                  Show more offers
                </Link>
              </div>
              <div className="p-0 sm:p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
                {
                  offerListing.map((list) => (
                    <LIstingItem listing={list} key={list._id} />
                  ))
                }
              </div>
            </div>
          )
        }
      </div>
      <hr />
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {
          saleListing && saleListing.length > 0 && (
            <div className="my-3">
              <div className="text-center">
                <h2 className='text-2xl font-semibold text-slate-700'>Resent Sale</h2>
                <Link to="search?type=sale" className='text-sm text-blue-500 hover:underline'>
                  Show more sale
                </Link>
              </div>
              <div className="p-0 sm:p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ">
                {
                  saleListing.map((list) => (
                    <LIstingItem listing={list} key={list._id} />
                  ))
                }
              </div>
            </div>
          )
        }
      </div>
      <hr />
      <div className="max-w-6xl mx-auto p-3 flex flex-col gap-8 my-10">
        {
          rentListing && rentListing.length > 0 && (
            <div className="my-3">
              <div className="text-center">
                <h2 className='text-2xl font-semibold text-slate-700'>Resent Rents</h2>
                <Link to="search?type=rent" className='text-sm text-blue-500 hover:underline'>
                  Show more Rents
                </Link>
              </div>
              <div className="p-0 sm:p-2 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 ms-auto">
                {
                  offerListing.map((list) => (
                    <LIstingItem listing={list} key={list._id} />
                  ))
                }
              </div>
            </div>
          )
        }
      </div>
      <hr />
      <p className='text-center pt-5'>Made with &#10083; by Pramod Savant</p>
      <p className='text-center pb-5'>&copy; All rights reserved</p>
    </div>
  )
}

export default Home
