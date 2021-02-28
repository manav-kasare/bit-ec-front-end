import {getGlobal} from 'reactn';
import en from '../assets/en.json';
import es from '../assets/es.json';

global.lang = (text) => {
  const language = getGlobal().language;
  console.log('language', language);
  if (language === 'es') return es[text];
  return en[text];
};
