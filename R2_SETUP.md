# Cloudflare R2 Setup Guide

## Prerequisites

1. **Cloudflare Account** with R2 enabled
2. **R2 Bucket** created
3. **API Tokens** generated

## Installation

Install the required AWS SDK package for R2:

```bash
npm install aws-sdk
```

## Environment Variables

Add these variables to your `.env.local` file:

```env
# Cloudflare R2 Configuration
R2_ACCESS_KEY_ID=your_r2_access_key_id
R2_SECRET_ACCESS_KEY=your_r2_secret_access_key
R2_ACCOUNT_ID=your_account_id
R2_BUCKET=your_bucket_name
R2_PUBLIC_URL=https://your-public-domain.com
```

## R2 Configuration Steps

1. **Create R2 Bucket**:
   - Go to Cloudflare Dashboard → R2 Object Storage
   - Create a new bucket
   - Note the bucket name

2. **Generate API Tokens**:
   - Go to Cloudflare Dashboard → My Profile → API Tokens
   - Create Custom Token with R2 permissions
   - Note the Access Key ID and Secret Access Key

3. **Get Endpoint URL**:
   - Your endpoint will be: `https://your-account-id.r2.cloudflarestorage.com`
   - Find your Account ID in the Cloudflare dashboard

4. **Set Public Domain** (Optional):
   - You can use a custom domain for public access
   - Or use the default R2 domain

## Features

✅ **File Upload**: Users can upload images directly from the menu manager  
✅ **File Validation**: Validates file type (JPEG, PNG, WebP) and size (5MB max)  
✅ **Secure Upload**: Files are uploaded through a secure API route  
✅ **Public URLs**: Images are stored with public read access  
✅ **Unique Filenames**: Prevents filename conflicts with timestamps  

## Usage

1. **Add Menu Item**: Click "Add Item" in the menu manager
2. **Upload Image**: Click the upload button next to "Image Upload"
3. **Select File**: Choose an image file (JPEG, PNG, WebP)
4. **Save**: The image will be uploaded to R2 and the URL saved

## File Structure

```
menu-items/
├── 1703123456789-abc123.jpg
├── 1703123456790-def456.png
└── 1703123456791-ghi789.webp
```

## Security

- Files are validated on both client and server
- File size limit: 5MB
- Allowed types: JPEG, PNG, WebP
- Unique filenames prevent conflicts
- API route handles authentication securely 