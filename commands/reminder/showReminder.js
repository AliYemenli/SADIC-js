const {SlashCommandBuilder}  = require("discord.js");
const appRoot = require("app-root-path");
const { listIndexes } = require("../../models/reminder");
const ReminderSchema = require(appRoot + "/models/reminder.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("show-reminders")
        .setDescription("Shows the reminders that you set before."),
    async execute(interaction) {
        interaction.reply("Getting your precious reminders...");
        const userData = await ReminderSchema.findOne({user: interaction.user.id});
        if(!userData) {
            return interaction.reply("You have nothing to be reminded, find a job");
        }
        try{
            for(data of userData.reminders) {
                interaction.followUp({content:`Topic: ${data.text} \n Time to Remind: ${data.time}`, ephemeral: data.isPersonal});
            }
        } catch(error)  {
            console.log(error);
        }

    }
};