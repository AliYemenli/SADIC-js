const {SlashCommandBuilder, EmbedBuilder,AttachmentBuilder} = require("discord.js");
const axios = require("axios");
const {openweatherKey}  = require("./../../config.json");




module.exports = {
    data: new SlashCommandBuilder()
        .setName("weather-forecast")
        .setDescription("Shows the current weather status of specified city. Default is Gönen ofc :).")
        .addStringOption(option =>
            option
                .setName("city")
                .setDescription("City option to specify")
        ),
    async execute(interaction)  {
        const city = interaction.options.getString("city") ?? "Gönen";
        await interaction.deferReply("Checking the weather...");
        let config = {
            method: 'get',
            url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openweatherKey}&units=metric`,
        };
        axios.request(config)
        .then((response) => {
            const data = response.data;
            const embed = new EmbedBuilder()
                .setColor(0x00099FF)
                .setTitle(`Weather Forecast for ${city}`)
                .setAuthor({name: "SADIC", iconURL: "https://e7.pngegg.com/pngimages/946/208/png-clipart-family-guy-video-game-chris-griffin-brian-griffin-mort-goldman-stewie-griffin-family-guy-television-mammal.png" })
                .setThumbnail(`https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`)
                .addFields(
                    {name: "General" , value: `${data.weather[0].description}` },
                    { name: '\u200B', value: '\u200B' },
                    {name: "Tempature" , value: `${data.main.temp}`, inline: true },
                    {name: "Feels Like" , value: `${data.main.feels_like}`, inline: true },
                    {name: "Humidity" , value: `${data.main.humidity}`, inline: true },
                )
                .setImage("attachment://forecast.png")
                .setTimestamp();
            interaction.followUp({embeds: [embed], files: [new AttachmentBuilder('./icons/forecast/forecast.png')]});
        })
        .catch((error) => {
            interaction.followUp(`Something went wrong in the background :/, \n error: ${error}`);
        });

        
        
    }
};
