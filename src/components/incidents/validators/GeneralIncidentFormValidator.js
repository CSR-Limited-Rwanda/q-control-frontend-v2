export const validateStep = (fieldsObject, onError = null) => {
  const missingFields = [];

  for (const field in fieldsObject) {
    if (!fieldsObject[field]) {
      missingFields.push(field);
    }
  }

  if (missingFields.length > 0) {
    const message = `Please enter : ${missingFields.join(", ")}`;
    if (onError) {
      onError(message);
    }
    return false;
  }
  return true;
};