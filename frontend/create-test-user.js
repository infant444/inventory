import axios from 'axios';

const createTestUser = async () => {
  try {
    const response = await axios.post('http://localhost:5000/api/auth/create-user', {
      full_name: 'Admin User',
      email: 'admin@test.com',
      phone: '+1234567890',
      role: 'admin',
      location_ids: []
    });
    
    console.log('✅ Test user created successfully!');
    console.log('📧 Email:', 'admin@test.com');
    console.log('🔑 Password will be sent to email (check backend console)');
    console.log('Response:', response.data);
  } catch (error) {
    console.error('❌ Error creating user:', error.response?.data || error.message);
  }
};

createTestUser();