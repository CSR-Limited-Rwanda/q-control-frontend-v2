import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import "@/styles/_accessDeniedPage.scss";
import { useAuthentication } from "@/context/authContext";

const AccessDeniedPage = ({ title, message, btnText, btnLink }) => {
  return (
    <div className="access-denied-page">
      <div className="logo-container">
        <img src="/logo-blue.svg" alt="logo" className="logo" />
      </div>

      <h3>Not enough permissions</h3>
      <p>{message}</p>
      <Link href={btnLink} className="reports-link">
        <span>{btnText}</span> <ChevronRight />
      </Link>
      <span>
        <i>
           Please contact your administrator if you believe this is a mistake.
        </i>
      </span>
    </div>
  );
};

export default AccessDeniedPage;
