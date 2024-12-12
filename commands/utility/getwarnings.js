const { SlashCommandBuilder } = require('discord.js');
const { getWarnings } = require('./warnings.js'); // Importamos la función para obtener las advertencias

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warnings')
		.setDescription('Muestra las advertencias de un usuario.')
		.addUserOption(option =>
			option.setName('usuario')
				.setDescription('El usuario del que deseas ver las advertencias.')
				.setRequired(true)),
	async execute(interaction) {
		const user = interaction.options.getUser('usuario');

		const userWarnings = getWarnings(user.id);
		if (userWarnings.length === 0) {
			return interaction.reply({
				content: `${user.username} no tiene advertencias.`,
				ephemeral: true,
			});
		}

		const warningList = userWarnings
			.map((warn, index) => `**${index + 1}.** Razón: ${warn.reason}\nFecha: ${warn.date.toLocaleString()}\nPor: ${warn.by}`)
			.join('\n\n');

		await interaction.reply({
			content: `Advertencias de ${user.username}:\n\n${warningList}`,
			ephemeral: true,
		});
	},
};
