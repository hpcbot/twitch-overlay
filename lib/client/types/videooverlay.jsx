/* VideoOverlay - Template for displaying videos */
import React from 'react';
import {render} from 'react-dom';

class VideoOverlay extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    // Grab the video object once it's available so we can adjust the volume
    this.refs.video.volume = this.props.volume
  }
  render () {
    return(
      <div className="video">
          <center className="videoContainer">
		        <video className='responsive' onEnded={this.props.onEnd} autoPlay ref="video">
              <source src={this.props.video} type='video/mp4' />
            </video>
            <p className="text">{this.props.text}</p>
		      <br />
        </center>
        </div>
      );
  }
}

export default VideoOverlay
