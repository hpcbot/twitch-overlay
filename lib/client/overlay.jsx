/* Overlay - Render a single overlay */
import React from 'react';
import {render} from 'react-dom';

import css from './overlay.css'

import VideoOverlay from './types/videooverlay.jsx'
import HtmlOverlay from './types/htmloverlay.jsx'
import TextOverlay from './types/textoverlay.jsx'

class Overlay extends React.Component {
  constructor(props) {
    super(props);

    this.end = this.end.bind(this);
  }

  render () {
    switch(this.props.type) {
      case 'video':
        return(<VideoOverlay onEnd={this.end} video={this.props.payload.video} />);
        break;
      case 'html':
        return(<HtmlOverlay onEnd={this.end} html={this.props.html} />)
        break;
      case 'text':
        return(<TextOverlay onEnd={this.end} text={this.props.payload.text} />);
      break;
    }
  }

  end() {
    this.props.end(this.props.id);
  }
}

export default Overlay
