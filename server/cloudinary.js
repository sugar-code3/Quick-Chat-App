const cloudinary = require('cloudinary').v2; // ✅ Use `.v2`

cloudinary.config({ 
  cloud_name: 'dilip77', 
  api_key: '736911169556267', 
  api_secret: 'k3_Hcw5pSiUoGrGgRH3DIdEql9c'
});

module.exports = cloudinary; // ✅
