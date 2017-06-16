/*
© 2017-present VoiceBase Inc. and Harald Rudell (https://www.voicebase.com) <support@voicebase.com>
This source code is licensed under the MIT-style license found in the LICENSE file in the root directory of this source tree.
*/
import packageJson from '../package.json'

import os from 'os'

const now = new Date().toISOString()

export const versionObject = {
  keyVersionMarker: '1',
  productName: 'Transcript Director',
  packageName: packageJson.name,
  productVersion: packageJson.version,
  computerName: os.hostname(),
  buildTime: `${now.substring(0,10)} ${now.substring(11,19)}${now.substring(23)}`, // '2017-06-15 17:39:41Z'
}
export const versionKey = 'VoiceBaseDemoAppVersion'
export const versionValue = Object.values(versionObject).join(',')
export const versionString = `${versionObject.productName} version: ${versionObject.productVersion} package: ${versionObject.packageName} built: ${versionObject.buildTime} on: ${versionObject.computerName}` 
