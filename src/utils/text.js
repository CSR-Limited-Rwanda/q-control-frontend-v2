// split a name string into and take the first and character of the first name and the first character of the last name
export const splitName = (name) => {
    const names = name.split(" ");
    const firstName = names[0].charAt(0);
    const lastName = names[names.length - 1].charAt(0);

    return `${firstName}${lastName}`;
};
