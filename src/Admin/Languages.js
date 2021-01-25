import React , {useState,useEffect} from 'react'
import { Link, Route } from 'react-router-dom'
import AF from '../countrys-flags/png/af.png'
import AR from '../countrys-flags/ar.jpg' 
import BG from '../countrys-flags/png/bulgaria.png'
import BS from '../countrys-flags/png/bosnia-and-herzegovina.png'
import CA from '../countrys-flags/png/andorra.png'
import CS from '../countrys-flags/png/czech-republic.png'
import DA from '../countrys-flags/png/denmark.png'
import DE from '../countrys-flags/png/de.png'
import EL from '../countrys-flags/png/greece.png'
import EN from '../countrys-flags/png/united-states-of-america.png'
import ES from '../countrys-flags/png/es.png'
import EU from '../countrys-flags/png/basque-country.png'
import FA from '../countrys-flags/png/iran.png'
import FI from '../countrys-flags/png/finland.png'
import FR from '../countrys-flags/png/fr.png'
import HE from '../countrys-flags/png/israel.png'
import HR from '../countrys-flags/png/croatia.png'
import HU from '../countrys-flags/png/hungary.png'
import ID from '../countrys-flags/png/indonesia.png'
import IS from '../countrys-flags/png/iceland.png'
import IT from '../countrys-flags/png/it.png'
import JA from '../countrys-flags/png/ja.png'
import KA from '../countrys-flags/png/georgia.png'
import KO from '../countrys-flags/png/ko.png'
import LT from '../countrys-flags/png/lithuania.png'
import MK from '../countrys-flags/png/republic-of-macedonia.png'
import NL from '../countrys-flags/png/netherlands.png'
import NO from '../countrys-flags/png/norway.png'
import PL from '../countrys-flags/png/republic-of-poland.png'
import PT from '../countrys-flags/png/pt.png'
import PT_BR from '../countrys-flags/png/brazil.png'
import RO from '../countrys-flags/png/romania.png'
import RU from '../countrys-flags/png/ru.png'
import SL from '../countrys-flags/png/slovenia.png'
import SQ from '../countrys-flags/png/albania.png'
import SR from '../countrys-flags/png/sr.png'
import SV from '../countrys-flags/png/sweden.png'
import TH from '../countrys-flags/png/th.png'
import TR from '../countrys-flags/png/turkey.png'
import UK from '../countrys-flags/png/ukraine.png'
import VI from '../countrys-flags/png/vietnam.png'
import ZH from '../countrys-flags/png/china.png'
import ZH_TW from '../countrys-flags/png/hong-kong.png'


const images = {
    'af': [AF,'Afrikaans'],
    'ar': [AR,'Arabic'],
    'bg': [BG,'Bulgarian'],
    'bs': [BS,'Bosnian'],
    'ca': [CA,'Catalan'],
    'cs': [CS,'Czech'],
    'da': [DA,'Danish'],
    'german': [DE,'German'],
    'el': [EL,'Greek'],
    'en': [EN,'English'],
    'spanish': [ES,'Spanish'],
    'eu': [EU,'Basque'],
    'fa': [FA,'Persian'],
    'fi': [FI,'Finish'],
    'french': [FR,'French'],
    'he': [HE,'Hebrew'],
    'hr': [HR,'Croatian'],
    'hu': [HU,'Hungarian'],
    'id': [ID,'Indonesian'],
    'is': [IS,'Icelandic'],
    'italian': [IT,'Italian'],
    'japanese': [JA,'Japanese'],
    'ka': [KA,'Georgian'],
    'korean': [KO,'Korean'],
    'lt': [LT,'Lithuanaian'],
    'mk': [MK,'Macedonian'],
    'nl': [NL,'Dutch'],
    'no': [NO,'Norwegian'],
    'pl': [PL,'Polish'],
    'portuguese': [PT,'Portuguese'],
    'pt_br': [PT_BR,'Portuguese Brazilian'],
    'ro': [RO,'Romanian'],
    'russian': [RU,'Russian'],
    'sl': [SL,'Slovenian'],
    'sq': [SQ,'Albanian'],
    'sr': [SR,'Serbian'],
    'sv': [SV,'Swedish'],
    'th': [TH,'Thai'],
    'tr': [TR,'Turkish'],
    'uk': [UK,'Ukrainian'],
    'vi': [VI,'Vietnamese'],
    'mandarin': [ZH,'Chinese'],
    'zh_tw': [ZH_TW,'Chinese Traditional']
}


const Laguages = () => {
    const [langs,setLangs] = useState([])
    useEffect(() => {
        fetch('/languages')
        .then(res => res.json())
        .then(data => setLangs(data))
    },[])
    return (
        <div className='langPage'>
           {langs.map((lang,i) => {
           return <Link to={`/admin/${lang}`} key={i}>
               <button className='language'>
                <img src={images[lang][0]} alt={lang}/>
                <p>{images[lang][1]}</p>
                </button>
                </Link>}
                )}
           <div>Icons made by <a href="http://www.freepik.com" title="Freepik">Freepik</a> from <a href="https://www.flaticon.com/" title="Flaticon">www.flaticon.com</a></div> 
           <a href="https://www.vecteezy.com/free-vector/islamic-logo">Islamic Logo Vectors by Vecteezy</a>
        </div>
    )
}

export default Laguages
