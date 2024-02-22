import { Link } from 'react-router-dom';
import { FaBath, FaBed, FaLocationArrow, FaTags } from 'react-icons/fa';
import TextTruncate from 'react-text-truncate';

const LIstingItem = ({ listing }) => {
    return (
        <div className='flex'>
            <div className="bg-white shadow-xl m-2 hover:shadow-2xl overflow-hidden transition-shadow rounded-lg w-full sm:w-[330px] md:w-[250px] lg:w-[300px]">
                <Link to={`/listing/${listing._id}`}>
                    <img src={listing.imageUrls[0]} alt='listing cover' className='h-[320px] sm:h-[220px] md:h-[250px] lg:h-[300px] w-full object-cover hover:scale-105 transition-scale duration-500' />
                    <div className="p-3 flex flex-col gap-2 w-full">
                        <div className='truncate text-lg font-semibold text-slate-700 '>{listing.name}</div>
                        <div className="flex items-center gap-2 ">
                            <FaLocationArrow className='text-green-700' />
                            <div className='truncate'>{listing.address}</div>
                        </div>
                        <TextTruncate
                            line={2}
                            element="span"
                            truncateText="…"
                            text={listing.description}
                        />
                        <div className='flex items-center gap-2'>
                            {listing.type === "rent" ? (
                                <>
                                    <div>${listing.regularPrice} / month</div>
                                    <FaTags />
                                    <span className='bg-green-500 px-1 rounded-lg'>Rent</span>
                                </>
                            ) : (
                                <>
                                    <div>${listing.regularPrice}</div>
                                    <FaTags />
                                    <span className='bg-green-500 px-1 rounded-lg'>Sale</span>
                                </>
                            )}
                        </div>
                        <div className='flex gap-3'>
                            <div className='flex items-center gap-1'>
                                <div>{listing.bedrooms}</div>
                                <FaBed />
                            </div>
                            <div className='flex items-center gap-1'>
                                <div>{listing.bathrooms}</div>
                                <FaBath />
                            </div>
                        </div>
                    </div>
                </Link>
            </div>
        </div>
    );
};

export default LIstingItem;
