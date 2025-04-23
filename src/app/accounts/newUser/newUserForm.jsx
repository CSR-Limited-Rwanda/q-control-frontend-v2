import React, { useState } from 'react';
import '../../../../../assets/css/forms/_newUser.scss'
import FacilityInfo from './facilityInfo';
import BasicInfo from './basicInfo';
import { set } from 'date-fns';
import PermissionGroups from './permissionGroups';
import { UserPlusIcon, X } from 'lucide-react';
import PrimaryButton from '../../../../general/PrimaryButton';
import ErrorMessage from '../../../../general/errorMessage';
import api from '../../../../../api';

const NewUserForm = () => {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    sex: '',
    dateOfBirth: '',
    address: '',
    birthCountry: '',
    city: '',
    state: '',
    zipCode: '',
    facility: '',
    department: '',
    role: '',
    permissionLevel: '',
    hasReviewPermissions: false,
    addToPermissionGroup: false,
    permissions: [],
    permissionGroups: [],
  });


  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState();
  const [successMessage, setSuccessMessage] = useState();

  const [currentStep, setCurrentStep] = useState(1);
  const [maxStep, setMaxStep] = useState(3);

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
    setErrorMessage('');
    setSuccessMessage('');
    const data = saveBasicInfo();

    try {
      setIsLoading(true);
      const response = await api.post('/users/', data);
      if (response.status === 201) {
        setSuccessMessage('User created successfully');
        setTimeout(() => {
          window.location.reload();
        }, 1000);
      }
    } catch (error) {
      let message
      if (error?.response?.data) {
        message = error?.response?.data?.error || error?.response?.data?.message || 'An error occurred';
      } else {
        message = error?.message || 'Unknown error occurred';
      }
      setErrorMessage(message);
      return
    } finally {
      setIsLoading(false);
    }
  }

  const handlePreviousStep = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
    }
  }

  const saveBasicInfo = () => {
    setErrorMessage('');
    const payload = {
      first_name: formData.firstName,
      last_name: formData.lastName,
      email: formData.email,
      phone_number: formData.phoneNumber,
      sex: formData.sex,
      date_of_birth: formData.dateOfBirth,
      address: formData.address,
      birth_country: formData.birthCountry,
      city: formData.city,
      state: formData.state,
      zip_code: formData.zipCode,
      facility_id: formData.facility.value,
      department_id: formData.department.value,
      role: formData.role,
      permission_level: formData.permissionLevel,
      has_review_permissions: formData.hasReviewPermissions,
      permission_groups: formData.permissionGroups.map((group) => (group.id)),
      // permissions: formData.permissions,
    };

    // addToPermissionGroup, remove permissions from payload, else, remove the permission_groups from payload
    if (formData.addToPermissionGroup) {
      delete payload.permissions;
    } else {
      delete payload.permission_groups;
    }


    try {
      localStorage.setItem('userInfo', JSON.stringify(payload));
      return payload;
    } catch (error) {
      console.log(error);
      setErrorMessage('An error occurred while saving the data. Please try again.');
    }
  };

  return (
    <div className="popup">
      <div className="popup-content">
        <div className="close">
          <X size={32} />
        </div>
        <div className="form">
          <h2>New User {currentStep} of {maxStep}</h2>
          <p>
            This form is for adding a new user. Fill in the necessary <br /> information and continue
          </p>

          <form>
            {
              currentStep === 1 &&
              <BasicInfo formData={formData} setFormData={setFormData} />
            }
            {
              currentStep === 2 &&
              <FacilityInfo
                formData={formData}
                setFormData={setFormData}
              />
            }
            {
              currentStep === 3 &&
              <PermissionGroups formData={formData} setFormData={setFormData} />
            }
            {
              errorMessage && <div className="error message"><span>{errorMessage}</span></div>
            }
            {
              successMessage && <div className="success message"><span>{successMessage}</span></div>
            }

            <div className="buttons">
              {
                currentStep > 1 &&
                <button type="button" className="secondary-button" onClick={handlePreviousStep}>
                  Back
                </button>
              }
              {
                currentStep < maxStep &&
                <button type="button" className="primary-button" onClick={handleNextStep}>
                  Save and continue
                </button>
              }
              {
                currentStep === maxStep &&
                <PrimaryButton
                  text={"Create a user"}
                  onClick={handleSubmit}
                  isLoading={isLoading}
                  prefixIcon={<UserPlusIcon />}
                  suffixIcon={<UserPlusIcon />} />
              }
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default NewUserForm;