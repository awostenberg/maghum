import { Client, GatewayIntentBits, SlashCommandBuilder, EmbedBuilder } from 'discord.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

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

const client = new Client({
  intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages]
});

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
    )
];

client.once('ready', async () => {
  console.log(`Logged in as ${client.user?.tag}`);
  await loadParagraphs();
  console.log(`Loaded ${paragraphs.length} paragraphs`);

  // Register commands (run once per guild or globally in production)
  // client.application?.commands.set(commands);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;
  if (interaction.commandName !== 'mh') return;

  const num = interaction.options.getInteger('number', true);
  const to = interaction.options.getInteger('to');

  await interaction.deferReply();

  if (to && to > num) {
    // Range
    const selected = paragraphs.filter(p => p.number >= num && p.number <= to);
    if (selected.length === 0) {
      await interaction.editReply(`No paragraphs found between MH ${num}–${to}.`);
      return;
    }
    const embed = new EmbedBuilder()
      .setTitle(`Magnifica Humanitas ${formatCitation(num)}–${formatCitation(to)}`)
      .setDescription(selected.map(p => `**${formatCitation(p.number)}**\n${p.text.slice(0, 280)}${p.text.length > 280 ? '…' : ''}`).join('\n\n'))
      .setURL(`https://yourname.github.io/maghum/#mh-${num}`)
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
      .setURL(`https://yourname.github.io/maghum/#mh-${num}`)
      .setFooter({ text: p.section || '' });

    await interaction.editReply({ embeds: [embed] });
  }
});

client.login(process.env.DISCORD_TOKEN);
