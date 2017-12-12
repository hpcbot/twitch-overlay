import React from 'react';
import {render} from 'react-dom';

// Detect hostname for socket.io to connect
const hostname = window && window.location && window.location.hostname;

// Libraries
import openSocket from 'socket.io-client';
const socket = openSocket(hostname + ':3000'); // Connect to the server to get client updates

// Components
import Overlay from './overlay.jsx'

class OverlayPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      overlays: []
    };

    this.updateState = this.updateState.bind(this);
    this.end = this.end.bind(this);

    /* Handle updates from server */
    socket.on('overlays:state', this.updateState);    // Receive state updates from server
  }

  render () {
    this.overlaylist = this.state.overlays.map((overlay, index) =>
      <Overlay
        key={overlay.id}
        id={overlay.id}
        name={overlay.name}
        type={overlay.type}
        video={overlay.video}
        html={overlay.html}
        payload={overlay.payload}
        end={this.end}
      />
    );
    return(
      <div>{this.overlaylist}</div>
    );
  }

  updateState(state) {
    this.setState(state);
  }

  end(id) {
    socket.emit('endOverlay', id);
  }
}


render(<OverlayPlayer/>, document.getElementById('overlays'));
