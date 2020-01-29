/*
 * Provides assistance with general book of proverbs structure.
 * Translation independent
 * Code for Christ, 1/23/2020
 */

import {IVerseSignature} from "./Interfaces"
import structure from "../indexing/ProverbsStructure.json"
import sayingsStructure from '../indexing/Sayings.json'
import statementStructure from '../indexing/Statements.json'


export default class TranslationMap {

    LoadTranslation(TranslationName: string){
    // output: boolean
    }

    GetContent(VerseID: number){
    // output: string
    }
}