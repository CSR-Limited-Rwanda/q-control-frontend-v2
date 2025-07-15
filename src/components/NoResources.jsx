import { MoveRight, LayoutDashboard } from "lucide-react";
import Link from "next/link";

const NoResources = () => {
  const userFirstName = JSON.parse(localStorage.getItem("userData")).first_name;
  console.log(userFirstName);
  return (
    <div className="no-resources-container">
      <div className="no-resources-wrapper">
        <h2> Hi, {userFirstName}</h2>
        <h1>No resource found</h1>
        <p>
          There is no resource found on this page, kindly use the link(s) below
          to navigate elsewhere.
        </p>
        <Link className="overview-btn" to={"/"}>
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

export default NoResources;
