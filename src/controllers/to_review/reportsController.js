const ReportModel = require('../models/reports');
const UserModel = require('../models/users');
const CommentModel = require('../models/comment');

const ReportsController = {};

/**
 * @description Creates a new report record in the database.
 * 
 * This function uses Sequelize's `create` method to add a new report 
 * to the 'Reports' table. It takes the report data from the request body. 
 * If the operation is successful, a success message and the newly created 
 * report data are returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function createReport
 * @route {POST} /reports/create
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.body - The body of the request containing report data.
 * @param {number} req.body.REPORTER_ID - The ID of the reporter.
 * @param {number} req.body.COMMENT_ID - The ID of the comment being reported.
 * @param {string} req.body.OBSERVATION - The observation or reason for the report.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ReportsController.createReport = async (req, res) => {
    const { REPORTER_ID, COMMENT_ID, OBSERVATION } = req.body;
    try {
        const newReport = await ReportModel.create({
            REPORTER_ID,
            COMMENT_ID,
            OBSERVATION
        });
        res.status(201).json(newReport);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves all reports from the database.
 * 
 * This function uses Sequelize's `findAll` method to fetch all reports 
 * from the 'Reports' table, including associated user and comment information. 
 * The result is returned as a JSON response. In case of an error, an error message 
 * is returned with HTTP status 500.
 * 
 * @async
 * @function getAllReports
 * @route {GET} /reports
 * @param {Object} req - The HTTP request object.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ReportsController.getAllReports = async (req, res) => {
    try {
        const reports = await ReportModel.findAll({
            include: [
                {
                    model: UserModel,
                    attributes: ['USER_ID']
                },
                {
                    model: CommentModel,
                    attributes: ['COMMENT_ID']
                }
            ]
        });
        res.status(200).json(reports);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Retrieves a specific report by its ID from the database.
 * 
 * This function uses Sequelize's `findOne` method to fetch a specific report 
 * from the 'Reports' table by its ID, including associated user and comment information. 
 * The result is returned as a JSON response. In case of an error, an error message 
 * is returned with HTTP status 500.
 * 
 * @async
 * @function getReportById
 * @route {GET} /reports/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the report.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ReportsController.getReportById = async (req, res) => {
    const { id } = req.params;
    try {
        const report = await ReportModel.findOne({
            where: {
                REPORT_ID: id
            },
            include: [
                {
                    model: UserModel,
                    attributes: ['USER_ID']
                },
                {
                    model: CommentModel,
                    attributes: ['COMMENT_ID']
                }
            ]
        });
        res.status(200).json(report);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Updates an existing report record in the database.
 * 
 * This function uses Sequelize's `update` method to modify an existing report 
 * in the 'Reports' table. It takes the report data from the request body 
 * and the ID of the report from the URL parameters. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function updateReport
 * @route {PUT} /reports/update/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the report.
 * @param {Object} req.body - The body of the request containing report data.
 * @param {number} req.body.REPORTER_ID - The ID of the reporter.
 * @param {number} req.body.COMMENT_ID - The ID of the comment being reported.
 * @param {string} req.body.OBSERVATION - The observation or reason for the report.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ReportsController.updateReport = async (req, res) => {
    const { id } = req.params;
    const { REPORTER_ID, COMMENT_ID, OBSERVATION } = req.body;
    try {
        await ReportModel.update({
            REPORTER_ID,
            COMMENT_ID,
            OBSERVATION
        }, {
            where: {
                REPORT_ID: id
            }
        });
        res.status(200).json({ message: 'Report updated successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

/**
 * @description Deletes a report record from the database by its ID.
 * 
 * This function uses Sequelize's `destroy` method to remove a report 
 * from the 'Reports' table by its ID. If the operation is successful, 
 * a success message is returned as a JSON response. In case of an error, 
 * an error message is returned with HTTP status 500.
 * 
 * @async
 * @function deleteReport
 * @route {DELETE} /reports/delete/:id
 * @param {Object} req - The HTTP request object.
 * @param {Object} req.params - The URL parameters.
 * @param {number} req.params.id - The ID of the report.
 * @param {Object} res - The HTTP response object.
 * @returns {Promise<void>} A promise that resolves with no return value.
 */
ReportsController.deleteReport = async (req, res) => {
    const { id } = req.params;
    try {
        await ReportModel.destroy({
            where: {
                REPORT_ID: id
            }
        });
        res.status(200).json({ message: 'Report deleted successfully' });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

module.exports = ReportsController;
