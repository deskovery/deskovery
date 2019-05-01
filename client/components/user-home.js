import React, {Component} from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import YouTubePlayer from 'react-player/lib/players/YouTube'
import captureVideoFrame from 'capture-video-frame'
// import {captureVideoFrame} from '../utils/capture'

/**
 * COMPONENT
 *
 */

class UserHome extends Component {
  constructor(props) {
    super(props)
    this.state = {
      playing: true,
      image: null
    }
    this.onCapture = this.onCapture.bind(this)
  }

  onCapture() {
    console.log(captureVideoFrame)
    const video = this.player.getInternalPlayer()
    console.log('video', video)
    const frame = captureVideoFrame('video', 'png')
    console.log('frame', frame)
    this.setState({image: frame.dataUri})
  }
  // const {email} = props
  ref = youtube => {
    this.player = youtube
  }

  render() {
    let player = null
    return (
      <div>
        <YouTubePlayer
          url="https://www.youtube.com/watch?v=z5F1a7_dsrs"
          playing={this.state.playing}
          ref={this.ref}
          controls
        />
        <button type="button" onClick={this.onCapture}>
          {' '}
          Capture{' '}
        </button>
        {this.state.image && <img src={this.state.image} width="320px" />}
      </div>
    )
  }
}

const mapState = state => {
  return {
    email: state.user.email
  }
}

export default connect(mapState)(UserHome)

/**
 * PROP TYPES
 */

//   return (
//     <div>
//       <h3>Welcome, {email}</h3>

//     </div>
//   )
// }

/**
 * CONTAINER
 */

// const capture = () => {
//   var canvas = document.getElementById('canvas')
//   var video = document.getElementById('video')
//   canvas.width = video.videoWidth
//   canvas.height = video.videoHeight
//   canvas
//     .getContext('2d')
//     .drawImage(video, 0, 0, video.videoWidth, video.videoHeight)

//   // canvas.toBlob() = (blob) => {
//   //   const img = new Image();
//   //   img.src = window.URL.createObjectUrl(blob);
//   // };
// }

// const videoSrc = `https://www.youtube.com/embed/z5F1a7_dsrs`

// return (
//   <div className="ui embed" id="canvas">
//     <iframe title="video player" id="video" src={videoSrc} />
//     {/* </div> */}
//     {/* <div className="ui segment">
//         <h4 className="ui header">{video.snippet.title}</h4>
//         <p>{video.snippet.description}</p> */}
//     {/* <button type="button" onClick={capture}>
//       Capture
//     </button>
//     <canvas id="canvas" /> */}
//   </div>
// )
