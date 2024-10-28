const mongoose = require('mongoose');

// Define a schema for donor information
const donorSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  amount: { type: Number, required: true },
  donatedAt: { type: Date, default: Date.now }
});

// Define the main schema for campaign
const campaignSchema = new mongoose.Schema({
  image_url: { type: String, required: true },
  author: { type: String, required: true }, // Reference to the User model
  title: { type: String, required: true },
  content: { type: String, required: true },
  url: {type: String},
  
  category: {  type: mongoose.Schema.Types.ObjectId,ref: 'Category', },
  fundRaisingStartDate: { type: Date, required: true },
  fundRaisingEndDate: { type: Date, required: true },
  donationGoal: { type: Number, required: true },
  donationReceived: { type: Number, default: 0 }, // Track total donations received
  donors: [donorSchema], // Array of donors based on donor schema
  created_at: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Campaign', campaignSchema);
