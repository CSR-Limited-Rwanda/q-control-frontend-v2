'use client';

import { useEffect, useState } from "react";
import UserCard from "../UserCard";
import { Lock, LogOut, Settings, User } from "lucide-react";
import { useAuthentication } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { splitName } from "@/utils/text";

export const ProfileContainer = () => {
    const [showProfile, setShowProfile] = useState(false);
    const { isAuth, logout, user } = useAuthentication();
    const router = useRouter();
    const [userProfile, setUserProfile] = useState({});

    useEffect(() => {
        if (typeof window !== "undefined") {
            const storedProfile = localStorage.getItem("loggedInUserInfo");
            if (storedProfile) {
                setUserProfile(JSON.parse(storedProfile));
            }
        }
    }, []);

    const goToProfile = () => {
        router.push(`/accounts/${user.profileId}`);
    };

    const handleShowProfile = () => {
        setShowProfile(!showProfile);
    };

    const handleLogout = () => {
        logout();
        router.push("/");
    };

    // Use auth context user data as fallback, or localStorage data
    const displayUser = userProfile?.first_name ? userProfile : user;

    return (
        <div className="header-popup">
            <div onClick={handleShowProfile} className="header-trigger">
                <div className="name-initials avatar">
                    <span>
                        {splitName(
                            `${displayUser?.first_name || displayUser?.firstName} ${displayUser?.last_name || displayUser?.lastName}`
                        )}
                    </span>
                </div>
            </div>
            {showProfile && (
                <div className="header-content">
                    <div className="dropdown__item">
                        <div className="card">
                            <UserCard
                                firstName={displayUser?.first_name || displayUser?.firstName}
                                lastName={displayUser?.last_name || displayUser?.lastName}
                                label={displayUser?.email}
                            />
                        </div>
                    </div>
                    <div onClick={goToProfile} className="dropdown__item">
                        <User size={18} />
                        <span>My Account</span>
                    </div>
                    <hr />
                    <div className="dropdown__item">
                        <Lock size={18} />
                        <span>Admin</span>
                    </div>
                    <hr />
                    <div className="dropdown__item">
                        <Settings size={18} />
                        <span>Settings</span>
                    </div>
                    <hr />
                    <div onClick={handleLogout} className="dropdown__item">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </div>
                </div>
            )}
        </div>
    );
};