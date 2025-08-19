import { useState, useRef, useEffect } from "react";
import { calculateAge } from "@/utils/api";

export const useHandlers = (user) => {

    // Helper functions
    const handleDateOfBirth = (date) => {
        const calculatedAge = calculateAge(date);
        setDateOfBirth(date);
        setAge(calculatedAge);
    };

    const handleCheckboxChange = (option) => {
        let updatedOptions;
        if (statusPrior.includes(option)) {
            updatedOptions = statusPrior.filter((item) => item !== option);
        } else {
            updatedOptions = [...statusPrior, option];
        }
        setStatusPrior(updatedOptions);
    };

    const handlePriorStatusOtherInputChange = (event) => {
        setStatusPriorOtherInput(event.target.value);
    };

    const handlePriorStatusOtherCheckboxChange = (e) => {
        setShowPriorStatusOtherInput(e.target.checked);
        if (!e.target.checked) {
            setStatusPriorOtherInput("");
        }
    };

    const handleFellOff = (value) => {
        if (!fellOffOf.includes(value)) {
            setFellOffOf((prevState) => [...prevState, value]);
        } else {
            setFellOffOf((prevState) => prevState.filter((item) => item !== value));
        }
    };

    const handleAgreementClick = (name) => {
        if (!agreement.includes(name)) {
            setAgreement((prevState) => [...prevState, name]);
        } else {
            setAgreement((prevState) => prevState.filter((item) => item !== name));
        }

        if (!restraintOn.includes(name)) {
            setRestraintOn((prevState) => [...prevState, name]);
        } else {
            setRestraintOn((prevState) => prevState.filter((item) => item !== name));
        }

        if (!specimen.includes(name)) {
            setSpecimen((prevState) => [...prevState, name]);
        } else {
            setSpecimen((prevState) => prevState.filter((item) => item !== name));
        }

        if (name === "Restraint on") {
            setShowRestrainOptions(!showRestrainOptions);
        }
        if (name === "specimen") {
            setshowSpecimen(!showSpecimen);
        }
    };

    const handleSpecialCheck = (type) => {
        setSpecialChecked((prev) => ({
            ...prev,
            [type]: !prev[type],
        }));
    };

    const handleOtherClick = (type) => {
        setOtherTypes(type);
        setErrors({});
        if (type !== "Specimen") {
            setSpecialChecked({});
        }
    };

    const handleCategory = (value, setValue) => {
        setValue(value);
    };

    const handleRemovedFromService = (checked) => {
        setRemovedFromService(checked);
    };

    const handleMaintenanceNotified = (checked) => {
        setMaintenanceNotified(checked);
    };

    const handleFileChange = (event) => {
        setFiles(event.target.files);
    };

    const handleCurrentFacility = (facilityId) => {
        const selectedFacility = user?.accounts?.find(
            (facility) => facility.id === parseInt(facilityId)
        );
        setCurrentFacility(selectedFacility);
    };

    // Helper functions
    return {
        handleDateOfBirth,
        handleCheckboxChange,
        handlePriorStatusOtherInputChange,
        handlePriorStatusOtherCheckboxChange,
        handleFellOff,
        handleAgreementClick,
        handleSpecialCheck,
        handleOtherClick,
        handleCategory,
        handleRemovedFromService,
        handleMaintenanceNotified,
        handleFileChange,
        handleCurrentFacility,
    };
};
