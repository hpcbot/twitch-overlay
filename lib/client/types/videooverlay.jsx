/* VideoOverlay - Template for displaying videos */
import React from 'react';
import {render} from 'react-dom';

class VideoOverlay extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return(
      <div className="video">
          <center>
		        <video className='responsive' onEnded={this.props.onEnd} width='900' height='700' autoPlay>
              <source src={this.props.video} type='video/mp4' />
            </video>
		      <br />
        </center>
        </div>
      );
  }
}

export default VideoOverlay
