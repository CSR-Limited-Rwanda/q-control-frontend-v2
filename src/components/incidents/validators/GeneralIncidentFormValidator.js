export const validateStep = (fieldsObject) => {
    const missingFields = [];
  
    for (const field in fieldsObject) {
      if (!fieldsObject[field]) {
        missingFields.push(field);
      }
    }
  
    if (missingFields.length > 0) {
      const message = `Please enter : ${missingFields.join(", ")}`;
      window.customToast.error(message);
  
      return false;
    }
    return true;
  };