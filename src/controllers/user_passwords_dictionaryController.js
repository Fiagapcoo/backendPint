const user_passwords_dictionaryModel  = require('../models/user_passwords_dictionary');
const userModel = require('../models/users');
const user_passwords_dictionaryController = {};


user_passwords_dictionaryController.list = async (req, res) => {
    try {
        const user_passwords_dictionary = await user_passwords_dictionaryModel.findAll(
            {
                include: {
                    model: userModel,
                    required: true
                }
            }

        );
        res.json(user_passwords_dictionary);
    } catch (error) {
        res.status(400).send('Error retrieving user_passwords_dictionary');
    }
}

user_passwords_dictionaryController.get = async (req, res) => {
    try {
        const { id } = req.params;
        const user_passwords_dictionary = await user_passwords_dictionaryModel.findByPk(id
            ,{
                include: {
                    model: userModel,
                    required: true
                }
            }
        );
        if (user_passwords_dictionary) {
            res.json(user_passwords_dictionary);
        } else {
            res.status(404).send('user_passwords_dictionary not found');
        }
    } catch (error) {
        res.status(400).send('Error retrieving user_passwords_dictionary');
    }
}

user_passwords_dictionaryController.update = async (req, res) => {
    try {
        const { id } = req.params;
        const [updated] = await user_passwords_dictionaryModel.update(req.body, {
            where: { id: id }
        });
        if (updated) {
            const updateduser_passwords_dictionary = await user_passwords_dictionaryModel.findByPk(id);
            res.json(updateduser_passwords_dictionary);
        } else {
            res.status(404).send('user_passwords_dictionary not found');
        }
    } catch (error) {
        res.status(400).send('Error updating user_passwords_dictionary');
    }
}

module.exports = user_passwords_dictionaryController;