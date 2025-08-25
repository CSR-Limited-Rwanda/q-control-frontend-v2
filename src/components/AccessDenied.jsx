import { ChevronRight } from "lucide-react";
import Link from "next/link";
import React from "react";
import "@/styles/_accessDeniedPage.scss";
import { useAuthentication } from "@/context/authContext";

const AccessDeniedPage = ({ title, message }) => {
  const { user } = useAuthentication();
  const profileId = user?.profileId;
  return (
    <div className="access-denied-page">
      <div className="logo-container">
        <img src="/logo-blue.svg" alt="logo" className="logo" />
      </div>

      <h3>Not enough permissions</h3>
      <p>
        You currently don’t have access to view any incident reports. To view
        your reports, click the button below.
      </p>
      <Link href={`/accounts/${profileId}`} className="reports-link">
        <span> My reports </span> <ChevronRight />
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
