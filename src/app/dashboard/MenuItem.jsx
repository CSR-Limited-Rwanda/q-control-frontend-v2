// "use client";
// import { ChevronDown } from "lucide-react";
// import { usePathname, useRouter } from "next/navigation";
// import { use, useEffect, useState } from "react";

// export const MenuItem = ({ item, index }) => {
//   const router = useRouter();
//   const [currentPage, setCurrentPage] = useState(
//     localStorage.getItem("currentPath") || "/"
//   );

//   const handleClick = () => {
//     if (item.href) {
//       setCurrentPage(item.href);
//       localStorage.setItem("currentPath", item.href);
//       router.push(item.href);
//     }

//     console.log(item.href);
//     console.log(currentPage);
//   };

//   useEffect(() => {
//     const currentPath = localStorage.getItem("currentPath");
//     if (currentPath) {
//       setCurrentPage(currentPath);
//     }
//   }, []);
//   return (
//     <div
//       className={`menu-item ${currentPage === item.href ? "active" : ""}`}
//       onClick={handleClick}
//     >
//       {item.icon}
//       <span>{item.label}</span>
//     </div>
//   );
// };

"use client";
import { usePathname, useRouter } from "next/navigation";

export const MenuItem = ({ item }) => {
  const router = useRouter();
  const pathname = usePathname(); // Get the current URL path

  // Determine if the menu item is active
  const isActive = () => {
    // Check if the current pathname matches the item's href exactly
    if (pathname === item.href) return true;
    // Check if the current pathname matches any of the item's matchPaths
    if (item.matchPaths) {
      return item.matchPaths.some((path) => pathname.startsWith(path));
    }
    return false;
  };

  const handleClick = () => {
    if (item.href) {
      router.push(item.href); // Navigate to the item's href
    }
  };

  return (
    <div
      className={`menu-item ${isActive() ? "active" : ""}`}
      onClick={handleClick}
    >
      {item.icon}
      <span>{item.label}</span>
    </div>
  );
};
