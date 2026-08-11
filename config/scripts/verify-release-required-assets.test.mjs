import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  extractManifestAssetNames,
  getRequiredReleaseAssetNames,
  verifyRequiredReleaseAssets
} from './verify-release-required-assets.mjs'

function jsonResponse(body) {
  return {
    ok: true,
    status: 200,
    statusText: 'OK',
    json: vi.fn(async () => body),
    text: vi.fn(async () => (typeof body === 'string' ? body : JSON.stringify(body)))
  }
}

function releaseWithAssets(tag, assetNames) {
  return {
    tag_name: tag,
    draft: true,
    prerelease: false,
    assets: assetNames.map((name, index) => ({
      id: index + 1,
      name,
      state: 'uploaded',
      size: 123
    }))
  }
}

afterEach(() => {
  vi.unstubAllGlobals()
})

describe('getRequiredReleaseAssetNames', () => {
  it('includes x64 and arm64 Linux assets', () => {
    expect(getRequiredReleaseAssetNames('v1.4.27')).toEqual(
      expect.arrayContaining([
        'latest-linux-arm64.yml',
        'orca-linux.AppImage',
        'orca-linux-arm64.AppImage',
        'orca-ide_1.4.27_amd64.deb',
        'orca-ide_1.4.27_arm64.deb',
        'orca-ide-1.4.27.x86_64.rpm',
        'orca-ide-1.4.27.aarch64.rpm'
      ])
    )
  })

  it('includes unsigned Imogen macOS DMGs', () => {
    expect(getRequiredReleaseAssetNames('v1.4.27')).toEqual(
      expect.arrayContaining([
        'latest-mac.yml',
        'imogen-macos-arm64.dmg',
        'imogen-macos-arm64.dmg.blockmap',
        'imogen-macos-x64.dmg',
        'imogen-macos-x64.dmg.blockmap'
      ])
    )
  })
})

describe('extractManifestAssetNames', () => {
  it('extracts relative and absolute manifest asset names', () => {
    expect(
      extractManifestAssetNames(
        [
          'files:',
          '  - url: ImogenAI-1.4.27-arm64-mac.zip',
          '  - url: https://example.com/downloads/imogen-windows-setup.exe',
          'path: orca-linux.AppImage'
        ].join('\n')
      )
    ).toEqual(['ImogenAI-1.4.27-arm64-mac.zip', 'imogen-windows-setup.exe', 'orca-linux.AppImage'])
  })
})

describe('verifyRequiredReleaseAssets', () => {
  it('fails when a manifest-referenced asset has not been uploaded', async () => {
    const tag = 'v1.4.27'
    const required = getRequiredReleaseAssetNames(tag)
    const assets = required.filter((name) => name !== 'orca-linux-arm64.AppImage')
    const release = releaseWithAssets(tag, assets)
    const latestLinuxAsset = release.assets.find((asset) => asset.name === 'latest-linux.yml')
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse([release]))
      .mockResolvedValueOnce(jsonResponse('version: 1.4.27\n'))
      .mockResolvedValue(jsonResponse('version: 1.4.27\n'))
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      verifyRequiredReleaseAssets({ repo: 'stablyai/orca', tag, token: 'token' })
    ).rejects.toThrow('Missing: orca-linux-arm64.AppImage')
    expect(latestLinuxAsset).toBeTruthy()
  })

  it('checks assets referenced by the Linux arm64 updater manifest', async () => {
    const tag = 'v1.4.27'
    const required = getRequiredReleaseAssetNames(tag)
    const release = releaseWithAssets(tag, required)
    const arm64Manifest = release.assets.find((asset) => asset.name === 'latest-linux-arm64.yml')
    const fetchMock = vi
      .fn()
      .mockResolvedValueOnce(jsonResponse([release]))
      .mockResolvedValueOnce(jsonResponse('version: 1.4.27\n'))
      .mockResolvedValueOnce(
        jsonResponse(
          [
            'version: 1.4.27',
            'files:',
            '  - url: orca-linux-arm64.AppImage.blockmap',
            'path: orca-linux-arm64.AppImage'
          ].join('\n')
        )
      )
      .mockResolvedValue(jsonResponse('version: 1.4.27\n'))
    vi.stubGlobal('fetch', fetchMock)

    await expect(
      verifyRequiredReleaseAssets({ repo: 'stablyai/orca', tag, token: 'token' })
    ).rejects.toThrow('Missing: orca-linux-arm64.AppImage.blockmap')
    expect(arm64Manifest).toBeTruthy()
  })
})
