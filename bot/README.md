# Maghum Discord Bot

This bot allows people to easily reference paragraphs from *Magnifica Humanitas* inside Discord using the `MH N` citation style.

## Commands

- `/mh 47` — Shows paragraph 47 with a link back to the website
- `/mh 42 48` — Shows a range of paragraphs (MH 42–48)

## Setup

### 1. Create a Discord Application + Bot

1. Go to https://discord.com/developers/applications
2. Click **New Application**
3. Give it a name (e.g. "Maghum Bot") and create it
4. Go to the **Bot** tab on the left
5. Click **Add Bot**
6. Under **Privileged Gateway Intents**, enable **Server Members Intent** (optional for now) and **Message Content Intent** if you want text triggers later
7. Click **Reset Token** and copy the token

### 2. Invite the Bot to Your Server

1. Go to the **OAuth2 → URL Generator** tab
2. Under **Scopes**, select:
   - `bot`
   - `applications.commands`
3. Under **Bot Permissions**, select at minimum:
   - Send Messages
   - Embed Links
4. Copy the generated URL and open it in your browser to invite the bot

### 3. Local Setup

```bash
cd bot
npm install
cp .env.example .env
```

Edit `.env` and fill in:

```env
DISCORD_TOKEN=your_token_here
GUILD_ID=your_test_server_id_here   # Highly recommended for fast development
```

To get your `GUILD_ID`:
- Enable Developer Mode in Discord (Settings → Advanced → Developer Mode)
- Right-click your server → Copy Server ID

### 4. Run the Bot

```bash
npm run dev
```

On first run it will register the `/mh` slash command (very fast if you provide `GUILD_ID`).

## Production Notes

- For production, remove `GUILD_ID` or leave it empty. Commands will register globally (can take up to 1 hour to appear).
- Consider moving the bot to a proper hosting service (Railway, Fly.io, Render, etc.) so it stays online 24/7.

## Data Source

The bot reads from the same `data/paragraphs.json` used by the website, so it always stays in sync.

## Local Testing (No Discord Required)

You can test the core citation logic locally without needing Discord or a bot token.

```bash
# Single paragraph
npm run test 47

# Range of paragraphs
npm run test 42 48
```

This is very useful while waiting for the Discord bot token or when experimenting with formatting and behavior.

The tester outputs the citation, section info, the full text, and the direct website link — very similar to what the bot will eventually produce.
