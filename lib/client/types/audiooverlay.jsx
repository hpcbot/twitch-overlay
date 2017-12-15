/* AudioOverlay - Template for playing audio clips */
import React from 'react';
import {render} from 'react-dom';

class AudioOverlay extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    return(
      <div className="audio">
          <center>
            <img src={this.props.image} width="100%"/>
            <br />
            <strong>
              <p className="text">{this.props.text}</p>
            </strong>
          </center>
          <audio onEnded={this.props.onEnd} autoPlay>
            <source src={this.props.audio} type="audio/mp3" />
          </audio>
      </div>
      );
  }
}

export default AudioOverlay
