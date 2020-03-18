//  IMPORT LOADERS
import KJVLoader from './KJV-Loader'

//  Translation Configuration file (KJV-Loader not yet implemented)
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
  }
}