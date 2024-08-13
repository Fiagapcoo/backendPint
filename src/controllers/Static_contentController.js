const { spCreateCategory,spCreateSubArea } = require('../database/logic_objects/categoryProcedures');
const db = require('../models');
const { QueryTypes } = require("sequelize");
const controllers = {};

controllers.create_category = async (req, res) => {
    const { title, icon } = req.body; 
    try {
        await spCreateCategory(title, icon);
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
        res.status(500).json({success:false, message:'Error creating category: ' + error.message});
    }
};


controllers.get_all_areas = async (req, res) => {
    try {
        const areas = await db.sequelize.query(
            `SELECT * FROM "static_content"."area"`,
            { 
                type: QueryTypes.SELECT 
            }
    );
        res.status(200).json({success:true, data: areas });
    } catch (error) {
        console.log('WTF IS WRONG: ' + error);
        res.status(500).json({success:false, message:'Error retrieving content: ' + error.message});
    }
};

controllers.get_all_sub_areas = async (req, res) => {
    try {
        const sub_areas = await db.sequelize.query(
            `SELECT * FROM "static_content"."sub_area"`,
            { 
                type: QueryTypes.SELECT 
            }
    );
        res.status(200).json({success:true, data: sub_areas });
    } catch (error) {
        console.log('WTF IS WRONG V2: ' + error);
        res.status(500).json({success:true, message:'Error retrieving content: ' + error.message});
    }
};

controllers.update_category = async (req, res) => {
    const {title, icon } = req.body;
    const { categoryID } = req.params;

    try {
        await db.sequelize.query(
            `UPDATE "static_content"."area" 
             SET 
                title = COALESCE(:title, title), 
                icon_name = COALESCE(:icon, icon_name) 
             WHERE area_id = :categoryID`,
            { 
                replacements: {
                    categoryID,
                    title: title !== undefined ? title : null,
                    icon: icon !== undefined ? icon : null,
                },
                type: QueryTypes.UPDATE 
            }
        );
        res.status(200).json({success:true, message:'Category updated successfully.'});
    } catch (error) {
        res.status(500).json({success:false, message:'Error updating category: ' + error.message});
    }
};


module.exports = controllers;
