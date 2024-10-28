const express = require('express');
const router = express.Router();
const upload = require('../utils/multerConfig');
const { 
    createCampaign, 
    getAllCampaigns,
    donateToCampaign,
    getCampaignDonations,
    // deleteCampaign 
} = require('../controllers/compaincontroller');

// Campaign routes
router.post('/create', upload.single('imageUrl'), createCampaign);
router.get('/all', getAllCampaigns);
router.post('/:id/donate',donateToCampaign);
router.get('/:id/getdonatecompain', getCampaignDonations);
// router.get('/delete', deleteCampaign);

module.exports = router;