const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('parla') // Nombre del comando
		.setDescription('Desmutea a un usuario.') // Descripción del comando
		.addUserOption(option =>
			option.setName('usuario')
				.setDescription('El usuario que deseas desmutear')
				.setRequired(true)),
	async execute(interaction) {
		const user = interaction.options.getUser('usuario');

		// Intenta obtener el miembro desde la caché
		let member = interaction.guild.members.cache.get(user.id);

		// Si no está en la caché, intenta obtenerlo desde la API
		if (!member) {
			try {
				member = await interaction.guild.members.fetch(user.id);
			} catch (error) {
				console.error(error);
				return interaction.reply({
					content: 'No pude encontrar al usuario especificado en este servidor.',
					ephemeral: true,
				});
			}
		}

		// Verifica si el bot tiene permisos
		if (!interaction.guild.members.me.permissions.has(PermissionsBitField.Flags.MuteMembers)) {
			return interaction.reply({
				content: 'No tengo permisos para desmutear a los usuarios.',
				ephemeral: true,
			});
		}

		// Verifica si el miembro puede ser desmuteado
		if (!member.manageable || member.permissions.has(PermissionsBitField.Flags.Administrator)) {
			return interaction.reply({
				content: 'No puedo desmutear a este usuario.',
				ephemeral: true,
			});
		}

		try {
			// Desmutea al usuario
			await member.voice.setMute(false, `Desmuteado por ${interaction.user.tag}`);
			await interaction.reply(`${user.username} ha sido desmuteado.`);
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: 'Hubo un error al intentar desmutear al usuario.',
				ephemeral: true,
			});
		}
	},
};
