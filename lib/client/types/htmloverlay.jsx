/* HtmlOverlay - Template for rendering arbitrary html */
import React from 'react';
import {render} from 'react-dom';

import ReactHtmlParser, { processNodes, convertNodeToElement, htmlparser2 } from 'react-html-parser';

class HtmlOverlay extends React.Component {
  constructor(props) {
    super(props);

    this.transform = this.transform.bind(this);
  }

  componentDidMount() {
    ReactHtmlParser(this.props.html, {transform: this.transform});
  }
  render() {
    return <div className="html" dangerouslySetInnerHTML={{__html: this.props.html}} />;
  }

  transform(node) {
    // HACK - Manually load/run script tags
    if (node.type === 'script') {
      const script = document.createElement("script");
      script.id = this.props.id;
      script.src = node.attribs.src;
      script.onEnd = this.end;
      document.body.appendChild(script);
      return null;
    }
  }

  end() {
    console.log('ended!');
  }
}

export default HtmlOverlay
