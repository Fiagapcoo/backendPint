

const { getUserEngagementMetrics,
        getContentValidationStatusByadmin,
        getContentValidationStatus,
        getActiveDiscussions,
        validateContent,
        rejectContent,
        getActiveWarnings,
        getContentCenterToBeValidated,
        createCenter,
        deleteCenter } = require('../database/logic_objects/adminProcedures');

const controllers = {};

controllers.validate_content = async (req, res) => { 
    const { contentType, contentID, adminID } = req.params; 
    console.log(req.params);
    try {
        await validateContent(contentType,contentID, adminID);


        res.status(201).json({success:true, message:'Content validated successfully.'});
    } catch (error) {
        res.status(500).json({success:false, message:'Error validating content: ' + error.message});
    }
};

controllers.reject_content = async (req, res) => { 
    const { contentType, contentId, adminId } = req.params; 
    console.log(req.params);
    try {
        await rejectContent(contentType, contentId, adminId);


        res.status(201).json({success:true, message:'Content rejected successfully.'});
    } catch (error) {
        res.status(500).json({success:false, message:'Error rejecting content: ' + error.message});
    }
};

// Get user engagement metrics
controllers.getUserEngagementMetrics = async (req, res) => {
    try {
      const results = await getUserEngagementMetrics();
      res.status(200).json({success:true, data:results});
    } catch (error) {
      res.status(500).json({success:false, message:'Error fetching user engagement metrics: ' + error.message});
    }
};
  
// Get content validation status by admin
controllers.getContentValidationStatusByadmin = async (req, res) => {
    const { adminID } = req.params;
    try {
      const results = await getContentValidationStatusByadmin(adminID);
      res.status(200).json({success:true, data:results});
    } catch (error) {
      res.status(500).json({success:false, message:'Error fetching content validation status by admin: ' + error.message});
    }
};
  
// Get content validation status
controllers.getContentValidationStatus = async (req, res) => {
    try {
      const results = await getContentValidationStatus();
      res.status(200).json({success:true, data:results});
    } catch (error) {
      res.status(500).json({success:false, message:'Error fetching content validation status: ' + error.message});
    }
};
  
// Get active discussions
controllers.getActiveDiscussions = async (req, res) => {
    try {
      const results = await getActiveDiscussions();
      res.status(200).json({success:true, data:results});
    } catch (error) {
      res.status(500).json({success:false, message:'Error fetching active discussions: ' + error.message});
    }
};
// Get active warnings
controllers.getActiveWarnings = async (req, res) => {
    try {
      const results = await getActiveWarnings();
      res.status(200).json({success:true, data:results});
    } catch (error) {
      res.status(500).json({success:false, message:'Error fetching active warnings: ' + error.message});
    }
};
  
// Get content center to be validated
controllers.getContentCenterToBeValidated = async (req, res) => {
    const { center_id } = req.params;
    try {
      const results = await getContentCenterToBeValidated(center_id);
      res.status(200).json({success:true, data:results});
    } catch (error) {
      res.status(500).json({success:false, message:'Error fetching content center to be validated: ' + error.message});
    }
};
  
// Create center
controllers.createCenter = async (req, res) => {
    const { city } = req.body;
    try {
      await createCenter(city);
      res.status(201).json({success:true, message:'Center created successfully.'});
    } catch (error) {
      res.status(500).json({success:false, message:'Error creating center: ' + error.message});
    }
};
  
// Delete center
controllers.deleteCenter = async (req, res) => {
    const { center_id } = req.params;
    try {
      await deleteCenter(center_id);
      res.status(200).json({success:true, message:'Center deleted successfully.'});
    } catch (error) {
      res.status(500).json({success:false, message:'Error deleting center: ' + error.message});
    }
};  

module.exports = controllers;