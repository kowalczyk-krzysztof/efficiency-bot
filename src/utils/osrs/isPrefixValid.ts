// Discord
import { Message } from 'discord.js';
// Dotenv
import dotenv from 'dotenv';
// UTILS: Embeds
import { Embed } from '../embed';

dotenv.config({ path: 'config.env' });

// Pastebins with valid boss and skill names
const BOSS_LIST: string = process.env.OSRS_BOSS_LIST as string;
const SKILL_LIST: string = process.env.OSRS_SKILL_LIST as string;

// TODO improve this
export enum PrefixCategories {
  BOSS = 'boss',
  BOSS_EDGE_CASE = 'bossedge',
  SKILL = 'skill',
  CLUES = 'clues',
  BH = 'bh',
  TIME_OTHER = 'timeother',
  OTHER = 'other',
  DEFAULT = '',
}

export const invalidPrefix = 'INVALID';

export const isPrefixValid = (
  msg: Message,
  args: string[],
  types: string[],
  category: PrefixCategories = PrefixCategories.DEFAULT
): string => {
  const typesList: string = types.join(', ');
  if (args.length === 0) {
    msg.channel.send(invalidPrefixMsg(typesList, category));
    return invalidPrefix;
  }

  const parsedArgument: string = args[0]
    .replace(/\n/g, '')
    .toLowerCase()
    .trim();
  if (args.length === 0 || !types.includes(parsedArgument)) {
    msg.channel.send(invalidPrefixMsg(typesList, category));
    return invalidPrefix;
  } else return parsedArgument;
};
// Generate msg
export const invalidPrefixMsg = (
  types: string[] | string,
  category: PrefixCategories = PrefixCategories.DEFAULT
): Embed => {
  let typesList;
  if (Array.isArray(types)) typesList = types.join(', ');
  else typesList = types;
  let result;
  switch (category) {
    case PrefixCategories.BOSS:
      result = `Invalid boss name. Valid boss names: <${BOSS_LIST}>`;
      break;
    case PrefixCategories.BOSS_EDGE_CASE:
      result = `Invalid boss name or username. Valid boss names: <${BOSS_LIST}>`;
      break;
    case PrefixCategories.SKILL:
      result = `Invalid skill name. Valid skill names: <${SKILL_LIST}>`;
      break;
    case PrefixCategories.TIME_OTHER:
      result = `Invalid ${category} type. Valid types: **${typesList}**\n\nFor LMS there is no 6h record`;
      break;
    case PrefixCategories.CLUES:
      result = `Invalid clue tier. Valid tiers: **${typesList}**`;
    default:
      result = `Invalid ${category} type. Valid types: **${typesList}**`;
  }
  return new Embed().setDescription(result);
};
