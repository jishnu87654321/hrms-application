const axios = require('axios');

async function test() {
  try {
    const res = await axios.post('https://hrms-backend-prod.vercel.app/api/auth/login', {
      email: 'admin@hrms.com',
      password: 'password'
    });
    console.log('RES:', res.data);
  } catch (err) {
    if (err.response) {
      console.log('ERR STATUS:', err.response.status);
      console.log('ERR DATA:', JSON.stringify(err.response.data, null, 2));
    } else {
      console.log('ERR MESSAGE:', err.message);
    }
  }
}

test();
