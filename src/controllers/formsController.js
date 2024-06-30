const { addCustomFieldsToEventForm,
    createEventForm,
    editEventFormField,
    getFormSchema,
    getFormSchemaAsJson,
    insertFormAnswer,
    insertFormAnswers,
    deleteEventFormField
                        } = require('../database/logic_objects/formsProcedures');

const controllers = {};

//to create a new form for a new event
controllers.create_event_form = async (req, res) => { 
    const { eventID, customFieldsJson } = req.body; 
    console.log(req.body);
    try {
        await createEventForm(eventID, customFieldsJson);

        res.status(201).json({success:true, message:'Form for event created successfully.'});
    } catch (error) {
        res.status(500).json({success:false, message:'Error creating form: ' + error.message});
}
};

//to add more fields to a form while event isnt approved
controllers.add_fields_event_form = async (req, res) => { 
    const { eventID, customFieldsJson } = req.body; 
    console.log(req.body);
    try {
        await addCustomFieldsToEventForm(eventID, customFieldsJson) ;

        res.status(201).json({success:true, message:'Form fields added successfully.'});
    } catch (error) {
        res.status(500).json({success:false, message:'Error adding fields to form: ' + error.message});
}
};

// to edit already existing fields of a form
controllers.edit_fields_event_form = async (req, res) => { 
    const { eventID, fieldID } = req.params; 
    const { fieldName = null, fieldType = null, fieldValue = null, maxValue = null, minValue = null } = req.body; 
    console.log(req.query);
    try {
        await editEventFormField(eventID, fieldID,  fieldName, fieldType, fieldValue, maxValue, minValue ) ;

        res.status(201).json({success:true, message:'Form fields edited successfully.'});
    } catch (error) {
        res.status(500).json({success:false, message:'Error editing form fields: ' + error.message});
}
};

//get raw form 
controllers.get_event_form = async (req, res) => { 
    const { eventID } = req.params; 
    console.log(req.params);
    try {
        const form = await getFormSchema(eventID) ;

        res.status(201).json({success:true, message:'Got form successfully.', data: form});
    } catch (error) {
        res.status(500).json({success:false, message:'Error getting form: ' + error.message});
}
};

//get form as json
controllers.get_event_json_form = async (req, res) => { 
    const { eventID } = req.params; 
    console.log(req.params);
    try {
        const json_form = await getFormSchemaAsJson(eventID) ;

        res.status(201).json({success:true, message:'Got JSON form successfully.', data: json_form});
    } catch (error) {
        res.status(500).json({success:false, message:'Error getting form: ' + error.message});
}
};

//insert answer to field
controllers.add_answer = async (req, res) => { 
    const { userID, eventID } = req.params; 
    const { fieldID, answer } = req.body; 
    console.log(req.query);
    try {
        await insertFormAnswer(userID, eventID, fieldID, answer) ;

        res.status(201).json({success:true, message:'Added answer to form field.'});
    } catch (error) {
        res.status(500).json({success:false, message:'Error adding answer: ' + error.message});
}
};
//insert answers to form
controllers.add_answers = async (req, res) => { 
    const { userID, eventID } = req.params; 
    const { answersJson } = req.body; 
    console.log(req.query);
    try {
        await insertFormAnswers(userID, eventID, answersJson) ;

        res.status(201).json({success:true, message:'Added answers to form.'});
    } catch (error) {
        res.status(500).json({success:false, message:'Error adding answers: ' + error.message});
}
};

//delete fields from form
controllers.delete_field_from_form = async (req, res) => { 
    const { eventID, fieldID } = req.params; 
    console.log(req.params);
    try {
        await deleteEventFormField(eventID, fieldID) ;

        res.status(201).json({success:true, message:'Deleted form field successfully.'});
    } catch (error) {
        res.status(500).json({success:false, message:'Error deleting field from form: ' + error.message});
}
};

module.exports = controllers;