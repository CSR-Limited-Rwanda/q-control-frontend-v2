import Image from 'next/image'
import React from 'react'
import ProfilePlaceHolder from './ProfilePlaceHolder'

const UserCard = ({ profileUrl, firstName, lastName, label }) => {
    return (
        <div className='user-card'>
            <div className="profile">
                {
                    profileUrl ?
                        <Image src={profileUrl || '/logo.svg'} alt='profile' width={42} height={42} />
                        : <ProfilePlaceHolder fullName={`${firstName} ${lastName}`} />
                }
            </div>
            <div className="info">
                <p className="name">
                    {firstName} {lastName}
                </p>
                <small className="label">
                    {label}
                </small>
            </div>
        </div>
    )
}

export default UserCard