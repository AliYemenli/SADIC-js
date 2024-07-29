const {SlashCommandBuilder, time} = require("discord.js");
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
        const userText = interaction.options.getString("text");
        const dateInput = interaction.options.getString("date");
        const isPersonal = interaction.options.getBoolean("personal") || false;

        //#region Date Check 
        const date = moment(dateInput, "HH:mm DD-MM-YYYY");
        if(!date.isValid())  {
            return interaction.reply({content:"Invalid date format. Please use HH:mm DD-MM-YYYY.",ephemeral: isPersonal});
        }

        const now = moment();
        const duration = moment.duration(date.diff(now));

        if(duration.asMilliseconds() <= 0) {
            return interaction.reply({content:"We are not in Interstellar. Give me a future date :|", ephemeral: isPersonal});
        }
        //#endregion

        try {
            let userReminder = await ReminderSchema.findOne({user: interaction.user.id});
            if(userReminder)  {
                userReminder.reminders.push({
                    text: userText,
                    time: date,
                    isPersonal: isPersonal
                });
                await userReminder.save();
            } else {
                await ReminderSchema.create({
                    user: interaction.user.id,
                    userName: interaction.user.username,
                    reminders:  [{
                        text: userText,
                        time: date,
                        isPersonal: isPersonal
                    }]
                });
            }
            interaction.reply({content:`Your reminder has been set to ${date}`, ephemeral: isPersonal});
        } catch (error) {
            interaction.reply({content:"Oopsiee! I forgot to say that I have Alzheimers :)", ephemeral: isPersonal});
        }
    }
};
