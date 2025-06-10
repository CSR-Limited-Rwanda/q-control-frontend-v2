export const openDropdown = (selectId) => {
    const select = document.getElementById(selectId)

    if (select) {
        if (select.showPicker) {
            select.showPicker()
        } else {
            select.focus()
            select.click()
        }
    }
}