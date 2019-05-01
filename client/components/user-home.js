import React from 'react'
import PropTypes from 'prop-types'
import {connect} from 'react-redux'
import VideoSnapshot from 'video-snapshot'

/**
 * COMPONENT
 */
export const UserHome = props => {
  const {email} = props

  //   return (
  //     <div>
  //       <h3>Welcome, {email}</h3>

  //     </div>
  //   )
  // }

  /**
   * CONTAINER
   */

  const videoSrc = `https://www.youtube.com/embed/z5F1a7_dsrs`

  const onChange = async e => {
    const snapshoter = new VideoSnapshot(e.target.files[0])
    const previewSrc = await snapshoter.takeSnapshot()
    const img = document.createElement('img')

    img.src = previewSrc

    document.body.appendChild(img)
  }

  document.getElementById('video').addEventListener('click', onChange)

  // document.querySelector('iframe').addEventListener('change', onChange)

  return (
    <div>
      <div className="ui embed">
        <iframe title="video player" id="video" src={videoSrc} />
      </div>
      {/* <div className="ui segment">
          <h4 className="ui header">{video.snippet.title}</h4>
          <p>{video.snippet.description}</p> */}
    </div>
    // </div>
  )
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
UserHome.propTypes = {
  email: PropTypes.string
}
