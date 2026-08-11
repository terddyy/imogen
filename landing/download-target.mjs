const RELEASES = 'https://github.com/terddyy/imogen/releases/latest'

const target = (asset, label) => ({ url: `${RELEASES}/download/${asset}`, label })

export function resolveDownload({ userAgent = '', platform = '', architecture = '' } = {}) {
  const device = `${platform} ${userAgent}`.toLowerCase()
  const arm = /arm|aarch/.test(`${architecture} ${device}`)

  if (/android|iphone|ipad|ipod/.test(device)) return null
  if (/windows|win32|win64/.test(device)) return target('orca-windows-setup.exe', 'Windows')
  if (/mac|darwin/.test(device)) {
    return target(arm ? 'orca-macos-arm64.dmg' : 'orca-macos-x64.dmg', 'macOS')
  }
  if (/linux|x11/.test(device)) {
    return target(arm ? 'orca-linux-arm64.AppImage' : 'orca-linux.AppImage', 'Linux')
  }
  return null
}

function applyDownload(target) {
  if (!target) return

  for (const link of document.querySelectorAll('a[href$="/releases/latest"]')) {
    link.href = target.url
    link.setAttribute('aria-label', `Download ImogenAI for ${target.label}`)
    if (link.textContent?.includes('Download ImogenAI')) {
      link.textContent = `Download for ${target.label} ↓`
    }
  }
}

async function detectDownload() {
  const navigatorData = globalThis.navigator
  const base = {
    userAgent: navigatorData.userAgent,
    platform: navigatorData.platform,
    architecture: ''
  }

  applyDownload(resolveDownload(base))

  try {
    const hints = await navigatorData.userAgentData?.getHighEntropyValues([
      'architecture',
      'platform'
    ])
    applyDownload(resolveDownload({ ...base, ...hints }))
  } catch {
    // Browser hints are optional; the user agent fallback remains usable.
  }
}

if (typeof document !== 'undefined') void detectDownload()
