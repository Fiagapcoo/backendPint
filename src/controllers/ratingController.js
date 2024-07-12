const { spInsertEvaluation,
        //trgUpdateAverageScore
  } = require('../database/logic_objects/generalHelpers');

const controllers = {};

controllers.add_evaluation = async (req, res) => { //Only "Post" and "Event" for contentType
    const { contentType, contentId } = req.params; 
    const {criticId, evaluation } = req.body;
    console.log(req.query);
    try {
        await spInsertEvaluation(contentType, contentId, criticId, evaluation);

        //await trgUpdateAverageScore(evaluation);

        res.status(201).json({success:ture ,message:'Eval added successfully.'});
    } catch (error) {
        res.status(500).json({success:false, message:'Error adding eval: ' + error.message});
    }
};




module.exports = controllers;
