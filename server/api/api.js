const router = require('express').Router()
const cors = require('cors')
const fetch = require('node-fetch')
const http = require('http')
const youtubedl = require('@microlink/youtube-dl')
const fs = require('fs')

router.use(cors())
// Allows us to make Cross-origin requests.

router.use(function(req, res, next) {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Expose-Headers', 'Content-Length')
  next()
})
// Sets our cross-origin headers.

function queryToJson(queryString) {
  let res = {}
  let params = queryString.split('&')
  let keyValuePair, key, value

  // eslint-disable-next-line guard-for-in
  for (let i in params) {
    keyValuePair = params[i].split('=')
    key = keyValuePair[0]
    value = keyValuePair[1]
    res[key] = decodeURIComponent(value)
  }
  return res
}
// Parses the initial query from Youtube's Get Video Info and isolates key-value pairs.

function urlParse(data) {
  let tmp = data.adaptive_fmts
  if (tmp) {
    tmp = tmp.split(',')
    // eslint-disable-next-line guard-for-in

    // eslint-disable-next-line guard-for-in
    for (let i in tmp) {
      tmp[i] = queryToJson(tmp[i])

      const filetype = tmp[i].type

      if (filetype.includes('video')) {
        tmp[i].ext = filetype
          .match(/^video\/\w+(?=;)/g)[0]
          .replace(/^video\//, '')
      }
    }

    data.videos = tmp
  }
  data.title = data.title.replace(/\+/g, ' ')
  return data
}
// Isolates URL and file type info from the key-value translated JSON object above.

router.get('/', async (req, res, next) => {
  console.log('GET ROUTE!!')
  const id = 'deWeERCVc2o'
  try {
    const response = await fetch(
      `http://www.youtube.com/get_video_info?html5=1&video_id=${id}`
    )

    const videoData = await response.text()

    const parsedData = queryToJson(videoData)

    const withUrls = urlParse(parsedData)

    res.json(withUrls.videos[2])
  } catch (e) {
    next(e)
  }
})

router.post('/', async (req, res, next) => {
  const id = 'deWeERCVc2o'
  // Will eventually be passed dyanamically to the user.
  try {
    const response = await fetch(
      `http://www.youtube.com/get_video_info?html5=1&video_id=${id}`
    )

    const videoData = await response.text()

    const parsedData = queryToJson(videoData)

    const withUrls = urlParse(parsedData)
    let isolatedUrl = withUrls.videos[2].url
    //Isolates one medium quality URL for download.

    const video = await youtubedl(isolatedUrl)
    //Downloads file.

    console.log('URL:', isolatedUrl)

    // Will be called when the download starts.
    video.on('info', function(info) {
      console.log('Download started')
      console.log('filename: ' + info._filename)
      console.log('size: ' + info.size)
    })

    const videoFile = await video.pipe(
      fs.createWriteStream(`./public/${id}-${Date.now()}.mp4`)
    )
    // Writes video to our desired filepath.

    const fileDownloadPromise = new Promise((resolve, reject) => {
      video.on('end', () => {
        console.log('video download HAS FINISHED')
        resolve()
      })

      video.on('error', error => {
        console.log('video download ERRORED', error)
        reject(error)
      })
    })
    // Manual promise to prevent our API call from returning before download is complete.

    await fileDownloadPromise
    // Specifies that response can not run until promise returns resolve or reject.

    res.send(videoFile)
  } catch (error) {
    next(error)
  }
})


module.exports = router
