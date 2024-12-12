const { SlashCommandBuilder } = require('discord.js');
const { addWarning } = require('./warnings.js'); // Importamos la función para manejar las advertencias

module.exports = {
	data: new SlashCommandBuilder()
		.setName('warn')
		.setDescription('Advierte a un usuario.')
		.addUserOption(option =>
			option.setName('usuario')
				.setDescription('El usuario al que deseas advertir.')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('razón')
				.setDescription('La razón de la advertencia.')
				.setRequired(false)),
	async execute(interaction) {
		const user = interaction.options.getUser('usuario');
		const reason = interaction.options.getString('razón') || 'Sin especificar';

		const member = interaction.guild.members.cache.get(user.id);
		if (!member) {
			return interaction.reply({
				content: 'No puedo advertir a un usuario que no está en este servidor.',
				ephemeral: true,
			});
		}

		addWarning(user.id, { reason, date: new Date(), by: interaction.user.tag });

		await interaction.reply(`${user.username} ha sido advertido. Razón: ${reason}`);
	},
};
