import { LoaderCircle } from "lucide-react";

export const LoaderSpinner = () => {
  return (
    <div className="loader-container">
      <LoaderCircle size={24} color="#ffffff" className="loader-icon" />
    </div>
  );
};
