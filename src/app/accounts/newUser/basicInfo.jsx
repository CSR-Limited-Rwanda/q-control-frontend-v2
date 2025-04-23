import React from 'react'
import CustomDatePicker from '../../inputs/datePicker';
import 'react-day-picker/dist/style.css';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { DatePicker } from '@mui/x-date-pickers/DatePicker';


const BasicInfo = ({ formData, setFormData }) => {
    const handleChange = (e) => {
        const { id, value } = e.target;
        setFormData((prevData) => ({
            ...prevData,
            [id]: value,
        }));
    };

    return (
        <div className="card">
            <div className="half">
                <div className="form-group">
                    <label htmlFor="firstName">First name</label>
                    <input
                        type="text"
                        id="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="First name"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="lastName">Last name</label>
                    <input
                        type="text"
                        id="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Last name"
                        required
                    />
                </div>
            </div>
            <div className="half">
                <div className="form-group">
                    <label htmlFor="email">Email</label>
                    <input
                        type="email"
                        id="email"
                        value={formData.email}
                        onChange={handleChange}
                        placeholder="Email"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="phoneNumber">Phone number</label>
                    <input
                        type="tel"
                        id="phoneNumber"
                        value={formData.phoneNumber}
                        onChange={handleChange}
                        placeholder="Phone number"
                        required
                    />
                </div>
            </div>
            <div className="half">
                <div className="form-group">
                    <label htmlFor="sex">Sex</label>
                    <select
                        id="sex"
                        value={formData.sex}
                        onChange={handleChange}
                        required
                    >
                        <option value="">Select sex</option>
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                    </select>
                </div>
                <div className="form-group">
                    <label htmlFor="dateOfBirth">Date of birth</label>

                    <input
                        type="date"
                        id="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                        required
                    />
                </div>
            </div>
            <div className="half">
                <div className="form-group">
                    <label htmlFor="address">Address</label>
                    <input
                        type="text"
                        id="address"
                        value={formData.address}
                        onChange={handleChange}
                        placeholder="Address"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="birthCountry">Birth country</label>
                    <input
                        type="text"
                        id="birthCountry"
                        value={formData.birthCountry}
                        onChange={handleChange}
                        placeholder="Birth country"
                        required
                    />
                </div>
            </div>
            <div className="half">
                <div className="form-group">
                    <label htmlFor="city">City</label>
                    <input
                        type="text"
                        id="city"
                        value={formData.city}
                        onChange={handleChange}
                        placeholder="City"
                        required
                    />
                </div>
                <div className="form-group">
                    <label htmlFor="state">State</label>
                    <input
                        type="text"
                        id="state"
                        value={formData.state}
                        onChange={handleChange}
                        placeholder="State"
                        required
                    />
                </div>
            </div>
            <div className="half">
                <div className="form-group">
                    <label htmlFor="zipCode">Zip code</label>
                    <input
                        type="text"
                        id="zipCode"
                        value={formData.zipCode}
                        onChange={handleChange}
                        placeholder="Zip code"
                        required
                    />
                </div>
            </div>
        </div>
    );
};

export default BasicInfo;