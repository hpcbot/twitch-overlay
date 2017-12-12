/* TextOverlay - Template for speaking to stream */
import React from 'react';
import {render} from 'react-dom';

class TextOverlay extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    window.responsiveVoice.speak(this.props.text, 'US English Female', {onend: this.props.onEnd()});

    return(
      <div className="text">
          <center>
            {this.props.text}
          </center>
      </div>
    );
  }
}

export default TextOverlay
