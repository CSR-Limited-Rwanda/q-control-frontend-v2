'use client';
import { ChevronDown } from "lucide-react";
import { usePathname } from "next/navigation";
import { useState } from "react";

export const MenuItem = ({ item, index }) => {
    const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(false);
    const [activeDropdown, setActiveDropdown] = useState(null);
    const [hoveredDropdown, setHoveredDropdown] = useState(null);
    const pathname = usePathname();

    const hasDropdown = item.items?.length > 0;

    const normalizePath = (path) => path.replace(/\/+$/, "");
    const currentPath = normalizePath(pathname);

    // Use matchPaths if defined, otherwise fall back to href
    const matchPaths = item.matchPaths || [item.href];

    const isActive = matchPaths.some(
        (matchPath) =>
            currentPath === normalizePath(matchPath) ||
            currentPath.startsWith(`${normalizePath(matchPath)}/`)
    );

    const isDropdownOpen = !isSidebarCollapsed &&
        (activeDropdown === index ||
            (hasDropdown &&
                item.items.some((subItem) =>
                    currentPath.startsWith(normalizePath(subItem.href))
                )));

    const isHovered = isSidebarCollapsed && hoveredDropdown === index;

    const handleClick = (e) => {
        if (hasDropdown) {
            e.preventDefault();
            if (!isSidebarCollapsed) {
                toggleDropdown(index);
            }
        }
    };

    const handleMouseLeave = () => {
        if (isSidebarCollapsed) {
            setHoveredDropdown(null);
        }
    };
    const handleMouseEnter = (index) => {
        if (isSidebarCollapsed) {
            setHoveredDropdown(index);
        }
    };

    const toggleDropdown = (index) => {
        setActiveDropdown(activeDropdown === index ? null : index);
    };


    return (
        <div
            className="menu-item-container"
            onMouseEnter={() => handleMouseEnter(index)}
            onMouseLeave={handleMouseLeave}
        >
            <a
                href={!hasDropdown ? item.href : "#"}
                className={`menu-item ${isActive ? "active" : ""}`}
                onClick={handleClick}
            >
                <span className="menu-item-icon">{item.icon}</span>
                {!isSidebarCollapsed && (
                    <>
                        <span className="menu-item-label">{item.label}</span>
                        {hasDropdown && (
                            <ChevronDown
                                size={22}
                                className={`menu-item-arrow ${isDropdownOpen ? "rotate" : ""}`}
                            />
                        )}
                    </>
                )}
            </a>

            {/* Dropdown for expanded sidebar */}
            {hasDropdown && !isSidebarCollapsed && isDropdownOpen && (
                <div className="menu-dropdown">
                    {item.items.map((subItem, subIndex) => {
                        const isSubActive = currentPath === normalizePath(subItem.href);
                        return (
                            <a
                                key={subIndex}
                                href={subItem.href}
                                className={`menu-dropdown-item ${isSubActive ? "active" : ""}`}
                            >
                                {subItem.label}
                            </a>
                        );
                    })}
                </div>
            )}

            {/* Tooltip dropdown for collapsed sidebar */}
            {hasDropdown && isSidebarCollapsed && isHovered && (
                <div className="menu-tooltip-dropdown">
                    <div className="tooltip-header">{item.label}</div>
                    {item.items.map((subItem, subIndex) => {
                        const isSubActive = currentPath === normalizePath(subItem.href);
                        return (
                            <a
                                key={subIndex}
                                href={subItem.href}
                                className={`tooltip-dropdown-item ${isSubActive ? "active" : ""}`}
                            >
                                {subItem.label}
                            </a>
                        );
                    })}
                </div>
            )}
        </div>
    );
};