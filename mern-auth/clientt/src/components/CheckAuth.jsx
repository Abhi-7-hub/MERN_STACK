import { useEffect } from 'react';

const CheckAuth = () => {
  useEffect(() => {
    fetch('https://mern-stack-i5g2.onrender.com/api/auth/is-auth', {
      method: 'GET',
      credentials: 'include',
    })
      .then(res => res.json())
      .then(data => console.log('✅ Auth Response:', data))
      .catch(err => console.error('❌ Fetch Error:', err));
  }, []);

  return null; // No UI, silent check
};

export default CheckAuth;
