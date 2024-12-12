const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('asignarol')
		.setDescription('Asigna un rol a un usuario.')
		.addUserOption(option =>
			option.setName('usuario')
				.setDescription('El usuario al que deseas asignar el rol.')
				.setRequired(true))
		.addRoleOption(option =>
			option.setName('rol')
				.setDescription('El rol que deseas asignar.')
				.setRequired(true)),
	async execute(interaction) {
		// Verifica si el usuario tiene permisos para gestionar roles
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
			return interaction.reply({
				content: 'No tienes permisos para asignar roles.',
				ephemeral: true,
			});
		}

		// Obtén los datos del comando
		const usuario = interaction.options.getMember('usuario');
		const rol = interaction.options.getRole('rol');

		// Verifica si el rol es asignable
		if (rol.position >= interaction.guild.members.me.roles.highest.position) {
			return interaction.reply({
				content: 'No puedo asignar este rol porque está por encima de mi posición en la jerarquía.',
				ephemeral: true,
			});
		}

		try {
			// Asigna el rol al usuario
			await usuario.roles.add(rol);
			await interaction.reply(`Rol **${rol.name}** asignado exitosamente a ${usuario.user.tag}.`);
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: 'Hubo un error al asignar el rol.',
				ephemeral: true,
			});
		}
	},
};
