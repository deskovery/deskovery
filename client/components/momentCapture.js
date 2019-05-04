import React, {Component} from 'react'
import ReactPlayer from 'react-player'
import captureVideoFrame from 'capture-video-frame'
import axios from 'axios'

export class Capture extends Component {
  constructor(props) {
    super(props)
    this.state = {
      videoSrc: null,
      playing: true,
      image: null
    }
  }

  async componentDidMount() {
    console.log('**MOUNT**')
    const {data} = await axios.post('/api/videos')
    console.log(data.path)
    debugger
    this.setState({videoSrc: data.path})
  }

  ref = player => {
    this.player = player
  }

  render() {
    console.log('videoSrc', this.state.videoSrc)
    return (
      <div>
        <ReactPlayer
          url={this.state.videoSrc}
          playing={this.state.playing}
          ref={this.ref}
          controls
        />
        <button
          type="button"
          onClick={() => {
            console.log(this.player)
            const frame = captureVideoFrame(this.player.getInternalPlayer())
            console.log('captured frame', frame)
            this.setState({image: frame.dataUri})
          }}
        >
          {' '}
          Capture{' '}
        </button>
        {this.state.image && <img src={this.state.image} width="320px" />}
      </div>
    )
  }
}
