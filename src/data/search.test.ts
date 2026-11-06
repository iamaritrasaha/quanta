import { describe, expect, it } from 'vitest'
import { elements, LANTHANOID_SYMBOLS, ACTINOID_SYMBOLS, CATEGORY_LABELS } from './elements'
import { filterElements, matchElement } from './search'

describe('Search and Filter Functionality', () => {
  it('returns all 118 elements on empty query', () => {
    expect(filterElements('')).toHaveLength(118)
    expect(filterElements('   ')).toHaveLength(118)
    expect(filterElements('', 'all')).toHaveLength(118)
  })

  it('performs exact atomic number matching without returning false positives', () => {
    const query1 = filterElements('1')
    expect(query1).toHaveLength(1)
    expect(query1[0].symbol).toBe('H')
    expect(query1[0].number).toBe(1)

    const query79 = filterElements('79')
    expect(query79).toHaveLength(1)
    expect(query79[0].symbol).toBe('Au')
    expect(query79[0].name).toBe('Gold')

    const query118 = filterElements('118')
    expect(query118).toHaveLength(1)
    expect(query118[0].symbol).toBe('Og')

    // Out of range returns empty
    expect(filterElements('0')).toHaveLength(0)
    expect(filterElements('119')).toHaveLength(0)
  })

  it('matches by symbol case-insensitively', () => {
    const queryH = filterElements('h')
    expect(queryH.some((el) => el.symbol === 'H')).toBe(true)

    const queryAu = filterElements('au')
    expect(queryAu.some((el) => el.symbol === 'Au')).toBe(true)

    const queryFe = filterElements('FE')
    expect(queryFe.some((el) => el.symbol === 'Fe')).toBe(true)
  })

  it('matches full and partial element names', () => {
    const queryHydro = filterElements('hydro')
    expect(queryHydro).toHaveLength(1)
    expect(queryHydro[0].name).toBe('Hydrogen')

    const queryRuth = filterElements('Rutherfordium')
    expect(queryRuth).toHaveLength(1)
    expect(queryRuth[0].symbol).toBe('Rf')
    expect(queryRuth[0].number).toBe(104)
  })

  it('supports spelling aliases (Aluminium/Aluminum, Caesium/Cesium, Wolfram/Tungsten)', () => {
    const queryAluminum = filterElements('aluminum')
    expect(queryAluminum).toHaveLength(1)
    expect(queryAluminum[0].symbol).toBe('Al')
    expect(queryAluminum[0].name).toBe('Aluminium')

    const queryAluminium = filterElements('aluminium')
    expect(queryAluminium).toHaveLength(1)
    expect(queryAluminium[0].symbol).toBe('Al')

    const queryCesium = filterElements('cesium')
    expect(queryCesium).toHaveLength(1)
    expect(queryCesium[0].symbol).toBe('Cs')
    expect(queryCesium[0].name).toBe('Caesium')

    const queryWolfram = filterElements('wolfram')
    expect(queryWolfram).toHaveLength(1)
    expect(queryWolfram[0].symbol).toBe('W')
    expect(queryWolfram[0].name).toBe('Tungsten')
  })

  it('filters accurately by category and combines with search', () => {
    const nobles = filterElements('', 'noble gas')
    expect(nobles).toHaveLength(7)
    expect(nobles.map((el) => el.symbol)).toEqual(['He', 'Ne', 'Ar', 'Kr', 'Xe', 'Rn', 'Og'])

    const alkali = filterElements('', 'alkali metal')
    expect(alkali).toHaveLength(6)
    expect(alkali.map((el) => el.symbol)).toEqual(['Li', 'Na', 'K', 'Rb', 'Cs', 'Fr'])

    // Combined search and category
    const alkaliK = filterElements('k', 'alkali metal')
    expect(alkaliK.some((el) => el.symbol === 'K')).toBe(true)
    // Non-alkali starting with k (Krypton) should be excluded
    expect(alkaliK.some((el) => el.symbol === 'Kr')).toBe(false)
  })

  it('correctly classifies Lanthanoids (15) and Actinoids (15)', () => {
    const lanthanoids = elements.filter((el) => el.category === 'lanthanide')
    expect(lanthanoids).toHaveLength(15)
    expect(lanthanoids.map((el) => el.symbol)).toEqual([...LANTHANOID_SYMBOLS])
    expect(lanthanoids[0].symbol).toBe('La')
    expect(lanthanoids[0].number).toBe(57)
    expect(lanthanoids[14].symbol).toBe('Lu')
    expect(lanthanoids[14].number).toBe(71)

    const actinoids = elements.filter((el) => el.category === 'actinide')
    expect(actinoids).toHaveLength(15)
    expect(actinoids.map((el) => el.symbol)).toEqual([...ACTINOID_SYMBOLS])
    expect(actinoids[0].symbol).toBe('Ac')
    expect(actinoids[0].number).toBe(89)
    expect(actinoids[14].symbol).toBe('Lr')
    expect(actinoids[14].number).toBe(103)
  })

  it('partitions all 118 elements across the 10 chemical categories without gaps or duplicates', () => {
    const totalCount = Object.keys(CATEGORY_LABELS).reduce((sum, cat) => {
      return sum + elements.filter((el) => el.category === cat).length
    }, 0)
    expect(totalCount).toBe(118)
  })
})
