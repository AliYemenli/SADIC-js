const {SlashCommandBuilder} = require("discord.js");
const moment = require("moment");
let appRoot = require("app-root-path");
var ReminderSchema = require(appRoot + "/models/reminder.js");



module.exports = {
    data: new SlashCommandBuilder()
        .setName("set-reminder")
        .setDescription("Helps to set a reminder for your very important(!) task.")
        .addStringOption(option =>
            option
                .setName("text")
                .setDescription("The task that will be reminded.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("date")
                .setDescription("Date to be reminded. (HH:mm DD-MM-YYYY)")
                .setRequired(true)
        )
        .addBooleanOption(option => 
            option
                .setName("personal")
                .setDescription("If its personal, bot will only remind you. Default is false.")
        ),
    async execute(interaction) {
        const text = interaction.options.getString("text");
        const dateInput = interaction.options.getString("date");
        const isPersonal = interaction.options.getBoolean("personal") || false;

        //#region Date Check 
        const date = moment(dateInput, "HH:mm DD-MM-YYYY");
        if(!date.isValid())  {
            interaction.reply("Invalid date format. Please use HH:mm DD-MM-YYYY.");
        }

        const now = moment();
        const duration = moment.duration(date.diff(now));

        if(duration.asMilliseconds() <= 0) {
            interaction.reply("We are not in Interstellar. Give me a future date :|");
        }
        //#endregion


    }
};
