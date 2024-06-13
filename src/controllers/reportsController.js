const ReportModel = require('../models/reports');
const UserModel = require('../models/users');
const CommentModel = require('../models/comment');

const ReportsController = {};

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
