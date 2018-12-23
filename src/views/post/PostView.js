import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import classnames from "classnames";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
// import CardMedia from "@material-ui/core/CardMedia";
import CardContent from "@material-ui/core/CardContent";
import CardActions from "@material-ui/core/CardActions";
// import Collapse from '@material-ui/core/Collapse';
import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import red from "@material-ui/core/colors/red";
import FavoriteIcon from "@material-ui/icons/Favorite";
import ArrowBackIos from "@material-ui/icons/ArrowBackIos";
import ArrowForwardIos from "@material-ui/icons/ArrowForwardIos";
import ShareIcon from "@material-ui/icons/Share";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
// import Badge from '@material-ui/core/Badge';
import Chip from "@material-ui/core/Chip";
import Divider from "@material-ui/core/Divider";

import { withRouter } from "react-router-dom";
import { Document, Page } from "react-pdf";

// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import moment from "moment";
import Api from "../../api";
import ClientSession from "../../api/client-session";
import { pdfjs } from "react-pdf";
import Comment from "./Comment";
import NewComment from "./newComment";
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
      post: {},
      voteCount: 0,
      upvoted: false,
      downvoted: false,
      numPages: null,
      pageNumber: 1,
      comments : []
    };
  }
  onDocumentLoadSuccess = ({ numPages }) => {
    this.setState({ numPages });
  };

  componentDidMount() {
    this.getPost();
    this.getVoteCount();
    this.setVoteStatus();
  }

  getPost = () => {
    let id = this.props.match.params.id;
    Api.find("posts", id, `filter={"include":"user"}`)
      .then(response => {
        Api.findRelated("posts", "topics", response.data.id).then(response2 => {
          response.data.topics = response2.data;
          this.setState({ post: response.data });
        });
      })
      .catch(error => console.log(error));
  };

  upVote = () => {
    let data = { postId: this.props.match.params.id };
    ClientSession.getAuth((err, value) => {
      if (!value) return window.location.reload();
      data.userId = value.user.id;
    });
    let where = `where=${JSON.stringify(data)}`;
    data.upVote = true;
    Api.create("votes/upsertWithWhere", data, where)
      .then(response => {
        this.setState({ upvoted: true, downvoted: false });
        this.getVoteCount();
        // this.props.enqueueSnackbar("Upvoted!", {variant:"success"});
      })
      .catch(error => {
        this.getVoteCount();
        // this.props.enqueueSnackbar("Error!", {variant:"error"});
      });
  };
  deleteUpVote = () => {
    let data = { postId: this.props.match.params.id };
    ClientSession.getAuth((err, value) => {
      if (!value) return window.location.reload();
      data.userId = value.user.id;
    });
    data.upVote = true;
    Api.find("votes", null, `filter={"where":${JSON.stringify(data)}}`)
      .then(response => {
        if (response.data.length) {
          Api.destroy("votes", response.data[0].id)
            .then(response => {
              this.setState({ upvoted: false, downvoted: false });
              this.getVoteCount();
            })
            .catch(error => {
              this.getVoteCount();
            });
        }
      })
      .catch(error => {
        this.getVoteCount();
      });
  };
  deleteDownVote = () => {
    let data = { postId: this.props.match.params.id };
    ClientSession.getAuth((err, value) => {
      if (!value) return window.location.reload();
      data.userId = value.user.id;
    });
    data.upVote = false;
    Api.find("votes", null, `filter={"where":${JSON.stringify(data)}}`)
      .then(response => {
        if (response.data.length) {
          Api.destroy("votes", response.data[0].id)
            .then(response => {
              this.setState({ downvoted: false, upvoted: false });
              this.getVoteCount();
            })
            .catch(error => {
              this.getVoteCount();
            });
        }
      })
      .catch(error => {
        this.getVoteCount();
      });
  };
  downVote = () => {
    let data = { postId: this.props.match.params.id };
    ClientSession.getAuth((err, value) => {
      if (!value) return window.location.reload();
      data.userId = value.user.id;
    });
    let where = `where=${JSON.stringify(data)}`;
    data.upVote = false;
    Api.create("votes/upsertWithWhere", data, where)
      .then(response => {
        this.setState({ downvoted: true, upvoted: false });
        this.getVoteCount();
        // this.props.enqueueSnackbar("Downvoted!", {variant:"info"});
      })
      .catch(error => {
        this.getVoteCount();
        // this.props.enqueueSnackbar("Error!", {variant:"error"});
      });
  };

  getVoteCount = () => {
    let filter = `filter={"where":{"postId":"${this.props.match.params.id}"}}`;
    let count = 0;
    Api.find("votes", null, filter).then(response => {
      if (!response.data.length) {
        this.setState({ voteCount: 0 });
      }
      response.data.map(vote => {
        if (vote.upVote) {
          count++;
        } else {
          count--;
        }
        this.setState({ voteCount: count });
      });
    });
  };

  setVoteStatus = () => {
    let postId = this.props.match.params.id;
    ClientSession.getAuth((err, value) => {
      if (!value) return window.location.reload();
      let userId = value.user.id;
      let filter = `filter={"where":{"userId":"${userId}","postId":"${postId}"}}`;
      Api.find("votes", null, filter)
        .then(response => {
          if (response.data.length && response.data[0]) {
            this.setState({
              upvoted: response.data[0].upVote,
              downvoted: !response.data[0].upVote
            });
          }
        })
        .catch(error => console.log(error));
    });
  };

  saveToFavorite = () => {
    // save to favorite
  };

  topicClicked = topic => {
    this.props.changeTitle(topic);
    this.props.history.push("/" + topic);
    this.props.onClick(topic);
  };

  increasePageNumber = () => {
    this.setState(prev => ({
      pageNumber: prev.pageNumber + 1 <= prev.numPages ? prev.pageNumber + 1 : prev.numPages
    }));
  };
  decreasePageNumber = () => {
    this.setState(prev => ({
      pageNumber: prev.pageNumber - 1 >= 1 ? prev.pageNumber - 1 : 1
    }));
  };

  onCommentSubmit = (comment_body) => {

      ClientSession.getAuth((err, value) => {
          if (!value) return window.location.reload();

          let new_comment = {
              body: comment_body,
              username : value.user.firstname
          };

          let new_comments = this.state.comments;
          new_comments.push(new_comment);

          this.setState({ comments : new_comments });

      });

  };

  handlePostClick = () => {
    //   this.props.history.push("/" + this.props.match.params.topic + )
  };
  render() {
    const { classes } = this.props;
    const { pageNumber, numPages } = this.state;

    return (
      <div
        style={{
          alignContent: "center",
          alignItems: "center",
          justifyContent: "center",
          display: "flex",
          marginTop: "5%",
          marginBottom: "5%"
        }}
      >
        <Card className={classes.card}>
          <CardHeader
            avatar={
              <Avatar aria-label="Recipe" className={classes.avatar}>
                {this.state.post && this.state.post.user ? this.state.post.user.firstname[0] : ""}
              </Avatar>
            }
            action={
              <IconButton>
                <MoreVertIcon />
              </IconButton>
            }
            title={this.state.post.title ? this.state.post.title : ""}
            subheader={
              moment(this.state.post ? this.state.post.createdAt : "").format("HH:mm on MMM DD") +
              " by " +
              (this.state.post && this.state.post.user ? this.state.post.user.firstname : "")
            }
          />

          <Document
            file={this.state.post ? this.state.post.file : ""}
            onLoadSuccess={this.onDocumentLoadSuccess}
          >
            <Page pageNumber={pageNumber} onClick={this.props.onClick} />
          </Document>

          <p style={{ float: "right", paddingRight: "100px" }}>
            <ArrowBackIos
              style={{ cursor: "pointer", paddingRight: "5px" }}
              onClick={this.decreasePageNumber}
            />
            <ArrowForwardIos
              style={{ cursor: "pointer", paddingRight: "5px" }}
              onClick={this.increasePageNumber}
            />
            <br />
            Page {pageNumber} of {numPages}
          </p>
          <br />
          <CardContent style={{ marginTop: "10px" }}>
            <Typography component="p">
              {this.state.post ? this.state.post.description : ""}
            </Typography>

            <Divider variant="middle" className={classes.divider} />
            <br />

            {this.state.post && this.state.post.topic
              ? this.state.post.topic.map((value, idx) => {
                  return (
                    <Chip
                      className={classes.chip}
                      key={value.id}
                      label={value.name}
                      color="primary"
                      variant="outlined"
                      onClick={() => this.topicClicked(value.name)}
                    />
                  );
                })
              : ""}
          </CardContent>
          <CardActions className={classes.actions} disableActionSpacing>
            <IconButton aria-label="vote count">{this.state.voteCount}</IconButton>
            <IconButton
              aria-label="Up vote "
              onClick={this.state.upvoted ? this.deleteUpVote : this.upVote}
              color={this.state.upvoted ? "secondary" : "inherit"}
            >
              <ArrowUpward />
            </IconButton>
            <IconButton
              aria-label="Down vote "
              onClick={this.state.downvoted ? this.deleteDownVote : this.downVote}
              color={this.state.downvoted ? "secondary" : "inherit"}
            >
              <ArrowDownward />
            </IconButton>
            <IconButton aria-label="Add to favorites" onClick={this.saveToFavorite}>
              <FavoriteIcon />
            </IconButton>
            <IconButton aria-label="Share">
              <ShareIcon />
            </IconButton>
            <IconButton
              className={classnames(classes.expand, {
                [classes.expandOpen]: this.state.expanded
              })}
              onClick={this.handleExpandClick}
              aria-expanded={this.state.expanded}
              aria-label="Show more"
            />
          </CardActions>

          <div style={{ padding : "10px",backgroundColor : "rgba(0, 0, 0, 0.1)"}}>

          <NewComment submit={this.onCommentSubmit}/>

            {
              this.state.comments.map( (comment, idx) => {
                  return (
                      <Comment key={idx} username={comment.username} body={comment.body}/>
                  )
              })
            }

          </div>
        </Card>
      </div>
    );
  }
}

PostView.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(PostView));
