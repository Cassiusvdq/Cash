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

"Los Chillis": {
  exists: 9447,
  rarity: "Secret",
  income: "$75M/s",
  image: "https://static.wikia.nocookie.net/stealabr/images/c/c3/Los_Chillis.png/revision/latest?cb=20260419152650",
  mutations: {
    base: {
      count: 6310,
      image: "https://static.wikia.nocookie.net/stealabr/images/4/41/Default_Mutation_Icon.png/revision/latest?cb=20251112160311",
    },
    gold: {
      count: 916,
      image: "https://static.wikia.nocookie.net/stealabr/images/0/0f/Gold_Mutation_Icon.png/revision/latest?cb=20251014022450",
    },
    diamond: {
      count: 421,
      image: "https://static.wikia.nocookie.net/stealabr/images/2/2c/Diamond_Mutation_Icon.png/revision/latest?cb=20251014022514",
    },
    rainbow: {
      count: 119,
      image: "https://static.wikia.nocookie.net/stealabr/images/e/e5/Rainbow_Mutation_Icon.png/revision/latest?cb=20251014022647",
    },
    bloodrot: {
      count: 73,
      image: "https://static.wikia.nocookie.net/stealabr/images/8/8e/Bloodrot_Mutation_Icon.png/revision/latest?cb=20251014022607",
    },
    candy: {
      count: 41,
      image: "https://static.wikia.nocookie.net/stealabr/images/4/4a/Candy_Mutation_Icon.png/revision/latest?cb=20251014022832",
    },
    lava: {
      count: 4,
      image: "https://static.wikia.nocookie.net/stealabr/images/8/88/Lava_Mutation_Icon.png/revision/latest?cb=20251014022920",
    },
    galaxy: {
      count: 133,
      image: "https://static.wikia.nocookie.net/stealabr/images/7/7b/Galaxy_Mutation_Icon.png/revision/latest?cb=20251014023008",
    },
    yinYang: {
      count: 450,
      image: "https://static.wikia.nocookie.net/stealabr/images/8/83/Yin_Yang_Mutation_Icon.png/revision/latest?cb=20251014023114",
    },
    radioactive: {
      count: 1,
      image: "https://static.wikia.nocookie.net/stealabr/images/d/d4/Radioactive_Mutation_Icon.png/revision/latest?cb=20260314224939",
    },
    cursed: {
      count: 0,
      image: "https://static.wikia.nocookie.net/stealabr/images/9/94/Cursed_Mutation_Icon.png/revision/latest?cb=20260314225017",
    },
    divine: {
      count: 0,
      image: "https://static.wikia.nocookie.net/stealabr/images/d/d4/Divine_Mutation_Icon.png/revision/latest?cb=20260222035304",
    },
    cyber: {
      count: 979,
      image: "https://static.wikia.nocookie.net/stealabr/images/d/d8/Cyber_Mutation_Icon.png/revision/latest?cb=20260520201734",
    },
    phantom: {
      count: 0,
      image: "https://static.wikia.nocookie.net/stealabr/images/6/6d/Phantom_Mutation_Icon.png/revision/latest?cb=20260615120847",
    },
  },
},

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
  `⚪ **Base:** ${brainrot.mutations.base.count.toLocaleString()}`,
  `🟡 **Gold:** ${brainrot.mutations.gold.count.toLocaleString()}`,
  `🔷 **Diamond:** ${brainrot.mutations.diamond.count.toLocaleString()}`,
  `🌈 **Rainbow:** ${brainrot.mutations.rainbow.count.toLocaleString()}`,
  `🔴 **Bloodrot:** ${brainrot.mutations.bloodrot.count.toLocaleString()}`,
  `🍬 **Candy:** ${brainrot.mutations.candy.count.toLocaleString()}`,
  `🌋 **Lava:** ${brainrot.mutations.lava.count.toLocaleString()}`,
  `🟣 **Galaxy:** ${brainrot.mutations.galaxy.count.toLocaleString()}`,
  `☯️ **Yin Yang:** ${brainrot.mutations.yinYang.count.toLocaleString()}`,
  `☢️ **Radioactive:** ${brainrot.mutations.radioactive.count.toLocaleString()}`,
  `💀 **Cursed:** ${brainrot.mutations.cursed.count.toLocaleString()}`,
  `🔶 **Divine:** ${brainrot.mutations.divine.count.toLocaleString()}`,
  `🤖 **Cyber:** ${brainrot.mutations.cyber.count.toLocaleString()}`,
  `👻 **Phantom:** ${brainrot.mutations.phantom.count.toLocaleString()}`,
].join('\n');

      const embed = createEmbed({
        title: brainrotName,
        description: `*From the brainrot glossary*`,
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

      // Add brainrot image
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
