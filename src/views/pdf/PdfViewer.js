import React, { Component } from "react";
import "react-perfect-scrollbar/dist/css/styles.css";
import PerfectScrollbar from "react-perfect-scrollbar";
import { Document, Page } from "react-pdf";
// import pdf from "./inside.pdf";

import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${
  pdfjs.version
}/pdf.worker.js`;

export default class PdfViewer extends Component {
  state = {
    numPages: null,
    pageNumber: 1
  };

  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };
  handlePdfClick = ({ numPages }) => {
    // window.open(this.props.pdf, "_blank");
    // this.props.history.push("/" + topic + topic.id);
  };

  render() {
    const { pageNumber, numPages } = this.state;

    return (
      <div>
        <PerfectScrollbar
          style={{
            height: "300px",
            top: "10%",
            left: "10%"
          }}
        >
          <Document
            file={this.props.file}
            onLoadSuccess={this.onDocumentLoadSuccess}
          >
            <Page pageNumber={pageNumber} onClick={this.props.onClick} />
          </Document>
        </PerfectScrollbar>
        <p style={{ float: "right", paddingRight: "50px" }}>
          Page {pageNumber} of {numPages}
        </p>
      </div>
    );
  }
}
