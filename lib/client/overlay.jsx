/* Overlay - Render a single overlay */
import React from 'react';
import {render} from 'react-dom';

import css from './overlay.css'

class Overlay extends React.Component {
  constructor(props) {
    super(props);

    this.end = this.end.bind(this);
  }

  render () {
    if(this.props.type == 'video') {
      // Render video template
      return(
        <div className="video">
          <center>
		        <video className='responsive' onEnded={this.end} width='900' height='700' autoPlay>
              <source src={this.props.video} type='video/mp4' />
            </video>
		      <br />
        </center>
        </div>
      );
    } else {
      return(
        <div>
          {this.props.name}
        </div>);
    }
  }

  end() {
    this.props.end(this.props.id);
  }
}

export default Overlay
