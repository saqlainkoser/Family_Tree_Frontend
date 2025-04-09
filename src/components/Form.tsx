import React, { useState, useEffect } from 'react';
import axios from 'axios';
import 'bootstrap/dist/css/bootstrap.min.css';

interface FamilyMember {
  _id?: string;
  firstName: string;
  lastName: string;
  relationship: string;
  dateOfBirth: string;
  gender: string;
  email: string;
  phone: string;
  address: string;
  parentId?: string;
  spouseId?: string;
  notes: string;
}

const FamilyMemberForm = ({ onClose }: { onClose: () => void }) => {
  const initialFormState: FamilyMember = {
    firstName: '',
    lastName: '',
    relationship: '',
    dateOfBirth: '',
    gender: '',
    email: '',
    phone: '',
    address: '',
    parentId: '',
    spouseId: '',
    notes: ''
  };

  const [formData, setFormData] = useState<FamilyMember>(initialFormState);
  const [submitting, setSubmitting] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<boolean>(false);
  const [familyMembers, setFamilyMembers] = useState<FamilyMember[]>([{
    "firstName": "John",
    "lastName": "Doe",
    "relationship": "self",
    "gender": "male",
    "dateOfBirth": "1980-01-15T00:00:00.000Z",
    "email": "john.doe@example.com",
    "phone": "+1234567890",
    "address": "123 Main St, Anytown",
    "notes": "Family patriarch"
}]);
  
  // Load existing family members for parent/spouse selection
  useEffect(() => {
    // First check local storage for existing family members
    const storedMembers = localStorage.getItem('familyMembers');
    if (storedMembers) {
      setFamilyMembers(JSON.parse(storedMembers));
    }
    
    // Then fetch from database
    const fetchFamilyMembers = async () => {
      try {
        const response = await axios.get('http://localhost:5001/api/family-members');
        if (response.data && response.data.length > 0) {
          setFamilyMembers(response.data);
          // Update local storage with latest data
          localStorage.setItem('familyMembers', JSON.stringify(response.data));
        }
      } catch (err) {
        console.error('Error fetching family members:', err);
      }
    };
    
    fetchFamilyMembers();
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const saveToLocalStorage = (member: FamilyMember) => {
    // Get existing data or initialize empty array
    const existingData = localStorage.getItem('familyMembers');
    const members = existingData ? JSON.parse(existingData) : [];
    
    // Add new member with temporary ID
    const newMember = {
      ...member,
      _id: `temp_${Date.now()}`
    };
    
    members.push(newMember);
    localStorage.setItem('familyMembers', JSON.stringify(members));
    return newMember;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setError(null);
    setSuccess(false);
    
    try {
      // First save to local storage
      const memberWithTempId = saveToLocalStorage(formData);
      setFamilyMembers(prev => [...prev, memberWithTempId]);
      
      // Then save to MongoDB
      const response = await axios.post('http://localhost:5001/api/family-members', formData,{
        headers: {
          'Content-Type': 'application/json'
        }
      });
      
      if (response.data) {
        // Update the local storage entry with the real MongoDB ID
        const updatedMembers = familyMembers.map(member => 
          member._id === memberWithTempId._id ? response.data : member
        );
        setFamilyMembers(updatedMembers);
        localStorage.setItem('familyMembers', JSON.stringify(updatedMembers));
        
        setSuccess(true);
        setFormData(initialFormState);
      }
    } catch (err) {
      console.error('Error submitting form:', err);
      setError('Failed to save family member. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="container-fluid p-4" style={{ background: '#121212', color: '#ffffff' }}>
      <div className="row">
        <div className="col-md-7">
          <div className="card bg-dark text-light p-4 border-0 h-100" style={{ borderRadius: '15px' }}>
            <div className="card-body">
              <h2 className="mb-4 text-light">Add Family Member</h2>
              
              {error && <div className="alert alert-danger">{error}</div>}
              {success && <div className="alert alert-success">Family member added successfully!</div>}
              
              <form onSubmit={handleSubmit}>
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label htmlFor="firstName" className="form-label text-light">First Name</label>
                      <input
                        type="text"
                        className="form-control bg-dark text-light border-secondary"
                        id="firstName"
                        name="firstName"
                        value={formData.firstName}
                        onChange={handleChange}
                        placeholder="Enter your firstname"
                        required
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label htmlFor="lastName" className="form-label text-light">Last Name</label>
                      <input
                        type="text"
                        className="form-control bg-dark text-light border-secondary"
                        id="lastName"
                        name="lastName"
                        value={formData.lastName}
                        onChange={handleChange}
                        placeholder="Enter your lastname"
                        required
                      />
                    </div>
                  </div>
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label htmlFor="relationship" className="form-label text-light">Relationship</label>
                      <select
                        className="form-select bg-dark text-light border-secondary"
                        id="relationship"
                        name="relationship"
                        value={formData.relationship}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Relationship</option>
                        <option value="self">Self</option>
                        <option value="father">Father</option>
                        <option value="mother">Mother</option>
                        <option value="spouse">Spouse</option>
                        <option value="son">Son</option>
                        <option value="daughter">Daughter</option>
                        <option value="brother">Brother</option>
                        <option value="sister">Sister</option>
                        <option value="grandfather">Grandfather</option>
                        <option value="grandmother">Grandmother</option>
                        <option value="uncle">Uncle</option>
                        <option value="aunt">Aunt</option>
                        <option value="cousin">Cousin</option>
                        <option value="nephew">Nephew</option>
                        <option value="niece">Niece</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label htmlFor="gender" className="form-label text-light">Gender</label>
                      <select
                        className="form-select bg-dark text-light border-secondary"
                        id="gender"
                        name="gender"
                        value={formData.gender}
                        onChange={handleChange}
                        required
                      >
                        <option value="">Select Gender</option>
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label htmlFor="dateOfBirth" className="form-label text-light">Date of Birth</label>
                      <input
                        type="date"
                        className="form-control bg-dark text-light border-secondary"
                        id="dateOfBirth"
                        name="dateOfBirth"
                        value={formData.dateOfBirth}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label htmlFor="email" className="form-label text-light">Email Address</label>
                      <input
                        type="email"
                        className="form-control bg-dark text-light border-secondary"
                        id="email"
                        name="email"
                        placeholder="hello@example.com"
                        value={formData.email}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label htmlFor="phone" className="form-label text-light">Phone Number</label>
                      <input
                        type="tel"
                        className="form-control bg-dark text-light border-secondary"
                        id="phone"
                        name="phone"
                        placeholder="Enter your phone number"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label htmlFor="address" className="form-label text-light">Address</label>
                      <input
                        type="text"
                        className="form-control bg-dark text-light border-secondary"
                        id="address"
                        name="address"
                        placeholder="Enter address"
                        value={formData.address}
                        onChange={handleChange}
                      />
                    </div>
                  </div>
                </div>

                <div className="row mb-3">
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label htmlFor="parentId" className="form-label text-light">Parent</label>
                      <select
                        className="form-select bg-dark text-light border-secondary"
                        id="parentId"
                        name="parentId"
                        value={formData.parentId || ''}
                        onChange={handleChange}
                      >
                        <option value="">Select Parent (if applicable)</option>
                        {familyMembers.map(member => (
                          <option key={member._id || `temp-${Date.now()}`} value={member._id}>
                            {member.firstName} {member.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  
                  <div className="col-md-6">
                    <div className="form-group mb-3">
                      <label htmlFor="spouseId" className="form-label text-light">Spouse</label>
                      <select
                        className="form-select bg-dark text-light border-secondary"
                        id="spouseId"
                        name="spouseId"
                        value={formData.spouseId || ''}
                        onChange={handleChange}
                      >
                        <option value="">Select Spouse (if applicable)</option>
                        {familyMembers.map(member => (
                          <option key={member._id || `temp-${Date.now()}`}>
                            {member.firstName} {member.lastName}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>
                
                <div className="form-group mb-4">
                  <label htmlFor="notes" className="form-label text-light">Add Comments</label>
                  <textarea
                    className="form-control bg-dark text-light border-secondary"
                    id="notes"
                    name="notes"
                    value={formData.notes}
                    onChange={handleChange}
                    rows={4}
                    placeholder="Enter here..."
                  />
                </div>
                
                <div className="d-grid">
                  <button 
                    type="submit" 
                    className="btn btn-primary btn-lg" 
                    disabled={submitting}
                    style={{ borderRadius: '30px', background: 'linear-gradient(to right, #6a11cb, #2575fc)', border: 'none' }}
                  >
                    {submitting ? 'Saving...' : 'Add Family Member'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
        
        <div className="col-md-5">
          <div className="card bg-dark text-light p-4 border-0 h-100" style={{ borderRadius: '15px' }}>
            <div className="card-body">
              <h3 className="mb-4 text-light">Family Members Added</h3>
              {familyMembers.length > 0 ? (
                <ul className="list-group">
                {familyMembers.map(member => (
                  <li 
                    key={`${member._id || 'temp'}-${member.firstName}-${member.lastName}`}
                    className="list-group-item bg-dark text-light border-secondary"
                  >
                    {member.firstName} {member.lastName} - {member.relationship}
                  </li>
                ))}
              </ul>
              ) : (
                <p className="text-muted">No family members added yet.</p>
              )}
              
              <div className="mt-4">
                <button 
                  onClick={onClose} 
                  className="btn btn-outline-light"
                  style={{ borderRadius: '30px' }}
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FamilyMemberForm;