import { v2 as cloudinary } from 'cloudinary'
import fs from 'fs'
import path from 'path'

// Simple .env parser for Node environment (zero dependencies)
const envPath = path.resolve('.env')
if (fs.existsSync(envPath)) {
  const envConfig = fs.readFileSync(envPath, 'utf8')
  envConfig.split('\n').forEach((line) => {
    const match = line.match(/^\s*([\w.-]+)\s*=\s*(.*)?\s*$/)
    if (match) {
      const key = match[1]
      let val = match[2] || ''
      if (val.startsWith('"') && val.endsWith('"')) {
        val = val.substring(1, val.length - 1)
      } else if (val.startsWith("'") && val.endsWith("'")) {
        val = val.substring(1, val.length - 1)
      }
      process.env[key] = val
    }
  })
}

// Configure Cloudinary from environment
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// 1. Upload a sample image from Cloudinary's demo library
const upload = await cloudinary.uploader.upload(
  'https://res.cloudinary.com/demo/image/upload/sample.jpg',
  { public_id: 'weding_test_sample' }
)

console.log('✅ Upload successful')
console.log('   Secure URL :', upload.secure_url)
console.log('   Public ID  :', upload.public_id)

// 2. Fetch image metadata
const details = await cloudinary.api.resource(upload.public_id)

console.log('\n📐 Image details')
console.log('   Width       :', details.width, 'px')
console.log('   Height      :', details.height, 'px')
console.log('   Format      :', details.format)
console.log('   File size   :', details.bytes, 'bytes')

// 3. Generate a transformed URL
// f_auto → Cloudinary picks the best format for the browser (WebP, AVIF, etc.)
// q_auto → Cloudinary picks the best quality/size balance automatically
const transformedUrl = cloudinary.url(upload.public_id, {
  fetch_format: 'auto', // f_auto
  quality: 'auto',      // q_auto
  width: 800,
  crop: 'limit',
})

console.log('\n🎉 Done! Click the link below to see the optimized version.')
console.log('   Check the size and format in your browser DevTools (Network tab).')
console.log('\n   Transformed URL:', transformedUrl)
