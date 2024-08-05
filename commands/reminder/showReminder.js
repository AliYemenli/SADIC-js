const {SlashCommandBuilder,EmbedBuilder,AttachmentBuilder}  = require("discord.js");
const appRoot = require("app-root-path");
const { data } = require("./setReminder");
const ReminderSchema = require(appRoot + "/models/reminder.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("show-reminders")
        .setDescription("Shows the reminders that you set before.")
        .addBooleanOption(option =>
            option
                .setName("get-personal")
                .setDescription("Pick true if you want to get your personal reminders, default is false")
        ),
    async execute(interaction) {
        await interaction.deferReply("Getting your precious reminders...");
        const userData = await ReminderSchema.find({user: interaction.user.id});
        var showPersonal = interaction.options.getBoolean("get-personal") || false;
        if(userData.length === 0) {
            return interaction.followUp("You have nothing to be reminded, find a job");
        }

        const embed = new EmbedBuilder()
                .setColor(0x00099FF)
                .setTitle(`List of your reminders`)
                .setAuthor({name: "SADIC", iconURL: "https://upload.wikimedia.org/wikipedia/en/6/67/Herbert_-_Family_Guy.png" })
                .setImage("attachment://monkey.png")
                .setTimestamp();

        try{
            for(returnedSchema of userData) {
                for(let data of returnedSchema.reminders)  {
                    if(data.isPersonal == showPersonal){
                        embed.addFields(
                            {name: `${data.text}`, value: new Date(data.time).toUTCString()}
                        )
                    }
                }
            }
            
            await interaction.followUp({embeds: [embed], files: [new AttachmentBuilder('./icons/reminder/monkey.png')], ephemeral: showPersonal});
            
        } catch(error)  {
            console.log(error);
            interaction.followUp("SADIC is not feeling OK today...");
        }        
    }
};