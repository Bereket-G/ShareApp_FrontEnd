import React, { Component } from 'react';

const props = {
  // allowFullScreen: false,
  src: "./sample.pdf"
};


export default class PdfViewer extends Component {
  render() {
    return (
      <div
        {...props}
      />
    );
  }

  onError(e) {
    
  }
}