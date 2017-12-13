/* OverlayList - Display a list of overlays */

import React from 'react';
import {render} from 'react-dom';

// Components
import Overlay from './overlay.jsx'

class OverlayList extends React.Component {
  constructor(props) {
    super(props);
  }

  render () {
    let overlayList = this.props.list.map((overlay, index) =>
      <Overlay
        key={overlay.id}
        id={overlay.id}
        name={overlay.name}
        type={overlay.type}
        video={overlay.video}
        audio={overlay.audio}
        html={overlay.html}
        payload={overlay.payload}
        end={this.props.end}
      />
    );

    return(
      <div>{overlayList}</div>
    );
  }
}

export default OverlayList
