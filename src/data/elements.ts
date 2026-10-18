export type ElementCategory = 'nonmetal' | 'noble gas' | 'alkali metal' | 'alkaline earth' | 'metalloid' | 'halogen' | 'transition metal' | 'post-transition' | 'lanthanide' | 'actinide'
export interface Element { number:number; symbol:string; name:ElementName; group:number; period:number; category:ElementCategory; gridRow:number; gridColumn:number; available:boolean }
const entries = [
['H','Hydrogen'],['He','Helium'],['Li','Lithium'],['Be','Beryllium'],['B','Boron'],['C','Carbon'],['N','Nitrogen'],['O','Oxygen'],['F','Fluorine'],['Ne','Neon'],['Na','Sodium'],['Mg','Magnesium'],['Al','Aluminium'],['Si','Silicon'],['P','Phosphorus'],['S','Sulfur'],['Cl','Chlorine'],['Ar','Argon'],['K','Potassium'],['Ca','Calcium'],['Sc','Scandium'],['Ti','Titanium'],['V','Vanadium'],['Cr','Chromium'],['Mn','Manganese'],['Fe','Iron'],['Co','Cobalt'],['Ni','Nickel'],['Cu','Copper'],['Zn','Zinc'],['Ga','Gallium'],['Ge','Germanium'],['As','Arsenic'],['Se','Selenium'],['Br','Bromine'],['Kr','Krypton'],['Rb','Rubidium'],['Sr','Strontium'],['Y','Yttrium'],['Zr','Zirconium'],['Nb','Niobium'],['Mo','Molybdenum'],['Tc','Technetium'],['Ru','Ruthenium'],['Rh','Rhodium'],['Pd','Palladium'],['Ag','Silver'],['Cd','Cadmium'],['In','Indium'],['Sn','Tin'],['Sb','Antimony'],['Te','Tellurium'],['I','Iodine'],['Xe','Xenon'],['Cs','Caesium'],['Ba','Barium'],['La','Lanthanum'],['Ce','Cerium'],['Pr','Praseodymium'],['Nd','Neodymium'],['Pm','Promethium'],['Sm','Samarium'],['Eu','Europium'],['Gd','Gadolinium'],['Tb','Terbium'],['Dy','Dysprosium'],['Ho','Holmium'],['Er','Erbium'],['Tm','Thulium'],['Yb','Ytterbium'],['Lu','Lutetium'],['Hf','Hafnium'],['Ta','Tantalum'],['W','Tungsten'],['Re','Rhenium'],['Os','Osmium'],['Ir','Iridium'],['Pt','Platinum'],['Au','Gold'],['Hg','Mercury'],['Tl','Thallium'],['Pb','Lead'],['Bi','Bismuth'],['Po','Polonium'],['At','Astatine'],['Rn','Radon'],['Fr','Francium'],['Ra','Radium'],['Ac','Actinium'],['Th','Thorium'],['Pa','Protactinium'],['U','Uranium'],['Np','Neptunium'],['Pu','Plutonium'],['Am','Americium'],['Cm','Curium'],['Bk','Berkelium'],['Cf','Californium'],['Es','Einsteinium'],['Fm','Fermium'],['Md','Mendelevium'],['No','Nobelium'],['Lr','Lawrencium'],['Rf','Rutherfordium'],['Db','Dubnium'],['Sg','Seaborgium'],['Bh','Bohrium'],['Hs','Hassium'],['Mt','Meitnerium'],['Ds','Darmstadtium'],['Rg','Roentgenium'],['Cn','Copernicium'],['Nh','Nihonium'],['Fl','Flerovium'],['Mc','Moscovium'],['Lv','Livermorium'],['Ts','Tennessine'],['Og','Oganesson'],
] as const
export type ElementName = (typeof entries)[number][1]
export type ElementKey = Lowercase<ElementName>
const rows = [
 ['H','','','','','','','','','','','','','','','','','He'],
 ['Li','Be','','','','','','','','','','','B','C','N','O','F','Ne'],
 ['Na','Mg','','','','','','','','','','','Al','Si','P','S','Cl','Ar'],
 ['K','Ca','Sc','Ti','V','Cr','Mn','Fe','Co','Ni','Cu','Zn','Ga','Ge','As','Se','Br','Kr'],
 ['Rb','Sr','Y','Zr','Nb','Mo','Tc','Ru','Rh','Pd','Ag','Cd','In','Sn','Sb','Te','I','Xe'],
 ['Cs','Ba','La','Hf','Ta','W','Re','Os','Ir','Pt','Au','Hg','Tl','Pb','Bi','Po','At','Rn'],
 ['Fr','Ra','Ac','Rf','Db','Sg','Bh','Hs','Mt','Ds','Rg','Cn','Nh','Fl','Mc','Lv','Ts','Og'],
] as const
const lanthanides = ['Ce','Pr','Nd','Pm','Sm','Eu','Gd','Tb','Dy','Ho','Er','Tm','Yb','Lu']
const actinides = ['Th','Pa','U','Np','Pu','Am','Cm','Bk','Cf','Es','Fm','Md','No','Lr']
const category = (s:string, group:number, period:number):ElementCategory => {
 if (lanthanides.includes(s)) return 'lanthanide'; if (actinides.includes(s)) return 'actinide'
 if (group===18) return 'noble gas'; if (group===1 && s!=='H') return 'alkali metal'; if(group===2) return 'alkaline earth'
 if (group===17) return 'halogen'; if (['B','Si','Ge','As','Sb','Te','Po','At'].includes(s)) return 'metalloid'
 if (['H','C','N','O','P','S','Se'].includes(s)) return 'nonmetal'; if (group>=3&&group<=12) return 'transition metal'
 return 'post-transition'
}
const locations = new Map<string,[number,number,number,number]>()
rows.forEach((row, rowIndex) => row.forEach((symbol, col) => { if(symbol) locations.set(symbol,[rowIndex+1,col+1,rowIndex+1,col+1]) }))
lanthanides.forEach((s,i)=>locations.set(s,[6,3,8,4+i])); actinides.forEach((s,i)=>locations.set(s,[7,3,9,4+i]))
export const elements: Element[] = entries.map(([symbol,name], i) => {
 const [period,group,gridRow,gridColumn] = locations.get(symbol)!
 return { number:i+1,symbol,name,group,period,gridRow,gridColumn,category:category(symbol,group,period),available:true }
})

export const elementKey = (element: Pick<Element, 'name'>): ElementKey =>
 element.name.toLowerCase() as ElementKey

const elementsByKey = new Map(elements.map((element) => [elementKey(element), element]))

export function getElementByKey(key: string): Element | undefined {
 return elementsByKey.get(key.toLowerCase() as ElementKey)
}

/** Resolve only known element routes; malformed URL escapes fall back to the table. */
export function getElementKeyFromHash(hash: string): ElementKey | undefined {
 const routeKey = hash.match(/^#\/element\/([^/]+)\/?$/)?.[1]
 if (!routeKey) return undefined
 try {
  const element = getElementByKey(decodeURIComponent(routeKey))
  return element ? elementKey(element) : undefined
 } catch {
  return undefined
 }
}
