import React from 'react'
import CustomDatePicker from '@/components/CustomDatePicker'
import CustomTimeInput from '@/components/CustomTimeInput'
import RichTexField from '@/components/forms/RichTextField'
import { useAuthentication } from '@/context/authContext'
import USDatePicker from '@/components/forms/USDatePicker'

const Step1InfoForm = ({ formData, handleChange, isFieldInvalid, getFieldError }) => {
  const { user } = useAuthentication
  return (
    <div className="step">
      <div className="half">
        <div className="field">
          <label htmlFor="reporterFirstName">
            Person taking report first name:
          </label>
          <input
            onChange={handleChange}
            value={formData.taken_by?.first_name || ''}
            className={isFieldInvalid('reporterFirstName') ? 'invalid' : ''}
            type="text"
            name="taken_by.first_name"
            id="reporterFirstName"
            placeholder="Enter first name"
            required
          />
          {isFieldInvalid('reporterFirstName') && (
            <div className='error-message'>
              <span>{getFieldError('reporterFirstName')}</span>
              </div>
          )}
        </div>
        <div className="field">
          <label htmlFor="reporterLastName">
            Person taking report last name:
          </label>
          <input
          onChange={handleChange}
            value={formData.taken_by?.last_name || ''}
            className={isFieldInvalid('reporterLastName') ? 'invalid' : ''}
            type="text"
            name="taken_by.last_name"
            id="reporterLastName"
            placeholder="Enter last name"
            required
          />
           {isFieldInvalid('reporterLastName') && (
            <div className='error-message'>
              <span>{getFieldError('reporterLastName')}</span>
              </div>
          )}
        </div>
         
      </div>

      <div className="half">
        <div className="field">
           <label htmlFor="patientFirstName">Date Reported </label>
                  <div className="field-group">
                    <USDatePicker
                        name="date_reported"
                        value={formData.date_reported || ''}
                        onChange={handleChange}
                        isInvalid={isFieldInvalid('date_reported')}
                        errorMessage={getFieldError('date_reported')}
                        required={true}
                        maxDate={new Date()} 
                    />
                </div>
        </div>

           <div className="field-group">
               <label htmlFor="time_reported">Time Reported <span className="required">*</span></label>
               <CustomTimeInput
                   setTime={(time) => handleChange({ target: { name: 'time_reported', value: time } })}
                   defaultTime={formData.time_reported || ''}
               />
               {isFieldInvalid('time_reported') && (
                   <div className="error-message">
                       <span>{getFieldError('time_reported')}</span>
                   </div>
               )}
           </div>

 
      </div>

      <div className="col">
        <label htmlFor="patientFirstName">
          Name of Patient, Patient Representative, or other individual
          reporting loss:
        </label>
        <div className="half">
          <div className="field name">
            <input
              onChange={handleChange}
              value={formData.reported_by?.first_name || ''}
              className={isFieldInvalid('patientFirstName') ? 'invalid' : ''}
              type="text"
              name="reported_by.first_name"
              id="patientFirstName"
              placeholder="Enter first name"
              required
            />
              {isFieldInvalid('patientFirstName') && (
            <div className='error-message'>
              <span>{getFieldError('patientFirstName')}</span>
              </div>
          )}
          </div>
                  
          <div className="field name">
            <input
              onChange={handleChange}
              value={formData.reported_by?.last_name || ''}
              className={isFieldInvalid('patientLastName') ? 'invalid' : ''}
              type="text"
              name="reported_by.last_name"
              id="patientLastName"
              placeholder="Enter last name"
              required
            />
          {isFieldInvalid('patientLastName') && (
            <div className='error-message'>
              <span>{getFieldError('patientLastName')}</span>
              </div>
          )}
          </div>
     

        </div>
      </div>

      <div className="field name">
        <label htmlFor="relationship">
          Relationship to Patient (if applicable):
        </label>
        <input
          onChange={handleChange}
          value={formData.relation_to_patient}
          className={isFieldInvalid('relation_to_patient') ? 'invalid' : ''}
          type="text"
          name="relationship"
          id="relationship"
          placeholder="Enter Relationship"
        />
        {isFieldInvalid('relation_to_patient') && (
          <div className='error-message'>
            <span>Relationship to patient is required</span>
            </div>
        )}
      </div>


      <div className="field name">
        <label htmlFor="propertyName">Property Name</label>
        <input
          onChange={handleChange}
          value={formData.property_name || ''}
          className={isFieldInvalid('property_name') ? 'invalid' : ''}
          type="text"
          name="property_name"
          id="propertyName"
          placeholder="Enter Property name"
          required
        />
        {isFieldInvalid('property_name') && (
          <div className='error-message'>
            <span>property name is required</span>
            </div>
        )

        }
      </div>

      <div className="field name">
        <label htmlFor="descriptionOfProperty">
          Full description of the missing, lost, or misplaced property
          (including money):
        </label>
     
         <RichTexField
          value={formData.item_description || ''}
          onEditorChange={(value) => handleChange({ target: { name: 'item_description', value } })}
        />

        {isFieldInvalid('item_description') && (
          <div className='error-message'>
            <span>Item description is required</span>
            </div>
        )}
      </div>
    </div>
  )
}

export default Step1InfoForm