const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('treurol')
		.setDescription('Quita un rol a un usuario.')
		.addUserOption(option =>
			option.setName('usuario')
				.setDescription('El usuario al que deseas quitar el rol.')
				.setRequired(true))
		.addRoleOption(option =>
			option.setName('rol')
				.setDescription('El rol que deseas quitar.')
				.setRequired(true)),
	async execute(interaction) {
		// Verifica si el usuario tiene permisos para gestionar roles
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
			return interaction.reply({
				content: 'No tienes permisos para desasignar roles.',
				ephemeral: true,
			});
		}

		// Obtén los datos del comando
		const usuario = interaction.options.getMember('usuario');
		const rol = interaction.options.getRole('rol');

		// Verifica si el rol es manejable
		if (rol.position >= interaction.guild.members.me.roles.highest.position) {
			return interaction.reply({
				content: 'No puedo quitar este rol porque está por encima de mi posición en la jerarquía.',
				ephemeral: true,
			});
		}

		try {
			// Quita el rol al usuario
			await usuario.roles.remove(rol);
			await interaction.reply(`El rol **${rol.name}** ha sido quitado a ${usuario.user.tag}.`);
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: 'Hubo un error al intentar quitar el rol.',
				ephemeral: true,
			});
		}
	},
};
