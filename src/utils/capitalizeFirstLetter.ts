export const capitalizeFirstLetter = (userInput: string): string => {
  const input: string = userInput;
  const result = input.charAt(0).toUpperCase() + input.slice(1);
  return result;
};