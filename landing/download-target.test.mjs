import assert from 'node:assert/strict'
import { resolveDownload } from './download-target.mjs'

const asset = (device) => resolveDownload(device)?.url.split('/').at(-1)

assert.equal(asset({ platform: 'Win32' }), 'imogen-windows-setup.exe')
assert.equal(asset({ platform: 'macOS', architecture: 'arm' }), 'imogen-macos-arm64.dmg')
assert.equal(asset({ platform: 'MacIntel' }), 'imogen-macos-x64.dmg')
assert.equal(asset({ platform: 'Linux x86_64' }), 'orca-linux.AppImage')
assert.equal(asset({ platform: 'Linux', architecture: 'arm' }), 'orca-linux-arm64.AppImage')
assert.equal(resolveDownload({ userAgent: 'Mozilla/5.0 (iPhone; CPU iPhone OS)' }), null)
