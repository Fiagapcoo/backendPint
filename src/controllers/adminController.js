const validator = require("validator");

const {
  getUserEngagementMetrics,
  getContentValidationStatusByadmin,
  getContentValidationStatus,
  getActiveDiscussions,
  spValidateContent,
  rejectContent,
  getActiveWarnings,
  getContentCenterToBeValidated,
  createCenter,
  deleteCenter,
  getCenters,
  makeCenterAdmin,
  updateCenter,
} = require("../database/logic_objects/adminProcedures");
const {
  spSetCenterAdmin,
  spDeactivateUser,
  spActivateUser,
} = require("../database/logic_objects/securityProcedures");
const controllers = {};

controllers.validate_content = async (req, res) => {
  const { contentType, contentID, adminID } = req.params;
  console.log(req.params);
  // Validate inputs
  if (!validator.isIn(contentType, ["post", "event", "forum"])) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid content type" });
  }
  if (!validator.isInt(contentID.toString())) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid content ID" });
  }
  if (!validator.isInt(adminID.toString())) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid admin ID" });
  }
  console.log(req.params);
  try {
    await spValidateContent(contentType, contentID, adminID);

    res
      .status(201)
      .json({ success: true, message: "Content validated successfully." });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error validating content: " + error.message,
      });
  }
};

controllers.reject_content = async (req, res) => {
  const { contentType, contentID, adminID } = req.params;
  // Validate inputs
  if (!validator.isIn(contentType, ["post", "event", "forum"])) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid content type" });
  }
  if (!validator.isInt(contentID.toString())) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid content ID" });
  }
  if (!validator.isInt(adminID.toString())) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid admin ID" });
  }
  console.log(req.params);
  try {
    await rejectContent(contentType, contentID, adminID);

    res
      .status(201)
      .json({ success: true, message: "Content rejected successfully." });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error rejecting content: " + error.message,
      });
  }
};

// Get user engagement metrics
controllers.getUserEngagementMetrics = async (req, res) => {
  try {
    const results = await getUserEngagementMetrics();
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching user engagement metrics: " + error.message,
      });
  }
};

// Get content validation status by admin
controllers.getContentValidationStatusByadmin = async (req, res) => {
  const { adminID } = req.params;
  // Validate Inputs
  if (!validator.isInt(adminID.toString())) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid admin ID" });
  }
  try {
    const results = await getContentValidationStatusByadmin(adminID);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message:
          "Error fetching content validation status by admin: " + error.message,
      });
  }
};

// Get content validation status
controllers.getContentValidationStatus = async (req, res) => {
  try {
    const results = await getContentValidationStatus();
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching content validation status: " + error.message,
      });
  }
};

// Get active discussions
controllers.getActiveDiscussions = async (req, res) => {
  try {
    const results = await getActiveDiscussions();
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching active discussions: " + error.message,
      });
  }
};
// Get active warnings
controllers.getActiveWarnings = async (req, res) => {
  try {
    const results = await getActiveWarnings();
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching active warnings: " + error.message,
      });
  }
};

// Get content center to be validated
controllers.getContentCenterToBeValidated = async (req, res) => {
  const { center_id } = req.params;
  // Validate Inputs
  if (!validator.isInt(center_id.toString())) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid center ID" });
  }
  try {
    const results = await getContentCenterToBeValidated(center_id);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message:
          "Error fetching content center to be validated: " + error.message,
      });
  }
};

// Create center
controllers.createCenter = async (req, res) => {
  const { city, admin, officeImage } = req.body;
  // Validate inputs
  if (validator.isEmpty(city)) {
    return res
      .status(400)
      .json({ success: false, message: "City is required" });
  }
  if (!validator.isInt(admin.toString())) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid admin ID" });
  }
  if (validator.isEmpty(officeImage)) {
    return res
      .status(400)
      .json({ success: false, message: "Office image is required" });
  }
  try {
    await createCenter(city, admin, officeImage);
    res
      .status(201)
      .json({ success: true, message: "Center created successfully." });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error creating center: " + error.message,
      });
  }
};

// Delete center
controllers.deleteCenter = async (req, res) => {
  const { center_id } = req.params;
  // Validate Inputs
  if (!validator.isInt(center_id.toString())) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid center ID" });
  }
  try {
    await deleteCenter(center_id);
    res
      .status(200)
      .json({ success: true, message: "Center deleted successfully." });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error deleting center: " + error.message,
      });
  }
};

controllers.getCenters = async (req, res) => {
  try {
    const results = await getCenters();
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error fetching centers: " + error.message,
      });
  }
};

//WIP
controllers.makeCenterAdmin = async (req, res) => {
  try {
    const { office_id, admin_id } = req.params;
    //const results = await makeCenterAdmin(office_id, admin_id);
    const results = await spSetCenterAdmin(office_id, admin_id);
    res.status(200).json({ success: true, data: results });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error setting admin: " + error.message,
      });
  }
};

controllers.updateCenter = async (req, res) => {
  const { center_id } = req.params;
  const { city, officeImage } = req.body;
  // Validate inputs
  if (validator.isEmpty(city)) {
    return res
      .status(400)
      .json({ success: false, message: "City is required" });
  }

  try {
    await updateCenter(center_id, city, officeImage);
    res
      .status(201)
      .json({ success: true, message: "Center updated successfully." });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error updating center: " + error.message,
      });
  }
};



controllers.validate_user = async (req,res) => {
  const { user_id } = req.body;
  // Validate inputs
  if (!validator.isInt(user_id.toString())) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid User ID" });
  }
  if (validator.isEmpty(user_id) ) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });
  }

  try {
    await spActivateUser(user_id);
    res
      .status(201)
      .json({ success: true, message: "User validated successfully." });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error validating user: " + error.message,
      });
  }
}
controllers.deactivate_user = async (req,res) => {
  const { user_id } = req.body;
  // Validate inputs
  if (!validator.isInt(user_id.toString())) {
    return res
      .status(400)
      .json({ success: false, message: "Invalid User ID" });
  }
  if (validator.isEmpty(user_id) ) {
    return res
      .status(400)
      .json({ success: false, message: "User ID is required" });
  }

  try {
    await spDeactivateUser(user_id);
    res
      .status(201)
      .json({ success: true, message: "User deactivated successfully." });
  } catch (error) {
    res
      .status(500)
      .json({
        success: false,
        message: "Error deactivating user: " + error.message,
      });
  }
}


module.exports = controllers;
