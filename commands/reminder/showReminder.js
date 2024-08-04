const {SlashCommandBuilder,EmbedBuilder,AttachmentBuilder}  = require("discord.js");
const appRoot = require("app-root-path");
const ReminderSchema = require(appRoot + "/models/reminder.js");

module.exports = {
    data: new SlashCommandBuilder()
        .setName("show-reminders")
        .setDescription("Shows the reminders that you set before."),
    async execute(interaction) {
        await interaction.deferReply("Getting your precious reminders...");
        const userData = await ReminderSchema.find({user: interaction.user.id});
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
                for(data of returnedSchema.reminders)  {
                    embed.addFields(
                        {name: `${data.text}`, value: new Date(data.time).toUTCString()}
                    )
                }
            }
            
            await interaction.followUp({embeds: [embed], files: [new AttachmentBuilder('./icons/reminder/monkey.png')]});
            
        } catch(error)  {
            console.log(error);
            interaction.followUp("SADIC is not feeling OK today...");
        }        
    }
};