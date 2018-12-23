import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import CssBaseline from "@material-ui/core/CssBaseline";
import Toolbar from "@material-ui/core/Toolbar";
import Fab from "@material-ui/core/Fab";
import AddIcon from "@material-ui/icons/Add";
import Dialog from "@material-ui/core/Dialog";
import DialogActions from "@material-ui/core/DialogActions";
import DialogContent from "@material-ui/core/DialogContent";
import DialogContentText from "@material-ui/core/DialogContentText";
import DialogTitle from "@material-ui/core/DialogTitle";
import Button from "@material-ui/core/Button";
import Avatar from "@material-ui/core/Avatar";
import red from "@material-ui/core/colors/red";
import { withSnackbar } from "notistack";
import { withRouter } from "react-router-dom";

import NewPost from "../views/post/newPost";
import Api from "../api";
import ClientSession from "../api/client-session";

const styles = theme => ({
  avatar: {
    backgroundColor: red[500],
    display: "none"
  },
  text: {
    paddingTop: theme.spacing.unit * 2,
    paddingLeft: theme.spacing.unit * 2,
    paddingRight: theme.spacing.unit * 2
  },
  paper: {
    paddingBottom: 50
  },
  list: {
    marginBottom: theme.spacing.unit * 2
  },
  subHeader: {
    backgroundColor: theme.palette.background.paper
  },
  appBar: {
    top: "auto",
    bottom: 0
  },
  toolbar: {
    alignItems: "center",
    justifyContent: "space-between"
  },
  fabButton: {
    position: "absolute",
    zIndex: 1,
    top: -30,
    left: 0,
    right: 0,
    margin: "0 auto"
  }
});
class Footer extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      title: "",
      description: "",
      topics: [],
      fileList: []
    };
  }

  handleClickOpen = () => {
    this.setState({ open: true });
  };

  handleClose = () => {
    this.setState({ open: false });
  };

  handleSubmit = () => {
    let post = {
      title: this.state.title,
      description: this.state.description
    };
    if (this.state.fileList.length && this.state.title) {
      Api.upload("posts", this.state.fileList)
        .then(response => {
          var files = response.data.result.files.data;
          if (files.length) {
            var file = files[0];
            post.file = `${Api.API_BASE_URL}Containers/${file.container}/download/${file.name}`;
            ClientSession.getAuth((err, value) => {
            
            Api.createRelated("users","posts", value.user.id, post)
              .then(response => {
                this.state.topics.map((topic, idx) => {
                  if (this.state.topics.length - 1 === idx) {
                    return Api.create("post_topics", {
                      postId: response.data.id,
                      topicId: topic.value
                    }).then( response => {
                      window.location.reload()
                    }).catch( error => window.location.reload());
                  }
                  return Api.create("post_topics", {
                    postId: response.data.id,
                    topicId: topic.value
                  });
                });
                this.props.enqueueSnackbar("Post Submitted Successfully", { variant: "success" });
              })
              .catch(error => {
                console.log(error);
                return this.props.enqueueSnackbar("Sorry! upload failed", { variant: "error" });
              });
            });
          }
        })
        .catch(error => {
          console.log(error);
          return this.props.enqueueSnackbar("Sorry! upload failed", { variant: "error" });
        });
        this.setState({ open: false });
    }
    else{
      this.props.enqueueSnackbar("Please Fill the form", { variant: "warning" });

    }
  };

  onFileChooser = files => {
    this.setState({ fileList: [files] });
    return false;
  };

  render() {
    const { classes } = this.props;

    return (
      <React.Fragment>
        <Dialog
          open={this.state.open}
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
          maxWidth="xl"
        >
          <DialogTitle id="form-dialog-title">
            <Avatar aria-label="Plus" className={classes.avatar}>
              + {/* //TODO: USER AVATAR*/}
            </Avatar>{" "}
            New Post
          </DialogTitle>
          <DialogContent>
            <DialogContentText>
              <NewPost
                onTitle={e => this.setState({ title: e.target.value })}
                onDescription={e => this.setState({ description: e.target.value })}
                onTopics={e => this.setState({ topics: e })}
                onDragger={this.onFileChooser}
              />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} color="primary">
              Cancel
            </Button>
            <Button onClick={this.handleSubmit} color="primary">
              Post
            </Button>
          </DialogActions>
        </Dialog>
        <CssBaseline />
        <AppBar position="fixed" color="default" className={classes.appBar}>
          <Fab
            style={{
              top: "-130%",
              right: "-50%"
            }}
            color="secondary"
            aria-label="Add"
            className={classes.fabButton}
            onClick={this.handleClickOpen}
          >
            <AddIcon />
          </Fab>
          <Toolbar className={classes.toolbar}>©myEdu 2018</Toolbar>
        </AppBar>
      </React.Fragment>
    );
  }
}

Footer.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withSnackbar(withStyles(styles)(Footer)));
