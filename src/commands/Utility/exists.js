import { SlashCommandBuilder } from 'discord.js';
import { createEmbed } from '../../utils/embeds.js';
import { logger } from '../../utils/logger.js';
import { handleInteractionError } from '../../utils/errorHandler.js';
import { InteractionHelper } from '../../utils/interactionHelper.js';

const brainrots = {
  "Los Sekolahs": {
    exists: 5000,
    rarity: "Secret",
    income: "12/s",
    image: null,
    mutations: {
      base: 0,
      gold: 33,
      diamond: 19,
      rainbow: 16,
      bloodrot: 0,
      candy: 0,
      lava: 0,
      galaxy: 48,
      yinYang: 0,
      radioactive: 0,
      cursed: 0,
      divine: 1,
      cyber: 0,
      phantom: 0,
    },
  },

  "Chillin Chilli": {
    exists: 2500,
    rarity: "Secret",
    income: "10/s",
    image: null,
    mutations: {
      base: 0,
      gold: 0,
      diamond: 0,
      rainbow: 0,
      bloodrot: 0,
      candy: 0,
      lava: 0,
      galaxy: 0,
      yinYang: 0,
      radioactive: 0,
      cursed: 0,
      divine: 0,
      cyber: 0,
      phantom: 0,
    },
  },

  "Cash": {
    exists: 1000,
    rarity: "Mythic",
    income: "8/s",
    image: null,
    mutations: {
      base: 0,
      gold: 0,
      diamond: 0,
      rainbow: 0,
      bloodrot: 0,
      candy: 0,
      lava: 0,
      galaxy: 0,
      yinYang: 0,
      radioactive: 0,
      cursed: 0,
      divine: 0,
      cyber: 0,
      phantom: 0,
    },
  },

  "Cupid": {
    exists: 750,
    rarity: "Legendary",
    income: "6/s",
    image: null,
    mutations: {
      base: 0,
      gold: 0,
      diamond: 0,
      rainbow: 0,
      bloodrot: 0,
      candy: 0,
      lava: 0,
      galaxy: 0,
      yinYang: 0,
      radioactive: 0,
      cursed: 0,
      divine: 0,
      cyber: 0,
      phantom: 0,
    },
  },
};

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

  async execute(interaction) {
    try {
      const deferSuccess = await InteractionHelper.safeDefer(interaction);

      if (!deferSuccess) {
        return;
      }

      const brainrotName = interaction.options.getString("brainrot");
      const brainrot = brainrots[brainrotName];

      if (!brainrot) {
        return await InteractionHelper.safeEditReply(interaction, {
          content: `❌ I couldn't find a brainrot called **${brainrotName}**.`,
        });
      }

      const mutationLines = [
        `⚪ **Base:** ${brainrot.mutations.base.toLocaleString()}`,
        `🟡 **Gold:** ${brainrot.mutations.gold.toLocaleString()}`,
        `🔷 **Diamond:** ${brainrot.mutations.diamond.toLocaleString()}`,
        `🌈 **Rainbow:** ${brainrot.mutations.rainbow.toLocaleString()}`,
        `🔴 **Bloodrot:** ${brainrot.mutations.bloodrot.toLocaleString()}`,
        `🍬 **Candy:** ${brainrot.mutations.candy.toLocaleString()}`,
        `🌋 **Lava:** ${brainrot.mutations.lava.toLocaleString()}`,
        `🟣 **Galaxy:** ${brainrot.mutations.galaxy.toLocaleString()}`,
        `☯️ **Yin Yang:** ${brainrot.mutations.yinYang.toLocaleString()}`,
        `☢️ **Radioactive:** ${brainrot.mutations.radioactive.toLocaleString()}`,
        `💀 **Cursed:** ${brainrot.mutations.cursed.toLocaleString()}`,
        `🔶 **Divine:** ${brainrot.mutations.divine.toLocaleString()}`,
        `🤖 **Cyber:** ${brainrot.mutations.cyber.toLocaleString()}`,
        `👻 **Phantom:** ${brainrot.mutations.phantom.toLocaleString()}`,
      ].join('\n');

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

      if (brainrot.image) {
        embed.setThumbnail(brainrot.image);
      }

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

  async autocomplete(interaction) {
    try {
      const focusedValue = interaction.options.getFocused().toLowerCase();

      const choices = Object.keys(brainrots);

      const filtered = choices
        .filter(name =>
          name.toLowerCase().includes(focusedValue)
        )
        .slice(0, 25);

      await interaction.respond(
        filtered.map(name => ({
          name: name,
          value: name,
        }))
      );

    } catch (error) {
      console.error("Autocomplete error:", error);

      try {
        await interaction.respond([]);
      } catch (respondError) {
        console.error("Failed to respond to autocomplete:", respondError);
      }
    }
  },
};
