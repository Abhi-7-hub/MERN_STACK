// src/components/ProfileForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

function ProfileForm() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    mobile: '',
    image: null,
  });

  const handleChange = (e) => {
    const { name, value, files } = e.target;
    if (name === 'image') {
      setFormData({ ...formData, image: files[0] });
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const data = new FormData();
    data.append('name', formData.name);
    data.append('email', formData.email);
    data.append('mobile', formData.mobile);
    data.append('image', formData.image);

    try {
      const res = await axios.post('http://localhost:5000/upload', data);
      alert(res.data.message);
    } catch (err) {
      console.error(err);
      alert("Upload failed");
    }
  };

  return (
    <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
      <input type="text" name="name" placeholder="Name" onChange={handleChange} required />
      <input type="email" name="email" placeholder="Email" onChange={handleChange} required />
      <input type="text" name="mobile" placeholder="Mobile" onChange={handleChange} required />
      <input type="file" name="image" accept="image/*" onChange={handleChange} required />
      <button type="submit">Upload Profile</button>
    </form>
  );
}

export default ProfileForm;
