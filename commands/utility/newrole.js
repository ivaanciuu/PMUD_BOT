const { SlashCommandBuilder, PermissionsBitField } = require('discord.js');

module.exports = {
	data: new SlashCommandBuilder()
		.setName('newrol')
		.setDescription('Crea un nuevo rol en el servidor.')
		.addStringOption(option =>
			option.setName('nombre')
				.setDescription('El nombre del rol.')
				.setRequired(true))
		.addStringOption(option =>
			option.setName('color')
				.setDescription('El color del rol en formato HEX (#RRGGBB), opcional.')
				.setRequired(false)),
	async execute(interaction) {
		// Verifica si el usuario tiene permisos para gestionar roles
		if (!interaction.member.permissions.has(PermissionsBitField.Flags.ManageRoles)) {
			return interaction.reply({
				content: 'No tienes permisos para crear roles.',
				ephemeral: true,
			});
		}

		// Obtén los datos del comando
		const nombre = interaction.options.getString('nombre');
		const color = interaction.options.getString('color') || '#FFFFFF'; // Blanco como predeterminado

		// Valida el color si se proporciona
		if (color && !/^#([0-9A-F]{3}){1,2}$/i.test(color)) {
			return interaction.reply({
				content: 'Por favor, proporciona un color válido en formato HEX (#RRGGBB).',
				ephemeral: true,
			});
		}

		try {
			// Crea el rol en el servidor
			const rol = await interaction.guild.roles.create({
				name: nombre,
				color: color,
				reason: `Rol creado por ${interaction.user.tag}`,
			});

			await interaction.reply(`Rol **${rol.name}** creado exitosamente con el color ${rol.color}.`);
		} catch (error) {
			console.error(error);
			await interaction.reply({
				content: 'Hubo un error al crear el rol.',
				ephemeral: true,
			});
		}
	},
};
