import { splitName } from '@/utils/text'
import React from 'react'

const ProfilePlaceHolder = ({ fullName }) => {
    return (
        <div className='placeholder'><h4>{splitName(fullName)}</h4></div>
    )
}

export default ProfilePlaceHolder