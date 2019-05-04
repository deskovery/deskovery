const router = require('express').Router()
const cors = require('cors')
const fetch = require('node-fetch')
const http = require('http')
const youtubedl = require('@microlink/youtube-dl')
const fs = require('fs')

// fs.mkdir('videos')
// fs.mkdirSync('videos')

router.use(cors())

router.use(function(req, res, next) {
  res.set('Access-Control-Allow-Origin', '*')
  res.set('Access-Control-Expose-Headers', 'Content-Length')
  next()
})

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
  try {
    const response = await fetch(
      `http://www.youtube.com/get_video_info?html5=1&video_id=${id}`
    )

    const videoData = await response.text()

    const parsedData = queryToJson(videoData)

    const withUrls = urlParse(parsedData)
    let isolatedUrl = withUrls.videos[2].url

    var video = youtubedl(
      isolatedUrl
      // // Optional arguments passed to youtube-dl.
      // ['--format=18'],
      // // Additional options can be given for calling `child_process.execFile()`.
      // {cwd: __dirname}
    )
    console.log('URL:', isolatedUrl)
    // Will be called when the download starts.
    video.on('info', function(info) {
      console.log('Download started')
      console.log('filename: ' + info._filename)
      console.log('size: ' + info.size)
    })

    //fs.createReadStream('somepath/somefile').pipe(fs.createWriteStream('file.js'));

    const videoFile = await video.pipe(
      fs.createWriteStream(`./testing2-${id}.mp4`)
    )

    // const videoFile = fs
    //   .createReadStream('../../public')
    //   .pipe(`testing-${id}.mp4`)

    console.log('VIDEO FILE', videoFile)
    //res.send(videoFile)
    // res.writeHead(200, {
    //   'Content-Type': 'video/mp4',
    //   'Content-Disposition': `attachment; filename=${id}.mp4`
    //   //'Content-Length': videoFile.legnth
    // })
    res.send(videoFile)
    // res.json(withUrls.videos[0].url)
  } catch (e) {
    next(e)
  }
})

module.exports = router
