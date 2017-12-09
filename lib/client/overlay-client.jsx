import React from 'react';
import {render} from 'react-dom';

// Detect hostname for socket.io to connect
const hostname = window && window.location && window.location.hostname;

// Libraries
import openSocket from 'socket.io-client';
const socket = openSocket(hostname + ':3000'); // Connect to the server to get client updates

// Components
// import css from './overlay-client.css'

class OverlayPlayer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
    };

    this.updateState = this.updateState.bind(this);

    /* Handle updates from server */
    socket.on('state', this.updateState);   // Receive state updates from server
  }

  render () {
    return(
      <div>{this.state}</div>
    );
  }

  updateState(state) {
    this.setState(state);
  }
}


render(<OverlayPlayer/>, document.getElementById('overlays'));
