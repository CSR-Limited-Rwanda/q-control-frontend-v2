"use client";

import toast from "react-hot-toast";
import React, { useState } from "react";
import { ArrowLeft, ArrowRight, UserPlusIcon, X } from "lucide-react";
import BasicInfo from "./basicInfo";
import FacilityInfo from "./facilityInfo";
import PermissionGroups from "./permissionGroups";
import PrimaryButton from "@/components/PrimaryButton";
import SecondaryButton from "@/components/SecondaryButton";
import api from "@/utils/api";
import CloseIcon from "@/components/CloseIcon";

const NewUserForm = ({
  handleClose,
  isEditMode = false,
  existingUserData = {},
}) => {
  const [formData, setFormData] = useState({
    firstName: existingUserData?.user?.first_name || "",
    lastName: existingUserData?.user?.last_name || "",
    email: existingUserData?.user?.email || "",
    phoneNumber: existingUserData?.phone_number || "",
    gender: existingUserData?.gender || "",
    dateOfBirth: existingUserData?.date_of_birth || "",
    address: existingUserData?.address || "",
    birthCountry: existingUserData?.birth_country || "",
    city: existingUserData?.city || "",
    state: existingUserData?.state || "",
    zipCode: existingUserData?.zip_code || "",
    facility: existingUserData?.facility || "",
    department: existingUserData?.department || "",
    selectedFacilities: existingUserData.access_to_facilities || [],
    facilityDepartmentSelections: existingUserData.access_to_departments || [],
    title: existingUserData?.title || "",
    hasReviewPermissions: existingUserData?.has_review_permissions || false,
    addToPermissionGroups: existingUserData.addToPermissionGroups,
    permissions: existingUserData?.permissions || [],
    permissionGroups: existingUserData?.permissions_groups || [],
  });

  const [isLoading, setIsLoading] = useState(false);

  const [currentStep, setCurrentStep] = useState(1);
  const [maxStep, setMaxStep] = useState(isEditMode ? 2 : 3);

  const handleNextStep = () => {
    if (currentStep < 3) {
      setCurrentStep((prevStep) => {
        const nextStep = prevStep + 1;
        saveBasicInfo();
        return nextStep;
      });
    }
  };

  const handleSubmit = async () => {
    toast.error("");
    toast.success("");
    const data = saveBasicInfo();

    try {
      setIsLoading(true);
      if (isEditMode) {
        const response = await api.put(`/users/${existingUserData.id}/`, data);
        if (response.status === 200) {
          toast.success("User updated successfully");
          // setTimeout(() => {
          //   // window.location.reload();
          // }, 1000);
        }
      } else {
        const response = await api.post("/users/", data);
        if (response.status === 201) {
          toast.success("User created successfully");
          setTimeout(() => {
            window.location.reload();
          }, 1000);
        }
      }
    } catch (error) {
      let message;
      if (error?.response?.data) {
        message =
          error?.response?.data?.error ||
          error?.response?.data?.message ||
          "An error occurred";
      } else {
        message = error?.message || "Unknown error occurred";
      }
      toast.error(message);
      return;
    } finally {
      setIsLoading(false);
    }
  };

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  };

  const saveBasicInfo = () => {
    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone_number: formData.phoneNumber,
      gender: formData.gender,
      date_of_birth: formData.dateOfBirth,
      address: formData.address,
      birth_country: formData.birthCountry,
      city: formData.city,
      state: formData.state,
      zip_code: formData.zipCode,
      facility_id: formData.facility.value,
      department_id: formData.department.value,
      access_to_facilities: formData.selectedFacilities,
      access_to_departments: Object.values(
        formData.facilityDepartmentSelections || {}
      ).flat(),
      title_id: formData.title.value,
      review_permissions: formData.hasReviewPermissions,
      permissions_groups: formData.permissionGroups.map((group) => group.id),
      // permissions: formData.permissions,
    };
    toast.error("");

    if (isEditMode) {
      delete payload.access_to_departments;
      delete payload.access_to_facilities;
    }

    try {
      localStorage.setItem("userInfo", JSON.stringify(payload));
      return payload;
    } catch (error) {
      toast.error(
        "An error occurred while saving the data. Please try again."
      );
    }
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <CloseIcon onClick={handleClose} />

        <div className="form">
          <h2>
            {isEditMode ? "Update user" : "New User"} {currentStep} of {maxStep}
          </h2>
          <p>
            This form is for {isEditMode ? "updating a" : "adding a new"} user.
            Fill in the necessary <br /> information and continue
          </p>

          <form>
            {currentStep === 1 && (
              <BasicInfo formData={formData} setFormData={setFormData} />
            )}
            {currentStep === 2 && (
              <FacilityInfo formData={formData} setFormData={setFormData} />
            )}
            {currentStep === 3 && (
              <PermissionGroups formData={formData} setFormData={setFormData} />
            )}
            {errorMessage && (
              <div className="error message">
                <span>{errorMessage}</span>
              </div>
            )}
            {successMessage && (
              <div className="success message">
                <span>{successMessage}</span>
              </div>
            )}

            <div className="buttons">
              {currentStep > 1 && (
                <SecondaryButton
                  span={"Back"}
                  onClick={handlePreviousStep}
                  prefixIcon={<ArrowLeft />}
                />
              )}
              {currentStep < maxStep && (
                <SecondaryButton
                  text={"Save and continue"}
                  onClick={handleNextStep}
                  suffixIcon={<ArrowRight />}
                />
              )}
              {currentStep === maxStep && (
                <PrimaryButton
                  text={isEditMode ? "Update user" : "Create a user"}
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  prefixIcon={<UserPlusIcon />}
                />
              )}
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewUserForm;
