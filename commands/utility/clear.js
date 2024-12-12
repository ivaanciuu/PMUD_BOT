const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('clear')
		.setDescription('Limpia un número específico de mensajes en el canal actual.')
		.addIntegerOption(option =>
			option.setName('cantidad')
				.setDescription('Número de mensajes a borrar (máximo 100).')
				.setRequired(true)),
	async execute(interaction) {
		const cantidad = interaction.options.getInteger('cantidad');

		// Verifica si la cantidad está en el rango permitido
		if (cantidad < 1 || cantidad > 100) {
			return interaction.reply({
				content: 'Por favor, ingresa un número entre 1 y 100.',
				ephemeral: true,
			});
		}

		// Verifica permisos
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageMessages)) {
			return interaction.reply({
				content: 'No tienes permisos para gestionar mensajes.',
				ephemeral: true,
			});
		}

		try {
			// Borra los mensajes
			const messages = await interaction.channel.bulkDelete(cantidad, true);
			await interaction.reply({
				content: `Se han borrado ${messages.size} mensajes.`,
				ephemeral: true,
			});
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: 'Hubo un error al intentar borrar los mensajes.',
				ephemeral: true,
			});
		}
	},
};
