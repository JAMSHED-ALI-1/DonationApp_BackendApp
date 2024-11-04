const Campaign = require('../models/compain');
const asyncHandler = require("express-async-handler");
const User = require("../models/userModel");
// const cloudinary = require('../config/cloudinary');
const fs = require('fs');
// Your existing createCampaign function
const cloudinary = require('cloudinary').v2;

// Comprehensive Cloudinary upload function
const uploadImageToCloudinary = async (fileBuffer, options = {}) => {
  try {
    // Verify Cloudinary configuration
    if (!process.env.CLOUDINARY_CLOUD_NAME) {
      throw new Error('Cloudinary Cloud Name is not configured');
    }

    // Configure Cloudinary (safe to call multiple times)
    cloudinary.config({
      cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
      api_key: process.env.CLOUDINARY_API_KEY,
      api_secret: process.env.CLOUDINARY_API_SECRET
    });

    // Detailed logging
    console.log('📸 Cloudinary Upload Attempt');
    console.log('File Buffer Length:', fileBuffer.length);
    console.log('Upload Options:', JSON.stringify(options));

    // Use upload_stream for buffer upload
    const cloudinaryUpload = () => {
      return new Promise((resolve, reject) => {
        const uploadStream = cloudinary.uploader.upload_stream(
          {
            folder: options.folder || 'uploads',
            resource_type: options.resource_type || 'auto'
          }, 
          (error, result) => {
            if (error) {
              console.error('❌ Cloudinary Upload Error:', error);
              reject(error);
            } else {
              console.log('✅ Cloudinary Upload Success:', {
                url: result.secure_url,
                public_id: result.public_id
              });
              resolve(result);
            }
          }
        );

        // Write buffer to upload stream
        uploadStream.end(fileBuffer);
      });
    };

    // Perform the upload
    const uploadResult = await cloudinaryUpload();

    // Validate upload result
    if (!uploadResult || !uploadResult.secure_url) {
      throw new Error('No secure URL returned from Cloudinary');
    }

    return uploadResult;

  } catch (error) {
    console.error('🚨 Full Upload Error:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });
    throw error;
  }
};

// Enhanced campaign creation controller
const createCampaign = async (req, res) => {
  try {
    // Detailed request logging
    console.log('🔍 Request Body:', JSON.stringify(req.body));
    console.log('🖼️ Request File:', req.file ? {
      originalname: req.file.originalname,
      mimetype: req.file.mimetype,
      size: req.file.size
    } : 'No file');

    // Validate file upload
    if (!req.file) {
      return res.status(400).json({ 
        success: false, 
        error: 'No file uploaded',
        details: 'Image file is required'
      });
    }

    // Destructure request body
    const {
      author,
      title,
      content,
      category,
      fundRaisingStartDate,
      fundRaisingEndDate,
      url,
      donationGoal
    } = req.body;

    // Upload image to Cloudinary
    let cloudinaryResponse;
    try {
      cloudinaryResponse = await uploadImageToCloudinary(req.file.buffer, {
        folder: 'campaigns',
        resource_type: 'image'
      });
    } catch (uploadError) {
      console.error('Image Upload Failed:', uploadError);
      return res.status(500).json({
        success: false,
        error: 'Image upload failed',
        details: uploadError.message
      });
    }

    // Validate Cloudinary response
    if (!cloudinaryResponse || !cloudinaryResponse.secure_url) {
      return res.status(500).json({
        success: false,
        error: 'Image URL generation failed'
      });
    }

    // Create campaign
    const campaign = new Campaign({
      image_url: cloudinaryResponse.secure_url, // Explicitly set image URL
      author,
      title,
      content,
      url,
      category,
      fundRaisingStartDate: new Date(fundRaisingStartDate),
      fundRaisingEndDate: new Date(fundRaisingEndDate),
      donationGoal: Number(donationGoal)
    });

    // Save campaign
    await campaign.save();

    // Successful response
    res.status(201).json({
      success: true,
      message: 'Campaign created successfully',
      data: {
        ...campaign.toObject(),
        imageUrl: cloudinaryResponse.secure_url // Additional explicit imageUrl
      }
    });

  } catch (error) {
    console.error('🚨 Campaign Creation Error:', {
      message: error.message,
      name: error.name,
      stack: error.stack
    });

    res.status(500).json({
      success: false,
      error: 'Campaign creation failed',
      details: error.message
    });
  }
};

module.exports = { createCampaign };

// Your existing getAllCampaigns function
const getAllCampaigns = async (req, res) => {
    try {
        const campaigns = await Campaign.find().sort({ created_at: -1 });
        res.status(200).json({
            success: true,
            data: campaigns
        });
    } catch (error) {
        res.status(500).json({
            success: false,
            error: 'Failed to fetch campaigns',
            message: error.message
        });
    }
};

// New function to donate to a campaign
const donateToCampaign = async (req, res) => {
    console.log('first')
    try {
      const { userId, amount } = req.body;
      
      if (!userId || !amount) {
        return res.status(400).json({
          success: false,
          message: "User ID and donation amount are required"
        });
      }
  
      const campaign = await Campaign.findById(req.params.id);
      if (!campaign) {
        return res.status(404).json({
          success: false,
          message: "Campaign not found"
        });
      }
  
      if (campaign.fundRaisingEndDate < Date.now()) {
        return res.status(400).json({
          success: false,
          message: "Fundraising for this campaign has ended"
        });
      }
  
      const user = await User.findById(userId);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }
  
      // Calculate total donation from multiple amounts
      const totalDonation = amount.toString()
        .split('+')
        .reduce((sum, value) => sum + parseFloat(value.trim()), 0);
  
      if (isNaN(totalDonation) || totalDonation <= 0) {
        return res.status(400).json({
          success: false,
          message: "Invalid donation amount"
        });
      }
  
      // Update campaign
      campaign.donationReceived += totalDonation;
      campaign.donors.push({
        user: userId,
        amount: totalDonation,
        donatedAt: new Date()
      });
  
      await campaign.save();
  
      res.status(200).json({
        success: true,
        message: "Donation successful",
        data: {
          campaignId: campaign._id,
          donationAmount: totalDonation,
          donor: {
            name: user.name,
            email: user.email
          },
          currentTotal: campaign.donationReceived
        }
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: "Donation failed",
        error: error.message
      });
    }
  };

// Add authentication middleware to routes that need it
const getCampaignDonations = async (req, res) => {
    try {
        // Check if user is authenticated
        if (!req.user) {
            return res.status(403).json({
                success: false,
                error: 'Authentication required',
                message: 'You must be logged in to view donation details'
            });
        }

        const campaignId = req.params.id;
        
        const campaign = await Campaign.findById(campaignId)
            .populate('donors.user', 'name email');

        if (!campaign) {
            return res.status(404).json({
                success: false,
                error: 'Campaign not found',
                message: 'The specified campaign does not exist'
            });
        }

        // Check if user has permission to view donations
        // Allow campaign author and admin users to view all donations
        if (campaign.author.toString() !== req.user._id.toString() && !req.user.isAdmin) {
            return res.status(403).json({
                success: false,
                error: 'Permission denied',
                message: 'You do not have permission to view detailed donation information'
            });
        }

        res.status(200).json({
            success: true,
            data: {
                campaignTitle: campaign.title,
                donationGoal: campaign.donationGoal,
                totalReceived: campaign.donationReceived,
                percentageAchieved: ((campaign.donationReceived / campaign.donationGoal) * 100).toFixed(2),
                donorsCount: campaign.donors.length,
                donations: campaign.donors
            }
        });

    } catch (error) {
        console.error('Error fetching donations:', error);
        res.status(500).json({
            success: false,
            error: 'Failed to fetch donations',
            message: error.message
        });
    }
};

// Export all controller methods
module.exports = {
    createCampaign,
    getAllCampaigns,
    donateToCampaign,
    getCampaignDonations
};