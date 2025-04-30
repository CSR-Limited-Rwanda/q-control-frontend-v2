import React, { useEffect, useState } from 'react';
import '@/styles/_dashboard.scss';
import '@/styles/_components.scss';
import {
    Search,
    Bell,
    Mail,
    Menu,
    ChevronLeft,
    ChevronRight,
    ChevronDown,
    X,
    Users,
    ShoppingCart,
    User,
    Lock,
    Settings,
    LogOut,
} from 'lucide-react';
import { splitName } from '@/utils/text';
import LoginPopup from '@/components/auth/Login';
import { useAuthentication } from '@/context/authContext';
import Image from 'next/image';
import UserCard from '@/components/UserCard';

const DashboardLayout = ({ children }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [showMobileMenu, setShowMobileMenu] = useState(false);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const { isAuth, logout } = useAuthentication()

    const handleMobileMenu = () => {
        setShowMobileMenu(!showMobileMenu);
    }
    const menuItems = [
        // {
        //     icon: <LayoutDashboard size={20} />,
        //     label: 'Dashboard',
        //     href: '#'
        // },
        // {
        //     icon: <ShoppingCart size={20} />,
        //     label: 'E-commerce',
        //     items: [
        //         { label: 'Products', href: '#' },
        //         { label: 'Orders', href: '#' },
        //         { label: 'Customers', href: '#' }
        //     ]
        // },
        {
            icon: <Users size={20} />,
            label: 'Account Management',
            href: '/accounts'
        },
        // {
        //     icon: <Boxes size={20} />,
        //     label: 'Inventory',
        //     items: [
        //         { label: 'Stock', href: '#' },
        //         { label: 'Categories', href: '#' },
        //         { label: 'Suppliers', href: '#' }
        //     ]
        // },
        // {
        //     icon: <BadgePercent size={20} />,
        //     label: 'Sales',
        //     href: '#'
        // },
        // {
        //     icon: <Settings size={20} />,
        //     label: 'Settings',
        //     href: '#'
        // },
    ];

    const toggleDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };

    const MenuItem = ({ item, index }) => {
        const hasDropdown = item.items?.length > 0;
        const isActive = activeDropdown === index;

        return (
            <div className="menu-item-container">
                <a
                    href={!hasDropdown ? item.href : '#'}
                    className={`menu-item ${isActive ? 'active' : ''}`}
                    onClick={(e) => {
                        if (hasDropdown) {
                            e.preventDefault();
                            toggleDropdown(index);
                        }
                    }}
                >
                    <span className="menu-item-icon">{item.icon}</span>
                    {!isSidebarCollapsed && (
                        <>
                            <span className="menu-item-label">{item.label}</span>
                            {hasDropdown && (
                                <ChevronDown
                                    size={16}
                                    className={`menu-item-arrow ${isActive ? 'rotate' : ''}`}
                                />
                            )}
                        </>
                    )}
                </a>
                {hasDropdown && !isSidebarCollapsed && isActive && (
                    <div className="menu-dropdown">
                        {item.items.map((subItem, subIndex) => (
                            <a
                                key={subIndex}
                                href={subItem.href}
                                className="menu-dropdown-item"
                            >
                                {subItem.label}
                            </a>
                        ))}
                    </div>
                )}
            </div>
        );
    };

    useEffect(() => {
    })
    return (
        isAuth ?
            <div className="dashboard">
                {/* Sidebar */}
                <aside className={`dashboard__sidebar ${isSidebarCollapsed ? 'collapsed' : ''} ${showMobileMenu ? 'mobile-open' : ''}`}>
                    <div className="dashboard__logo">
                        <Image src={'/logo.svg'} width={52} height={32} alt='logo' />
                        {!isSidebarCollapsed && <span>Quality control</span>}
                        <X onClick={handleMobileMenu} className='close-mobile' />
                    </div>
                    <nav className="dashboard__sidebar-nav">
                        {menuItems.map((item, index) => (
                            <MenuItem key={index} item={item} index={index} />
                        ))}
                    </nav>
                </aside>

                {/* Main Content Area */}
                <main className={`dashboard__main ${isSidebarCollapsed ? 'sidebar-collapsed' : ''}`}>
                    {/* Header */}
                    <header className="dashboard__header">
                        <div className="dashboard__header-container">
                            <div className="dashboard__header-left">
                                <div
                                    className="sidebar-toggle"
                                    onClick={() => setIsSidebarCollapsed(!isSidebarCollapsed)}
                                >
                                    {isSidebarCollapsed ? (
                                        <ChevronRight size={20} />
                                    ) : (
                                        <ChevronLeft size={20} />
                                    )}
                                </div>

                                <Menu onClick={handleMobileMenu} size={32} className='mobile-menu' />

                                {/* <div className="input__wrapper dashboard__header-search">
                                    <Search className="input__icon input__icon--left" />
                                    <input
                                        type="text"
                                        placeholder="Search..."
                                        className="input__field"
                                    />
                                </div> */}
                            </div>

                            <div className="dashboard__header-actions">
                                {/* <ProfileMessages /> */}
                                {/* <ProfileNotification /> */}
                                <ProfileContainer />
                            </div>
                        </div>
                    </header>

                    {/* Page Content */}
                    <div className="dashboard__content">
                        {children}
                        <div className='copy'>
                            <small>Made with love by guys at CSR</small>
                        </div>
                    </div>
                </main>
            </div>
            : <LoginPopup />
    );
};

export default DashboardLayout;

export const ProfileContainer = () => {
    const [showProfile, setShowProfile] = useState(false)
    const { isAuth, logout, user } = useAuthentication()
    const handleShowProfile = () => {
        setShowProfile(!showProfile)
    }

    return (
        <div className="header-popup">
            <div onClick={handleShowProfile} className="header-trigger">
                <div className="name-initials avatar">
                    <span>{splitName(`${user?.firstName} ${user?.lastName}`)}</span>
                </div>
            </div>
            {
                showProfile &&
                <div className="header-content">
                    <div className="dropdown__item">
                        <div className="card">
                            <UserCard firstName={user.firstName} lastName={user.lastName} label={user.email} />
                        </div>
                    </div>
                    <div className="dropdown__item">
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
                    <div onClick={logout} className="dropdown__item">
                        <LogOut size={18} />
                        <span>Logout</span>
                    </div>
                </div>
            }
        </div>
    )
}
export const ProfileNotification = () => {
    const [showProfile, setShowProfile] = useState(false)

    const handleShowProfile = () => {
        setShowProfile(!showProfile)
    }

    return (
        <div className="header-popup">
            <div onClick={handleShowProfile} className="header-trigger">
                <div className="name-initials avatar">
                    <Bell />
                </div>
            </div>
            {
                showProfile &&
                <div className="header-content">
                    <div className="dropdown__label">Notifications</div>
                    <button className="dropdown__item">Profile</button>
                    <button className="dropdown__item">Settings</button>
                    <button onClick={handleLogout} className="dropdown__item">Logout</button>
                </div>
            }
        </div>
    )
}
export const ProfileMessages = () => {
    const [showProfile, setShowProfile] = useState(false)

    const handleShowProfile = () => {
        setShowProfile(!showProfile)
    }

    return (
        <div className="header-popup">
            <div onClick={handleShowProfile} className="header-trigger">
                <div className="name-initials avatar">
                    <Mail />
                </div>
            </div>
            {
                showProfile &&
                <div className="header-content">
                    <div className="dropdown__label">Messages</div>
                    <button className="dropdown__item">Profile</button>
                    <button className="dropdown__item">Settings</button>
                    <button onClick={handleLogout} className="dropdown__item">Logout</button>
                </div>
            }
        </div>
    )
}