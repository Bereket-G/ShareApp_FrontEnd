import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import red from "@material-ui/core/colors/red";
import SinglePost from "./SinglePost";
import { withRouter } from "react-router-dom";
import { pdfjs } from "react-pdf";
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${
  pdfjs.version
}/pdf.worker.js`;
const styles = theme => ({
  card: {
    minWidth: 800,
    maxWidth: 800
  },
  media: {
    height: 0,
    paddingTop: "56.25%" // 16:9
  },
  actions: {
    display: "flex"
  },
  expand: {
    transform: "rotate(0deg)",
    transition: theme.transitions.create("transform", {
      duration: theme.transitions.duration.shortest
    }),
    marginLeft: "auto",
    [theme.breakpoints.up("sm")]: {
      marginRight: -8
    }
  },
  expandOpen: {
    transform: "rotate(180deg)"
  },
  avatar: {
    backgroundColor: red[500]
  },
  chip: {
    marginRight: theme.spacing.unit
  },
  divider: {
    marginTop: theme.spacing.unit,
    marginBottom: theme.spacing.unit,
    marginRight: theme.spacing.unit
  }
});

class PostView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      numPages: null,
      pageNumber: 1,
      post: null
    };
  }

  render() {
    const { post } = this.state;
    return (
      <SinglePost
        changeTitle={this.props.changeTitle}
        enqueueSnackbar={this.props.enqueueSnackbar}
        onClick={this.onClick}
        key={post.id}
        id={post.id}
        user={post.user}
        title={post.title}
        description={post.description}
        file={post.file}
        topics={post.topic}
        createdAt={post.createdAt}
      />
    );
  }
}

PostView.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(PostView));
