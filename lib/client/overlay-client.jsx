import React from 'react';
import {render} from 'react-dom';

// Detect hostname for socket.io to connect
const hostname = window && window.location && window.location.hostname;

// Libraries
import openSocket from 'socket.io-client';
const socket = openSocket(hostname + ':3000'); // Connect to the server to get client updates

// Components
import OverlayList from './overlaylist.jsx'

class OverlayPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      overlays: {
        fullscreen: [],
        center: []
      }
    };

    this.updateState = this.updateState.bind(this);
    this.end = this.end.bind(this);

    /* Handle updates from server */
    socket.on('overlays:state', this.updateState);    // Receive state updates from server
  }

  render () {
    return(
      <div>
        <div className="row">
          <div className="col c12" width="100%"><OverlayList list={this.state.overlays.fullscreen} layout="fullscreen" end={this.end}/></div>
        </div>
        <div className="row">
          <div className="col c3" width="100%">blah&nbsp;</div>
          <div className="col c6" width="100%"><OverlayList list={this.state.overlays.center} layout="center" end={this.end}/>&nbsp;</div>
          <div className="col c3" width="100%">blah&nbsp;</div>
        </div>
      </div>
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
