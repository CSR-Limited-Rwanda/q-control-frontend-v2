import { useAuthentication } from "@/context/authContext";
import { Bell } from "lucide-react";
import { useRouter } from "next/navigation";
import { useState } from "react";

export const ProfileNotification = () => {
    const [showProfile, setShowProfile] = useState(false);
    const { logout } = useAuthentication();
    const router = useRouter();

    const handleShowProfile = () => {
        setShowProfile(!showProfile);
    };

    const handleLogout = () => {
        logout();
        router.push("/"); // Redirect to home or login page
    };

    return (
        <div className="header-popup">
            <div onClick={handleShowProfile} className="header-trigger">
                <div className="name-initials avatar">
                    <Bell />
                </div>
            </div>
            {showProfile && (
                <div className="header-content">
                    <div className="dropdown__label">Notifications</div>
                    <button className="dropdown__item">Profile</button>
                    <button className="dropdown__item">Settings</button>
                    <button onClick={handleLogout} className="dropdown__item">
                        Logout
                    </button>
                </div>
            )}
        </div>
    );
};