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
    console.log("CLicked");
    window.open(this.props.pdf, "_blank");
  };

  render() {
    const { pageNumber, numPages } = this.state;

    return (
      <div style={{ alignItems: "center", justifyContent: "center" }}>
        <PerfectScrollbar style={{ height: "300px" }}>
          <Document
            style={{ width: "100%" }}
            file={this.props.file}
            onLoadSuccess={this.onDocumentLoadSuccess}
            noData=""
            onItemClick={this.handlePdfClick}
          >
            <Page
              style={{ alignItems: "center", justifyContent: "center" }}
              pageNumber={pageNumber}
              onClick={this.handlePdfClick}
            />
          </Document>
        </PerfectScrollbar>
        <p style={{ float: "right", paddingRight: "50px" }}>
          Page {pageNumber} of {numPages}
        </p>
      </div>
    );
  }
}
