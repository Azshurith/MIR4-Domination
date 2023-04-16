import { Client } from "discordx";
import { AnyThreadChannel, ChannelType, FetchedThreads, ForumChannel, Guild, TextChannel, ThreadChannel } from "discord.js";
import CLogger from "../interface/utilities/logger/controllers/CLogger.js";

/**
 * A class representing a Text Channel Helper
 *
 * @version 1.0.0
 * @since 04/09/23
 * @author
 *  - Devitrax
 */
export default class HTextChat {

    static MAX_DESCRIPTION_LENGTH: number = 2048;

    /**
     * Returns the text channel with the given name on the specified server.
     * 
     * @param {Client} client - The Discord client instance to use.
     * @param {string} serverName - The name of the server to search for the channel on.
     * @param {string} channelName - The name of the channel to search for.
     * @returns {TextChannel|null|undefined} - The text channel with the given name, or null/undefined if not found.
     */
    static getSpecificServerTextChannelByName(client: Client, serverName: string, channelName: string): TextChannel | null | undefined {
        try {
            const guild: Guild | undefined = client.guilds.cache.find((guild) => guild.name === serverName);
            if (!guild) {
                CLogger.error(`[${import.meta.url}] Request Error > Server not found: (${serverName})`);
                return null;
            }

            const channel: TextChannel = guild.channels.cache.find((channel) => channel.name === channelName) as TextChannel;
            if (!channel) {
                CLogger.error(`[${import.meta.url}] Request Error > Channel not found: (${channelName})`);
                return null;
            }

            if (!channel.isTextBased()) {
                CLogger.error(`[${import.meta.url}] Request Error > Channel is not a text based channel: (${channelName})`);
                return null;
            }

            return channel;
        } catch (error) {
            CLogger.error(`[${import.meta.url}] Request Error > Server Error: (${error})`);
        }
    }

    /**
     * Get the forum thread in a specific server by name
     *
     * @param {Client} client - The Discord.js client
     * @param {string} serverName - The name of the server where the forum exists
     * @param {string} forumName - The name of the forum where the thread exists
     * @param {string} threadName - The name of the thread to retrieve or create
     * @returns {ThreadChannel | null | undefined} The thread channel or null/undefined if not found or an error occurred
     */
    static async getSpecificServerForumThreadByName(client: Client, serverName: string, forumName: string, threadName: string, content: string): Promise<ThreadChannel | null | undefined> {
        try {
            const guild: Guild | undefined = client.guilds.cache.find((guild) => guild.name === serverName);
            if (!guild) {
                CLogger.error(`[${import.meta.url}] Request Error > Server not found: (${serverName})`);
                return null;
            }

            const channel: ForumChannel = guild.channels.cache.find((channel) => channel.name === forumName) as ForumChannel;
            if (!channel) {
                CLogger.error(`[${import.meta.url}] Request Error > Forum not found: (${forumName})`);
                return null;
            }

            if (channel.type !== ChannelType.GuildForum) {
                CLogger.error(`[${import.meta.url}] Request Error > Channel is not a forum: (${forumName})`);
                return null;
            }

            const fetchedThreads: FetchedThreads = await channel.threads.fetch();
            const threadsArray: AnyThreadChannel<boolean>[] = Array.from(fetchedThreads.threads.values());
            let thread: ThreadChannel<boolean> | null = threadsArray.find((thread) => thread.name === threadName) as ThreadChannel;
            if (!thread) {
                thread = await channel.threads.create({
                    name: threadName,
                    autoArchiveDuration: 60,
                    reason: `Generated by ${client.user?.username}`,
                    message: {
                        content: content,
                        components: [],
                        embeds: [],
                        allowedMentions: { parse: [] },
                    },
                });
            }

            return thread;
        } catch (error) {
            CLogger.error(`[${import.meta.url}] Request Error > Server Error: (${error})`);
            return null;
        }
    }

    /**
     * Converts BBCode to Discord-compatible text.
     * 
     * @param {string} text The text to convert.
     * @returns {string} The converted text.
     */
    static bbCodeToDiscord(text: string): string {
        try {
            text = text.replace(/\[b\](.*?)\[\/b\]/gs, "**$1**");
            text = text.replace(/\[i\](.*?)\[\/i\]/gs, "*$1*");
            text = text.replace(/\[u\](.*?)\[\/u\]/gs, "__$1__");
            text = text.replace(/\[url\](.*?)\[\/url\]/gs, "<$1>");
            text = text.replace(/\[img\](.*?)\[\/img\]/gs, (url) => "");
            text = text.replace(/\[h2\](.*?)\[\/h2\]/gs, "**$1**\n");
            text = text.replace(/\[h3\](.*?)\[\/h3\]/gs, "**$1**\n");
            text = text.replace(/\[\/?table\]/gs, "");
            text = text.replace(/\[\/?tr\]/gs, "");
            text = text.replace(/\[\/?th\]/gs, "");
            text = text.replace(/\[\/?td\]/gs, "");
            text = text.replace(/\[\/?strike\]/gs, "");

            if (text.length > this.MAX_DESCRIPTION_LENGTH) {
                text = text.substring(0, this.MAX_DESCRIPTION_LENGTH - 3) + "...";
            }
        } catch (error) {
            CLogger.error(
                `[${import.meta.url}] Request Error > BBCode to Discord: (${error})`
            );
        }

        return text;
    }

    /**
     * Returns a string representation of a Discord role mention.
     * 
     * @param {string} roleId The ID of the role to mention.
     * @returns {string} The string representation of the role mention.
     */
    static tagRole(roleId: string): string {
        return `<@&${roleId}>`;
    }

}