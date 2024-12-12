const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('expulsar')
		.setDescription('Expulsa a un usuario del servidor.')
		.addUserOption(option =>
			option.setName('usuario')
				.setDescription('El usuario que deseas expulsar.')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('razón')
				.setDescription('Razón de la expulsión.')
				.setRequired(false)),
	async execute(interaction) {
		// Comprobamos permisos del ejecutor
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.KickMembers)) {
			return interaction.reply({ content: 'No tienes permisos para expulsar usuarios.', ephemeral: true });
		}

		// Recogemos el usuario y la razón
		const user = interaction.options.getUser('usuario');
		const reason = interaction.options.getString('razón') || 'No se ha proporcionado una razón.';

		// Intentamos obtener el miembro del servidor
		const member = interaction.guild.members.cache.get(user.id);
		if (!member) {
			return interaction.reply({ content: 'No se pudo encontrar al usuario en el servidor.', ephemeral: true });
		}

		// Evitamos expulsar administradores o bots importantes
		if (member.permissions.has(PermissionsBitField.Flags.Administrator)) {
			return interaction.reply({ content: 'No puedes expulsar a este usuario porque es administrador.', ephemeral: true });
		}

		try {
			// Expulsamos al usuario
			await member.kick(reason);
			await interaction.reply(`👢 **${user.tag}** ha sido expulsado del servidor.\n**Razón:** ${reason}`);
		} catch (error) {
			console.error('Error al intentar expulsar al usuario:', error);
			await interaction.reply({ content: 'Hubo un problema al intentar expulsar a este usuario.', ephemeral: true });
		}
	},
};
