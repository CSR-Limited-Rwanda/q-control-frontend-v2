import React from 'react'
import CustomDatePicker from '@/components/CustomDatePicker'
import CustomTimeInput from '@/components/CustomTimeInput'
import RichTexField from '@/components/forms/RichTextField'
import { Square, SquareCheckBig } from 'lucide-react'
import USDatePicker from '@/components/forms/USDatePicker'

const Step2ActionsForm = ({formData, handleChange, isFieldInvalid, getFieldError}) => {

  const handleCheckboxChange = (fieldName) => (e) => {
    handleChange({
      target: {
        name: fieldName,
        value: !formData[fieldName]
      }
    })
  }

  return (
    <div className="step">
      <div className="field name">
        <label htmlFor="actionTaken">
          Actions taken to locate the missing, lost, or misplaced
          property:
        </label>
        <RichTexField
          value={formData.action_taken || ''}
          onEditorChange={(value) => handleChange({ target: { name: 'action_taken', value } })}
        />
        {isFieldInvalid('action_taken') && (
          <div className='error-message'>
            <span>{getFieldError('action_taken')}</span>
          </div>
        )}
      </div>

      <div onClick={handleCheckboxChange('property_found')} className="field checkbox">
        {formData.property_found ? (
          <SquareCheckBig size={20} />
        ) : (
          <Square size={20} />
        )}
        <p>Check if missing, lost, or misplaced property was found</p>
      </div>
      {formData.property_found && (
        <>
          <div className="field name">
            <label htmlFor="locationFound">
              Location where property was found:
            </label>
            <input
              onChange={handleChange}
              value={formData.location_found || ''}
              className={isFieldInvalid('location_found') ? 'invalid' : ''}
              type="text"
              name="location_found"
              id="locationFound"
              placeholder="Enter location found"
            />
            {isFieldInvalid('location_found') && (
              <div className='error-message'>
                <span>{getFieldError('location_found')}</span>
              </div>
            )}
          </div>
          <div className="half">
            <div className="field">
              <label htmlFor="dateFound">Date Property Found</label>
              <div className="field-group">
                <USDatePicker
                  name="date_found"
                  value={formData.date_found || ''}
                  onChange={handleChange}
                  isInvalid={isFieldInvalid('date_found')}
                  errorMessage={getFieldError('date_found')}
                  required={true}
                  maxDate={new Date()} // Prevent future dates
                />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="timeFound">Time Property Found <span className="required">*</span></label>
              <CustomTimeInput
                setTime={(time) => handleChange({ target: { name: 'time_found', value: time } })}
                defaultTime={formData.time_found || ''}
              />
              {isFieldInvalid('time_found') && (
                <div className="error-message">
                  <span>{getFieldError('time_found')}</span>
                </div>
              )}
            </div>
          </div>
          <div className="half">
            <div className="field name">
              <label htmlFor="foundByFirstName">
                First Name of person who found property:
              </label>
              <input
                onChange={handleChange}
                value={formData.taken_by?.first_name || ''}
                className={isFieldInvalid('foundByFirstName') ? 'invalid' : ''}
                type="text"
                name="taken_by.first_name"
                id="foundByFirstName"
                placeholder="Enter first name"
              />
              {isFieldInvalid('foundByFirstName') && (
                <div className='error-message'>
                  <span>{getFieldError('foundByFirstName')}</span>
                </div>
              )}
            </div>
            <div className="field name">
              <label htmlFor="foundByLastName">
                Last Name of person who found property:
              </label>
              <input
                onChange={handleChange}
                value={formData.taken_by?.last_name || ''}
                className={isFieldInvalid('foundByLastName') ? 'invalid' : ''}
                type="text"
                name="taken_by.last_name"
                id="foundByLastName"
                placeholder="Enter last name"
              />
              {isFieldInvalid('foundByLastName') && (
                <div className='error-message'>
                  <span>{getFieldError('foundByLastName')}</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}

      <div onClick={handleCheckboxChange('property_returned')} className="field checkbox">
        {formData.property_returned ? (
          <SquareCheckBig size={20} />
        ) : (
          <Square size={20} />
        )}
        <p>Check if missing, lost, or misplaced property was returned</p>
      </div>

      {formData.property_returned && (
        <>
          <div className="half">
            <div className="field name">
              <label htmlFor="locationReturned">
                Location where property was returned:
              </label>
              <input
                onChange={handleChange}
                value={formData.location_returned || ''}
                className={isFieldInvalid('location_returned') ? 'invalid' : ''}
                type="text"
                name="location_returned"
                id="locationReturned"
                placeholder="Enter location returned"
              />
              {isFieldInvalid('location_returned') && (
                <div className='error-message'>
                  <span>{getFieldError('location_returned')}</span>
                </div>
              )}
            </div>
            <div className="field name">
              <label htmlFor="propertyReturnedTo">
                Property returned to:
              </label>
              <input
                onChange={handleChange}
                value={formData.returned_to || ''}
                className={isFieldInvalid('returned_to') ? 'invalid' : ''}
                type="text"
                name="returned_to"
                id="propertyReturnedTo"
                placeholder="Enter Name"
              />
              {isFieldInvalid('returned_to') && (
                <div className='error-message'>
                  <span>{getFieldError('returned_to')}</span>
                </div>
              )}
            </div>
          </div>

          <div className="half">
            <div className="field">
              <label htmlFor="dateReturned">
                Date property was returned
              </label>
              <div className="field-group">
                <USDatePicker
                  name="date_returned"
                  value={formData.date_returned || ''}
                  onChange={handleChange}
                  isInvalid={isFieldInvalid('date_returned')}
                  errorMessage={getFieldError('date_returned')}
                  required={true}
                  maxDate={new Date()} // Prevent future dates
                />
              </div>
            </div>

            <div className="field-group">
              <label htmlFor="timeReturned">Time Property Returned <span className="required">*</span></label>
              <CustomTimeInput
                setTime={(time) => handleChange({ target: { name: 'time_returned', value: time } })}
                defaultTime={formData.time_returned}
              />
              {isFieldInvalid('time_returned') && (
                <div className="error-message">
                  <span>{getFieldError('time_returned')}</span>
                </div>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default Step2ActionsForm