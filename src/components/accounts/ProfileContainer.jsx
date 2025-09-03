"use client";

import { useEffect, useState, useRef } from "react";
import UserCard from "../UserCard";
import { ListTodo, Lock, LogOut, Settings, User } from "lucide-react";
import { useAuthentication } from "@/context/authContext";
import { useRouter } from "next/navigation";
import { splitName } from "@/utils/text";

export const ProfileContainer = () => {
  const [showProfile, setShowProfile] = useState(false);
  const { isAuth, logout, user } = useAuthentication();
  const router = useRouter();
  const dropdownRef = useRef(null);

  // Handle click outside to close dropdown
  const handleClickOutside = (event) => {
    if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
      setShowProfile(false);
    }
  };

  // Add and clean up event listener
  useEffect(() => {
    if (showProfile) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [showProfile]);

  const goToProfile = () => {
    router.push(`/accounts/${user.profileId}`);
    setShowProfile(false); // Close dropdown after navigation
  };

  const goToTasks = () => {
    router.push(`/accounts/${user.profileId}/tasks`);
    setShowProfile(false); // Close dropdown after navigation
  };

  const handleShowProfile = () => {
    setShowProfile(!showProfile);
  };

  const handleLogout = () => {
    logout();
    router.push("/");
    setShowProfile(false); // Close dropdown after logout
  };

  return (
    <div className="header-popup">
      <div onClick={handleShowProfile} className="header-trigger">
        <div className="name-initials avatar">
          <span>
            {splitName(
              `${user?.first_name || user?.firstName} ${
                user?.last_name || user?.lastName
              }`
            )}
          </span>
        </div>
      </div>
      {showProfile && (
        <div className="header-content" ref={dropdownRef}>
          <div className="dropdown__item">
            <div className="card">
              <UserCard
                firstName={user?.first_name || user?.firstName}
                lastName={user?.last_name || user?.lastName}
                label={user?.email}
              />
            </div>
          </div>
          <div onClick={goToProfile} className="dropdown__item">
            <User size={18} />
            <span>My Account</span>
          </div>
          <hr />
          <div className="dropdown__item" onClick={goToTasks}>
            <ListTodo />
            <span>My Tasks</span>
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
