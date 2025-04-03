import { parsers as ymd } from './01-ymd.js';
import { parsers as mdy } from './02-mdy.js';
import { parsers as dmy } from './03-dmy.js';

export const parsers = [...ymd, ...mdy, ...dmy];
