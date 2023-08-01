/**
 * Butterfly
 * ramdom cover
 */

'use strict'

let searchedCoverDirectories = false
let imageCoverFiles = []

hexo.extend.filter.register('before_post_render', function (data) {
  const imgTestReg = /\.(png|jpe?g|gif|svg|webp)(\?.*)?$/i
  let randomCover
  let coverVal = data.cover

  // Add path to top_img and cover if post_asset_folder is enabled
  if (hexo.config.post_asset_folder) {
    const topImg = data.top_img
    if (topImg && topImg.indexOf('/') === -1 && imgTestReg.test(topImg)) data.top_img = data.path + topImg
    if (coverVal && coverVal.indexOf('/') === -1 && imgTestReg.test(coverVal)) data.cover = data.path + coverVal
  }


  const randomCoverFn = () => {
    const theme = hexo.theme.config
    if (!(theme.cover && theme.cover.default_cover)) return false
    if (!Array.isArray(theme.cover.default_cover)) {
      theme.cover.default_cover = [theme.cover.default_cover]
    }
    if (!searchedCoverDirectories) {
      searchedCoverDirectories = true
      const fs = require('fs')
      const items = theme.cover.default_cover
      for (let i = 0; i < items.length; i++) {
        const item = items[i]
        if (item.local_path !== undefined && item.web_path !== undefined) {
          const dirName = item.local_path
          const webPath = item.web_path
          if (fs.existsSync(dirName)) {
            const files = fs.readdirSync(dirName)
            for (let j = 0; j < files.length; j++) {
              const file = files[j]
              if (imgTestReg.test(file)) {
                imageCoverFiles.push(webPath + '/' + file)
              }
            }
          }
        } else {
          imageCoverFiles.push(item)
        }
      }
    }
    if (imageCoverFiles.length > 0) {
      const idx = Math.floor(Math.random() * imageCoverFiles.length)
      return imageCoverFiles[idx]
    }
    return false
  }

  if (coverVal === false) return data

  // If cover is not set, use random cover
  if (!coverVal) {
    randomCover = randomCoverFn()
    data.cover = randomCover
    coverVal = randomCover // update coverVal
  }

  if (coverVal) {
    if (coverVal.indexOf('//') !== -1 || imgTestReg.test(coverVal)) {
      data.cover_type = 'img'
      return data
    }
  }

  return data
})
