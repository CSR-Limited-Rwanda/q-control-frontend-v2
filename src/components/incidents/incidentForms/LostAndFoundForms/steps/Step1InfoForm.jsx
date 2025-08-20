import React from 'react'
import CustomDatePicker from '@/components/CustomDatePicker'
import CustomTimeInput from '@/components/CustomTimeInput'
import RichTexField from '@/components/forms/RichTextField'

const Step1InfoForm = ({
  reporterFirstName,
  setReporterFirstName,
  reporterLastName,
  setReporterLastName,
  patientFirstName,
  setPatientFirstName,
  patientLastName,
  setPatientLastName,
  dateReporting,
  setDateReporting,
  timeReporting,
  setTimeReporting,
  relationship,
  setRelationship,
  propertyName,
  setPropertyName,
  descriptionOfProperty,
  setDescriptionOfProperty
}) => {
  return (
    <div className="step">
      <div className="half">
        <div className="field">
          <label htmlFor="reporterFirstName">
            Person taking report first name:
          </label>
          <input
            onChange={(e) => setReporterFirstName(e.target.value)}
            value={reporterFirstName}
            type="text"
            name="reporterFirstName"
            id="reporterFirstName"
            placeholder="Enter first name"
          />
        </div>
        <div className="field">
          <label htmlFor="reporterLastName">
            Person taking report last name:
          </label>
          <input
            onChange={(e) => setReporterLastName(e.target.value)}
            value={reporterLastName}
            type="text"
            name="reporterLastName"
            id="reporterLastName"
            placeholder="Enter last name"
          />
        </div>
      </div>

      <div className="half">
        <div className="field">
          <label htmlFor="dateOfReporting">Date Reported</label>
          <CustomDatePicker
            selectedDate={dateReporting}
            setSelectedDate={setDateReporting}
          />
        </div>

        <div className="field">
          <label htmlFor="timeOfReporting">Time Reported</label>
          <CustomTimeInput setTime={setTimeReporting} />
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
              onChange={(e) => setPatientFirstName(e.target.value)}
              value={patientFirstName}
              type="text"
              name="patientFirstName"
              id="patientFirstName"
              placeholder="Enter first name"
            />
          </div>
          <div className="field name">
            <input
              onChange={(e) => setPatientLastName(e.target.value)}
              value={patientLastName}
              type="text"
              name="patientLastName"
              id="patientLastName"
              placeholder="Enter last name"
            />
          </div>
        </div>
      </div>

      <div className="field name">
        <label htmlFor="relationship">
          Relationship to Patient (if applicable):
        </label>
        <input
          onChange={(e) => setRelationship(e.target.value)}
          value={relationship}
          type="text"
          name="relationship"
          id="relationship"
          placeholder="Enter Relationship"
        />
      </div>

      <div className="field name">
        <label htmlFor="propertyName">Property Name</label>
        <input
          onChange={(e) => setPropertyName(e.target.value)}
          value={propertyName}
          type="text"
          name="propertyName"
          id="propertyName"
          placeholder="Enter Property name"
        />
      </div>

      <div className="field name">
        <label htmlFor="descriptionOfProperty">
          Full description of the missing, lost, or misplaced property
          (including money):
        </label>
        <RichTexField
          value={descriptionOfProperty}
          onEditorChange={setDescriptionOfProperty}
        />
      </div>
    </div>
  )
}

export default Step1InfoForm