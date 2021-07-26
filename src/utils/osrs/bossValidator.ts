// Discord
import { Message } from 'discord.js';
// UTILS: Enums
import { BossAliases, BossCases } from './enums';
// UTILS: Input validator
import { bossList } from './inputValidator';
// UTILS: Prefix validator
import { PrefixCategories, invalidPrefixMsg } from './isPrefixValid';
/* 
  Boss list is an array of lowercase joined boss name e.g "abyssalsire". 
  User input is a string array e.g ["abyssal", "sire", "zezima"]
  
  First check if there is any input (!args.length). If not return error (msg). Then check special cases (3 argument boss name eg. theatre of blood). Then filter boss list and check if args[0] (string) is included in any element (string). If true then check if [args[0], args[1]].join('') (string, exact match) is included boss array. If this check passes, then boss = [args[0], args[1]].join(''), else boss = args[0]. 
  Then do a final check if boss is exact match to because names like "dagannoth" pass first check but are not valid boss names

  User to search for is args.slice(<length of args that are the boss name>)
  */

export type BossValidation = {
  bossCase: number | null;
  boss: string | null;
};

// Indexes for which input argument is used as index
enum Indexes {
  FIRST_WORD = 0,
  SECOND_WORD = 1,
  THIRD_WORD = 2,
}
// Boss name validator for kc, records and gains commands
export const bossValidator = (
  msg: Message,
  lowerCasedArguments: string[],
  indexes: number[]
): BossValidation | undefined => {
  if (!lowerCasedArguments.length) return;
  const firstArgument: string =
    lowerCasedArguments[indexes[Indexes.FIRST_WORD]];
  const twoArgumentsJoined: string = [
    lowerCasedArguments[indexes[Indexes.FIRST_WORD]],
    lowerCasedArguments[indexes[Indexes.SECOND_WORD]],
  ]
    .join('')
    .toLowerCase();
  const specialCase: string = [
    lowerCasedArguments[indexes[Indexes.FIRST_WORD]],
    lowerCasedArguments[indexes[Indexes.SECOND_WORD]],
    lowerCasedArguments[indexes[Indexes.THIRD_WORD]],
  ]
    .join('')
    .toLowerCase();

  let boss: string | null;
  let bossCase: number | null;
  if (
    specialCase === BossAliases.COX_ALIAS2 ||
    specialCase === BossAliases.TOB_ALIAS3 ||
    specialCase === BossAliases.KBD_ALIAS2 ||
    specialCase === BossAliases.THERMY_ALIAS3
  ) {
    bossCase = BossCases.THREE_WORDS;
    boss = specialCase;
  } else {
    const firstCheck: string[] = bossList.filter((e: string) => {
      return e.includes(firstArgument);
    });
    if (firstCheck.length > 0 && lowerCasedArguments.length > 1) {
      const secondCheck: boolean = bossList.includes(twoArgumentsJoined);

      // This is for edge cases like ".kc deranged archeologist"
      if (secondCheck && lowerCasedArguments.length === 2) {
        boss = firstArgument;
        bossCase = BossCases.EDGE_CASE;
      } else if (secondCheck) {
        bossCase = BossCases.TWO_WORD;
        boss = twoArgumentsJoined;
      } else {
        bossCase = BossCases.ONE_WORD;
        boss = firstArgument;
      }
    } else if (firstCheck.length > 0 && lowerCasedArguments.length === 1) {
      bossCase = BossCases.EDGE_CASE;
      boss = firstArgument;
    } else {
      boss = null;
      bossCase = null;
    }
  }

  if (bossList.includes(boss as string))
    return {
      bossCase,
      boss,
    };
  else {
    if (bossCase === BossCases.EDGE_CASE) {
      msg.channel.send(
        invalidPrefixMsg(bossList, PrefixCategories.BOSS_EDGE_CASE)
      );
    } else msg.channel.send(invalidPrefixMsg(bossList, PrefixCategories.BOSS));
    return;
  }
};
