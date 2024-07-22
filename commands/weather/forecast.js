const {SlashCommandBuilder} = require("discord.js");
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
        let config = {
            method: 'get',
            url: `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${openweatherKey}&units=metric`,
        };
        axios.request(config)
        .then((response) => {
            const data = response.data;
            interaction.reply(`Here is the weather forecast for ${city}:\n
            General: ${data.weather[0].description},\n
            Tempature: ${data.main.temp},\n
            Feels Like: ${data.main.feels_like},\n
            Humidity: ${data.main.humidity},\n
                `)
        })
        .catch((error) => {-
            interaction.reply(`Something went wrong in the background :/, error: ${error}`);
        });
    }
};
