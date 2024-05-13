export const EXT_LANGUAGE_MAP = new Map([
  ['cc', 'cpp'],
  ['h', 'cpp'],
  ['c', 'c'],
  ['java', 'java'],
  ['js', 'javascript'],
  ['jsx', 'javascript'],
  ['ts', 'typescript'],
  ['tsx', 'typescript'],
  ['sh', 'bash'],
  ['', 'bash'],
  ['cs', 'csharp'],
  ['py', 'python'],
  ['scala', 'scala'],
  ['kt', 'kotlin'],
  ['kts', 'kotlin'],
  ['rs', 'rust'],
  ['dart', 'dart'],
  ['go', 'go'],
  ['gradle', 'gradle'],
  ['groovy', 'groovy'],
  ['dockerfile', 'dockerfile'],
  ['json', 'json'],
  ['xml', 'xml'],
]);

export const PROGRAMMING_LANGUAGES = Array.from(new Set(EXT_LANGUAGE_MAP.values()).values());

export const EXTENDED_PROGRAMMING_LANGUAGES = [
  ...PROGRAMMING_LANGUAGES,
  'sb3',
]
