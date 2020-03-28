/*
  Proverb Box
  Code for Christ, 2020
  Translation Configuration File (WEB/Lexham not yet implemented)

    Note:
      Place Translation JSON File in:
      proverb-box-master/public/assets/translations
*/

//  Import Loaders
import KJVLoader from './KJV-Loader'
import LexhamLoader from './Lexham-Loader'

//  Translation Config
export default {
  "KJV": {
    "Label": "King James Version",
    "Data": "./assets/translations/KJV-Proverbs.json",
    "Loader": KJVLoader,
  },
  "WEB": {
    "Label": "Web Pro Version",
    "Data": "./assets/translations/KJV-Proverbs.json",
    "Loader": KJVLoader,
  },
  "LEB": {
    "Label": "Lexham English Version",
    "Data": "./assets/translations/Lexham-Proverbs.json",
    "Loader": LexhamLoader,
  },
  "WEB1": {
    "Label": "Web Pro Version",
    "Data": "./assets/translations/Lexham-Proverbs.json",
    "Loader": LexhamLoader,
  }
}