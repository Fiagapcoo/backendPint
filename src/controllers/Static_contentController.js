const { spCreateCategory,spCreateSubArea } = require('../database/logic_objects/categoryProcedures');
const db = require('../models');
const controllers = {};

controllers.create_category = async (req, res) => {
    const { title } = req.body; 
    try {
        await spCreateCategory(title);
        res.status(201).json({success:true, message:'Category created successfully.'});
    } catch (error) {
        res.status(500).json({success:false, message:'Error creating category: ' + error.message});
    }
};

controllers.create_sub_category = async (req, res) => {
    const { areaId,title } = req.body; 
    try {
        await spCreateSubArea(areaId, title);
        res.status(201).json({success:true, message:'Category created successfully.'});
    } catch (error) {
        res.status(500).json({success:true, message:'Error creating category: ' + error.message});
    }
};


controllers.get_all_areas = async (req, res) => {
    try {
        const areas = await db.Area.findAll({ order: [['area_id']] });
        res.status(200).json({success:true, data:posts });
    } catch (error) {
        res.status(500).json({success:false, message:'Error retrieving content: ' + error.message});
    }
};

controllers.get_all_sub_areas = async (req, res) => {
    try {
        const sub_areas = await db.SubArea.findAll({ order: [['sub_area_id']] });
        res.status(200).json({success:true, data: posts });
    } catch (error) {
        res.status(500).json({success:true, message:'Error retrieving content: ' + error.message});
    }
};

module.exports = controllers;
