import React from 'react'
import CustomDatePicker from '@/components/CustomDatePicker'
import CustomTimeInput from '@/components/CustomTimeInput'
import RichTexField from '@/components/forms/RichTextField'
import { Square, SquareCheckBig } from 'lucide-react'

const Step2ActionsForm = ({
  actionTaken,
  setActionTaken,
  checkboxChecked,
  handleCheckboxChange,
  location,
  setLocation,
  dateFound,
  setDateFound,
  timeFound,
  setTimeFound,
  personWhoFoundPropertyFirstName,
  setPersonWhoFoundPropertyFirstName,
  personWhoFoundPropertyLastName,
  setPersonWhoFoundPropertyLastName,
  checkboxReturnedChecked,
  handleCheckboxReturn,
  locationReturned,
  setLocationReturned,
  propertyReturnedTo,
  setPropertyReturnedTo,
  dateReturned,
  setDateReturned,
  timeReturned,
  setTimeReturned
}) => {
  return (
    <div className="step">
      <div className="field name">
        <label htmlFor="actionTaken">
          Actions taken to locate the missing, lost, or misplaced
          property:
        </label>
        <RichTexField
          value={actionTaken}
          onEditorChange={setActionTaken}
        />
      </div>

      <div onClick={handleCheckboxChange} className="field checkbox">
        {checkboxChecked ? (
          <SquareCheckBig size={20} />
        ) : (
          <Square size={20} />
        )}
        <p>Check if missing, lost, or misplaced property was found</p>
      </div>
      {checkboxChecked && (
        <>
          <div className="field name">
            <label htmlFor="location">
              Location where property was found:
            </label>
            <input
              onChange={(e) => setLocation(e.target.value)}
              value={location}
              type="text"
              name="location"
              id="location"
              placeholder="Enter location found"
            />
          </div>
          <div className="half">
            <div className="field">
              <label htmlFor="dateFound">Date Property Found</label>
              <CustomDatePicker
                selectedDate={dateFound}
                setSelectedDate={setDateFound}
              />
            </div>

            <div className="field">
              <label htmlFor="timeFound">Time property Found</label>
              <CustomTimeInput setTime={setTimeFound} />
            </div>
          </div>
          <div className="half">
            <div className="field name">
              <label htmlFor="personWhoFoundPropertyFirstName">
                First Name of person who found property:
              </label>
              <input
                onChange={(e) =>
                  setPersonWhoFoundPropertyFirstName(e.target.value)
                }
                value={personWhoFoundPropertyFirstName}
                type="text"
                name="personWhoFoundPropertyFirstName"
                id="personWhoFoundPropertyFirstName"
                placeholder="Enter first name"
              />
            </div>
            <div className="field name">
              <label htmlFor="personWhoFoundPropertyLastName">
                Last Name of person who found property:
              </label>
              <input
                onChange={(e) =>
                  setPersonWhoFoundPropertyLastName(e.target.value)
                }
                value={personWhoFoundPropertyLastName}
                type="text"
                name="personWhoFoundPropertyLastName"
                id="personWhoFoundPropertyLastName"
                placeholder="Enter last name"
              />
            </div>
          </div>
        </>
      )}

      <div onClick={handleCheckboxReturn} className="field checkbox">
        {checkboxReturnedChecked ? (
          <SquareCheckBig size={20} />
        ) : (
          <Square size={20} />
        )}
        <p>Check if missing, lost, or misplaced property was returned</p>
      </div>

      {checkboxReturnedChecked && (
        <>
          <div className="half">
            <div className="field name">
              <label htmlFor="location">
                Location where property was returned:
              </label>
              <input
                onChange={(e) => setLocationReturned(e.target.value)}
                value={locationReturned}
                type="text"
                name="locationReturned"
                id="locationReturned"
                placeholder="Enter location returned"
              />
            </div>
            <div className="field name">
              <label htmlFor="propertyReturnedTo">
                Property returned to:
              </label>
              <input
                onChange={(e) => setPropertyReturnedTo(e.target.value)}
                value={propertyReturnedTo}
                type="text"
                name="propertyReturnedTo"
                id="propertyReturnedTo"
                placeholder="Enter Name"
              />
            </div>
          </div>

          <div className="half">
            <div className="field">
              <label htmlFor="dateReturned">
                Date property was returned
              </label>
              <CustomDatePicker
                selectedDate={dateReturned}
                setSelectedDate={setDateReturned}
              />
            </div>

            <div className="field">
              <label htmlFor="timeReturned">Time property returned</label>
              <CustomTimeInput setTime={setTimeReturned} />
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Step2ActionsForm