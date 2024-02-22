import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom';

const Contact = ({ listing }) => {
    const [landLord, setLandLord] = useState(false);
    const [message, setmessage] = useState("");

    useEffect(() => {
        const fetchLandLord = async () => {
            try {
                const res = await fetch(`/api/user/${listing.userRef}`, { credentials: 'include', })
                const data = await res.json()
                if (data.success === false) {
                    console.log(data.message)
                    return
                }
                setLandLord(data)
            } catch (error) {
                console.log(error)
            }
        }
        fetchLandLord()
    }, [listing.userRef])

    return (
        <>
            {
                landLord && (
                    <div className="m-2">
                        <p>Contact : <span className='font-bold'>{landLord.username}</span> for <span className='font-semibold'>{listing.name}</span></p>
                        <textarea
                            className='w-full mb-5  border p-2 rounded-lg'
                            name='message'
                            id='message'
                            rows={2}
                            value={message}
                            onChange={(e) => setmessage(e.target.value)}
                            placeholder='Enter your message'></textarea>
                        <Link
                            className='bg-slate-500  text-center p-3 uppercase rounded-lg hover:opacity-90 text-white'
                            to={`mailto:${landLord.email}?subject=Regarding ${listing.name}&body=${message}`}>
                            Send message
                        </Link>
                    </div>
                )
            }
        </>
    )
}

export default Contact
