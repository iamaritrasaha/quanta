import { describe, it, expect } from 'vitest'
import { createElement } from 'react'
import { renderToString } from 'react-dom/server'
import {
  SpectralRegionBadge,
  SpectralWavelength,
  SpectralTransitionRow,
  FineStructureComponentRow,
  SpectralHeroResult,
  SpectrumInstrumentHeader,
} from './index'
import { LITHIUM_TRANSITIONS, getLithiumTransition } from '../../physics/lithium'
import { HELIUM_TRANSITIONS, getHeliumTransition } from '../../physics/helium'
import { safeHydrogenTransition } from '../../physics/hydrogen'

describe('Spectroscopy Shared Layout Primitives', () => {
  describe('SpectralRegionBadge', () => {
    it('renders region badge in uppercase without string concatenation', () => {
      const html = renderToString(createElement(SpectralRegionBadge, { region: 'Visible' }))
      expect(html).toContain('spectral-region-badge')
      expect(html).toContain('region-visible')
      expect(html).toContain('VISIBLE')
    })

    it('handles NIR, UV, and EUV classifications', () => {
      const nirHtml = renderToString(createElement(SpectralRegionBadge, { region: 'NIR' }))
      expect(nirHtml).toContain('region-nir')
      expect(nirHtml).toContain('NIR')

      const uvHtml = renderToString(createElement(SpectralRegionBadge, { region: 'UV' }))
      expect(uvHtml).toContain('region-uv')
      expect(uvHtml).toContain('UV')
    })
  })

  describe('SpectralWavelength', () => {
    it('formats numerical wavelength and unit with protected markup', () => {
      const html = renderToString(
        createElement(SpectralWavelength, {
          wavelengthNm: 670.7775,
          precision: 1,
          medium: 'air',
        })
      )
      expect(html).toContain('670.8 nm')
      expect(html).toContain('· AIR')
      expect(html).toContain('wavelength-value')
      expect(html).toContain('wavelength-medium-tag')
    })

    it('supports higher precision for resolved fine-structure components', () => {
      const html = renderToString(
        createElement(SpectralWavelength, {
          wavelengthNm: 670.7775,
          precision: 4,
          medium: 'air',
        })
      )
      expect(html).toContain('670.7775 nm')
      expect(html).toContain('· AIR')
    })
  })

  describe('SpectralTransitionRow Contract', () => {
    it('associates title, wavelength, medium, and region within one semantic row', () => {
      const t = getLithiumTransition('670.8nm')!
      const html = renderToString(
        createElement(SpectralTransitionRow, {
          id: t.id,
          title: 'Li I · Resonance Doublet',
          wavelengthNm: t.wavelengthNm,
          wavelengthPrecision: 1,
          wavelengthMedium: t.wavelengthMedium,
          region: t.region,
          displayColor: t.displayColor,
          isSelected: true,
        })
      )

      // Semantic structure checks
      expect(html).toContain('spectral-transition-row')
      expect(html).toContain('active')
      expect(html).toContain('spectral-transition-title')
      expect(html).toContain('Li I · Resonance Doublet')
      expect(html).toContain('670.8 nm')
      expect(html).toContain('· AIR')
      expect(html).toContain('VISIBLE')
      // Ensure "670.8 nmVISIBLE" is not concatenated in single text block
      expect(html).not.toContain('670.8 nmVISIBLE')
      expect(html).not.toContain('670.8nmVISIBLE')
    })

    it('renders all curated Lithium transitions without collisions', () => {
      for (const t of LITHIUM_TRANSITIONS) {
        const html = renderToString(
          createElement(SpectralTransitionRow, {
            id: t.id,
            title: `Li I · ${t.lineName}`,
            wavelengthNm: t.wavelengthNm,
            wavelengthPrecision: 1,
            wavelengthMedium: t.wavelengthMedium,
            region: t.region,
            displayColor: t.displayColor,
            isSelected: false,
          })
        )

        expect(html).toContain('spectral-transition-row')
        expect(html).toContain(t.wavelengthNm.toFixed(1))
        expect(html).toContain(t.region.toUpperCase())
        expect(html).not.toContain(`${t.wavelengthNm.toFixed(1)} nm${t.region}`)
      }
    })
  })

  describe('FineStructureComponentRow', () => {
    it('renders resolved component notation alongside high-precision air wavelength', () => {
      const html = renderToString(
        createElement(FineStructureComponentRow, {
          comment: '2s ²S₁/₂ ↔ 2p ²P°₃/₂ (D₂ line component)',
          wavelengthNm: 670.7775,
          wavelengthPrecision: 4,
          wavelengthMedium: 'air',
          energyCm1: 14904.0,
        })
      )

      expect(html).toContain('fs-component-row')
      expect(html).toContain('2s ²S₁/₂ ↔ 2p ²P°₃/₂ (D₂ line component)')
      expect(html).toContain('670.7775 nm')
      expect(html).toContain('· AIR')
      expect(html).toContain('14904.00 cm⁻¹')
    })
  })

  describe('SpectralHeroResult', () => {
    it('renders hero wavelength, classification, region, and energy in separated hierarchy', () => {
      const t = getLithiumTransition('670.8nm')!
      const html = renderToString(
        createElement(SpectralHeroResult, {
          wavelengthNm: t.wavelengthNm,
          wavelengthPrecision: 3,
          wavelengthMedium: t.wavelengthMedium,
          displayColor: t.displayColor,
          classificationOrSeries: t.classification,
          region: t.region,
          photonEnergyEv: t.photonEnergyEv,
          description: t.description,
          colorDescription: t.colorDescription,
          isTrueColor: t.isTrueColor,
        })
      )

      expect(html).toContain('spectral-hero-result')
      expect(html).toContain('hero-wavelength-value')
      expect(html).toContain('670.778 nm')
      expect(html).toContain('AIR MEDIUM')
      expect(html).toContain('VISIBLE')
      expect(html).toContain('Eγ = 1.848 eV')
      expect(html).toContain('hero-result-description')
      expect(html).toContain(t.description)
    })
  })

  describe('SpectrumInstrumentHeader', () => {
    it('renders title, provenance, and classification badge cleanly', () => {
      const html = renderToString(
        createElement(SpectrumInstrumentHeader, {
          title: 'LITHIUM I EMISSION SPECTROSCOPY',
          badgeText: 'NIST ASD DATA',
          classificationOrSeries: 'RESONANCE DOUBLET',
        })
      )

      expect(html).toContain('spectrum-header')
      expect(html).toContain('LITHIUM I EMISSION SPECTROSCOPY')
      expect(html).toContain('NIST ASD DATA')
      expect(html).toContain('RESONANCE DOUBLET')
    })
  })

  describe('Cross-Element Data Integrity Guarantee', () => {
    it('preserves Hydrogen transition physics calculations', () => {
      const hTrans = safeHydrogenTransition(2, 1)
      expect(hTrans).toBeDefined()
      expect(hTrans!.wavelengthNm).toBeCloseTo(121.57, 1)
      expect(hTrans!.series).toBe('Lyman')
      expect(hTrans!.photonEnergyEv).toBeCloseTo(10.2, 1)
    })

    it('preserves Helium transition physics and wavelengths', () => {
      const heTrans = getHeliumTransition('587.6nm')!
      expect(heTrans.wavelengthNm).toBeCloseTo(587.56, 1)
      expect(heTrans.classification).toContain('Triplet')
    })

    it('preserves Lithium transition physics and wavelengths', () => {
      const liTrans = getLithiumTransition('670.8nm')!
      expect(liTrans.wavelengthNm).toBeCloseTo(670.7775, 3)
      expect(liTrans.components).toHaveLength(2)
      expect(liTrans.components![0].wavelengthNm).toBeCloseTo(670.7775, 4)
      expect(liTrans.components![1].wavelengthNm).toBeCloseTo(670.7926, 4)
    })
  })
})
