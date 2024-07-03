const {SlashCommandBuilder, isEquatable} =require("discord.js");
const { execute } = require("./user");


module.exports = {
    data: new SlashCommandBuilder()
        .setName("server")
        .setDescription("shows the infos about current guild"),
    async execute(interaction)  {
        await interaction.reply(`This server's name is ${interaction.guild.name} and has ${interaction.guild.memberCount}`);
    },
};