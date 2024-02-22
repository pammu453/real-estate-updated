import React from 'react'
import { GoogleAuthProvider, getAuth, signInWithPopup } from 'firebase/auth'
import { app } from '../firebase'

import { useDispatch } from 'react-redux'
import { signInSuccess } from '../redux/userSlice'

import { useNavigate } from 'react-router-dom'


const OAuth = () => {

    const dispatch = useDispatch()
    const navigate = useNavigate()

    const handleGoogleClick = async () => {
        try {
            const provider = new GoogleAuthProvider(app)
            const auth = getAuth()

            const result = await signInWithPopup(auth, provider)

            const res = await fetch(`/api/auth/google`, {
                method: "POST",
                headers: {
                    "Content-Type": 'application/json',
                },
                credentials: 'include',
                body: JSON.stringify({ name: result.user.displayName, email: result.user.email, photo: result.user.photoURL })
            })
            const data = await res.json()

            dispatch(signInSuccess(data))
            navigate("/")
        } catch (error) {
            console.log('could not sign in with google', error)
        }
    }
    return (
        <button onClick={handleGoogleClick} type='button' className='bg-red-700 text-center text-white p-2 rounded-lg uppercase hover:opacity-80 disabled:opacity-80'>
            Continue with google
        </button>
    )
}

export default OAuth
