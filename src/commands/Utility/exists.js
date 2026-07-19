import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';
import { handleInteractionError } from '../../utils/errorHandler.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

// ==========================================
// BRAINROT DATA
// Add or edit brainrots here.
// ==========================================

const brainrots = {
  "Los Sekolahs": {
    exists: 5000,
    rarity: "Secret",
    income: "12/s",
    image: null,
    mutations: {
      galaxy: 48,
      gold: 33,
      diamond: 19,
      rainbow: 16,
      divine: 1,
    },
  },

  "Chillin Chilli": {
    exists: 2500,
    rarity: "Secret",
    income: "10/s",
    image: null,
    mutations: {
      galaxy: 0,
      gold: 0,
      diamond: 0,
      rainbow: 0,
      divine: 0,
    },
  },

// ==========================================
// SLASH COMMAND
// ==========================================

export default {
  data: new SlashCommandBuilder()
    .setName("exists")
    .setDescription("Check the exist count of a brainrot")
    .addStringOption(option =>
      option
        .setName("brainrot")
        .setDescription("Select a brainrot")
        .setRequired(true)
        .setAutocomplete(true)
    ),

  // ========================================
  // COMMAND EXECUTION
  // ========================================

  async execute(interaction) {
    try {
      const deferSuccess = await InteractionHelper.safeDefer(interaction);

      if (!deferSuccess) {
        logger.warn(`Exists interaction defer failed`, {
          userId: interaction.user.id,
          guildId: interaction.guildId,
          commandName: 'exists',
        });
        return;
      }

      const brainrotName = interaction.options.getString("brainrot");
      const brainrot = brainrots[brainrotName];

      // Brainrot not found
      if (!brainrot) {
        return await InteractionHelper.safeEditReply(interaction, {
          content: `❌ I couldn't find a brainrot called **${brainrotName}**.`,
        });
      }

      // ======================================
      // MUTATION DISPLAY
      // ======================================

      const mutationLines = [
        `🟣 **Galaxy:** ${brainrot.mutations.galaxy.toLocaleString()}`,
        `🟡 **Gold:** ${brainrot.mutations.gold.toLocaleString()}`,
        `🔷 **Diamond:** ${brainrot.mutations.diamond.toLocaleString()}`,
        `🌈 **Rainbow:** ${brainrot.mutations.rainbow.toLocaleString()}`,
        `🔶 **Divine:** ${brainrot.mutations.divine.toLocaleString()}`,
      ].join('\n');

      // ======================================
      // CREATE EMBED
      // ======================================

      const embed = createEmbed({
        title: "Exist Count",
        description:
          `### ${brainrotName}\n` +
          `*Data forked from the Sammy Leaks*`,
      })
        .addFields(
          {
            name: "Exist Count",
            value: brainrot.exists.toLocaleString(),
            inline: true,
          },
          {
            name: "Rarity",
            value: brainrot.rarity,
            inline: true,
          },
          {
            name: "Income",
            value: brainrot.income,
            inline: true,
          },
          {
            name: "Mutations",
            value: mutationLines,
            inline: false,
          },
        )
        .setFooter({
          text: "⚠️ DISCLAIMER: The bot only updates when Sammy provides new data.",
        });

      // Add brainrot image if one exists
      if (brainrot.image) {
        embed.setThumbnail(brainrot.image);
      }

      // ======================================
      // SEND RESPONSE
      // ======================================

      await InteractionHelper.safeEditReply(interaction, {
        embeds: [embed],
      });

      logger.info(`Exists command executed`, {
        userId: interaction.user.id,
        guildId: interaction.guildId,
        brainrotName,
        exists: brainrot.exists,
      });

    } catch (error) {
      logger.error(`Exists command execution failed`, {
        error: error.message,
        stack: error.stack,
        userId: interaction.user.id,
        guildId: interaction.guildId,
        commandName: 'exists',
      });

      await handleInteractionError(interaction, error, {
        commandName: 'exists',
        source: 'exists_command',
      });
    }
  },

  // ========================================
  // AUTOCOMPLETE
  // ========================================

  async autocomplete(interaction) {
    const focusedValue = interaction.options
      .getFocused()
      .toLowerCase();

    const choices = Object.keys(brainrots);

    const filtered = choices
      .filter(name =>
        name.toLowerCase().includes(focusedValue)
      )
      .slice(0, 25);

    await interaction.respond(
      filtered.map(name => ({
        name,
        value: name,
      }))
    );
  },
};
