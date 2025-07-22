'use client'
import { MoveRight, LayoutDashboard } from 'lucide-react';
import Link from "next/link";

const CantModify = () => {
  const userFirstName = JSON.parse(localStorage.getItem("userData")).first_name;
  return (
    <div className="no-resources-container">
      <div className="no-resources-wrapper">
        <h2> Hi, {userFirstName}</h2>
        <h1>Incident Closed</h1>
        <p>
          Closed incidents cannot be edited or modified, below are some actions
          you can perform.
        </p>
        <Link className="overview-btn" href={"/"}>
          <LayoutDashboard
            size={20}
            color={"#ffffff"}
            variant={"stroke"}
            className="overview-icon"
          />

          <span>Go to overview</span>
          <MoveRight
            size={20}
            color={"#ffffff"}
            variant={"stroke"}
            className="right-arrow"
          />
        </Link>
      </div>
    </div>
  );
};

export default CantModify;