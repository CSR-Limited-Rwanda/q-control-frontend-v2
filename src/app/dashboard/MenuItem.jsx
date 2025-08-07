'use client';
import { ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import { use, useEffect, useState } from "react";

export const MenuItem = ({ item, index }) => {
    const router = useRouter();
    const [currentPage, setCurrentPage] = useState(localStorage.getItem("currentPath") || "/");

    const handleClick = () => {
        if (item.href) {
            setCurrentPage(item.href);
            localStorage.setItem("currentPath", item.href);
            router.push(item.href);
        }
    };

    useEffect(() => {
        const currentPath = localStorage.getItem("currentPath");
        if (currentPath) {
            setCurrentPage(currentPath);
        }
    }, []);
    return (
        <div className={`menu-item ${currentPage === item.href ? "active" : ""}`} onClick={handleClick}>
            {item.icon}
            <span>{item.label}</span>
        </div>
    )
};