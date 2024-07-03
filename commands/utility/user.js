const {SlashCommandBuilder} = require("discord.js");
const { execute } = require("./ping");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("user")
        .setDescription("Provides info about user"),
    async execute(interaction)  {
        // interaction.user  => returns the user who ran the command
        // interaction.member => GuildMember (Guild stands for server in this library), returns user in the specific guild
        await interaction.reply(`this command was run by ${interaction.user.username} who joined on ${interaction.member.joinedAt}`);
    },
};

