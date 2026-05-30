import { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder, REST, Routes } from 'discord.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';

dotenv.config();

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Load paragraphs once at startup
let paragraphs: any[] = [];

async function loadParagraphs() {
  const dataPath = path.join(__dirname, '../../data/paragraphs.json');
  const raw = await fs.readFile(dataPath, 'utf-8');
  paragraphs = JSON.parse(raw);
}

function getParagraph(n: number) {
  return paragraphs.find(p => p.number === n);
}

function formatCitation(n: number) {
  return `MH ${n}`;
}

const commands = [
  new SlashCommandBuilder()
    .setName('mh')
    .setDescription('Look up a paragraph from Magnifica Humanitas')
    .addIntegerOption(opt =>
      opt.setName('number')
        .setDescription('Paragraph number (e.g. 47 for MH 47)')
        .setRequired(true)
    )
    .addIntegerOption(opt =>
      opt.setName('to')
        .setDescription('End of range (optional)')
        .setRequired(false)
    ),
];

async function registerCommands(clientId: string, guildId?: string) {
  const rest = new REST({ version: '10' }).setToken(process.env.DISCORD_TOKEN!);

  try {
    console.log('Started refreshing application (/) commands...');

    if (guildId) {
      // Fast guild-specific registration (recommended for development)
      await rest.put(
        Routes.applicationGuildCommands(clientId, guildId),
        { body: commands }
      );
      console.log(`Successfully registered commands to guild ${guildId}`);
    } else {
      // Global registration (takes up to 1 hour to propagate)
      await rest.put(
        Routes.applicationCommands(clientId),
        { body: commands }
      );
      console.log('Successfully registered global commands');
    }
  } catch (error) {
    console.error('Error registering commands:', error);
  }
}

const client = new Client({
  intents: [GatewayIntentBits.Guilds],
});

client.once('ready', async () => {
  console.log(`Logged in as ${client.user?.tag}`);
  await loadParagraphs();
  console.log(`Loaded ${paragraphs.length} paragraphs`);

  const clientId = client.user!.id;
  const guildId = process.env.GUILD_ID;

  await registerCommands(clientId, guildId);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'mh') return;

  const num = interaction.options.getInteger('number', true);
  const to = interaction.options.getInteger('to');

  await interaction.deferReply();

  try {
    if (to && to > num) {
      // Range response
      const selected = paragraphs.filter(p => p.number >= num && p.number <= to);
      if (selected.length === 0) {
        await interaction.editReply(`No paragraphs found between MH ${num}–${to}.`);
        return;
      }

      const description = selected
        .map(p => `**${formatCitation(p.number)}**\n${p.text}`)
        .join('\n\n');

      const embed = new EmbedBuilder()
        .setTitle(`Magnifica Humanitas ${formatCitation(num)}–${formatCitation(to)}`)
        .setDescription(description.length > 4000 ? description.slice(0, 3997) + '...' : description)
        .setURL(`https://awostenberg.github.io/maghum/#mh-${num}`)
        .setFooter({ text: 'magnifica humanitas • maghum' });

      await interaction.editReply({ embeds: [embed] });
    } else {
      const p = getParagraph(num);
      if (!p) {
        await interaction.editReply(`Paragraph MH ${num} not found.`);
        return;
      }

      const embed = new EmbedBuilder()
        .setTitle(`Magnifica Humanitas ${formatCitation(num)}`)
        .setDescription(p.text)
        .setURL(`https://awostenberg.github.io/maghum/#mh-${num}`)
        .setFooter({ text: p.section || '' });

      await interaction.editReply({ embeds: [embed] });
    }
  } catch (err) {
    console.error(err);
    await interaction.editReply('Something went wrong while fetching the paragraph.');
  }
});

if (!process.env.DISCORD_TOKEN) {
  console.error('Missing DISCORD_TOKEN in environment variables');
  process.exit(1);
}

client.login(process.env.DISCORD_TOKEN);
