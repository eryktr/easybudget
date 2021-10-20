
import {React, useEffect} from 'react'
import { useHistory } from 'react-router-dom'

export default function Logout({setUser}) {
    const history = useHistory();
    useEffect(() => {
        localStorage.removeItem('accessToken'); 
        setUser(undefined);
        history.push('/')
    })
    return (
        <div>
            Hello world
        </div>
    )
}