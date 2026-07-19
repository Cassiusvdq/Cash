import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';
import { handleInteractionError } from '../../utils/errorHandler.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

// Brainrot exist counts
// Change these numbers whenever you want to update the counts.
const brainrots = {
  "Los Sekolahs": 5000,
  "Chillin Chilli": 2500,
  "Cash": 1000,
  "Cupid": 750,
};

export default {
  data: new SlashCommandBuilder()
    .setName("exists")
    .setDescription("Check how many of a brainrot exist")
    .addStringOption(option =>
      option
        .setName("brainrot")
        .setDescription("Enter the name of the brainrot")
        .setRequired(true)
        .setAutocomplete(true)
    ),

  async execute(interaction) {
    try {
      const deferSuccess = await InteractionHelper.safeDefer(interaction);

      if (!deferSuccess) {
        logger.warn(`Exists interaction defer failed`, {
          userId: interaction.user.id,
          guildId: interaction.guildId,
          commandName: 'exists'
        });
        return;
      }

      const brainrotName = interaction.options.getString("brainrot");
      const count = brainrots[brainrotName];

      if (count === undefined) {
        return await InteractionHelper.safeEditReply(interaction, {
          content: `❌ I couldn't find a brainrot called **${brainrotName}**.`,
        });
      }

      const embed = createEmbed({
        title: `🧠 ${brainrotName}`,
        description: `**Exist Count:** ${count.toLocaleString()}`,
      });

      await InteractionHelper.safeEditReply(interaction, {
        embeds: [embed],
      });

      logger.info(`Exists command executed`, {
        userId: interaction.user.id,
        guildId: interaction.guildId,
        brainrotName,
        count,
      });

    } catch (error) {
      logger.error(`Exists command execution failed`, {
        error: error.message,
        stack: error.stack,
        userId: interaction.user.id,
        guildId: interaction.guildId,
        commandName: 'exists'
      });

      await handleInteractionError(interaction, error, {
        commandName: 'exists',
        source: 'exists_command'
      });
    }
  },

  async autocomplete(interaction) {
    const focusedValue = interaction.options.getFocused().toLowerCase();

    const choices = Object.keys(brainrots);

    const filtered = choices
      .filter(name => name.toLowerCase().includes(focusedValue))
      .slice(0, 25);

    await interaction.respond(
      filtered.map(name => ({
        name,
        value: name,
      }))
    );
  },
};
