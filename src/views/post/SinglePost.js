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
import ShareIcon from "@material-ui/icons/Share";
import ArrowUpward from "@material-ui/icons/ArrowUpward";
import ArrowDownward from "@material-ui/icons/ArrowDownward";
// import Badge from '@material-ui/core/Badge';
import Chip from "@material-ui/core/Chip";
import Divider from "@material-ui/core/Divider";

import { withRouter } from "react-router-dom";

// import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import MoreVertIcon from "@material-ui/icons/MoreVert";
import PdfViewer from "../pdf/PdfViewer";
import moment from "moment";
import Api from '../../api';
import ClientSession from '../../api/client-session';

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

class SinglePost extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      expanded: false,
      title: this.props.title,
      voteCount: 0,
      upvoted: false,
      downvoted: false,
      subheader: moment(this.props.createdAt).format("HH:mm on MMM DD")+" by "+this.props.user.firstname,
      topics: this.props.topics
    };
  }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  componentDidMount() {
    this.getVoteCount();
    this.setVoteStatus();
  }

  upVote = () => {
    let data = {postId: this.props.id}
    ClientSession.getAuth((err, value) => {
      if(!value) return window.location.reload();
      data.userId = value.user.id;
    });
    let where = `where=${JSON.stringify(data)}`;
    data.upVote = true;
    Api.create('votes/upsertWithWhere', data, where)
        .then( response => {
          this.setState({upvoted:true, downvoted:false})
          this.getVoteCount();
          // this.props.enqueueSnackbar("Upvoted!", {variant:"success"});
        }).catch(error => {
          this.getVoteCount();
          // this.props.enqueueSnackbar("Error!", {variant:"error"});
        })
  };
  deleteUpVote = () => {
    let data = {postId: this.props.id}
    ClientSession.getAuth((err, value) => {
      if(!value) return window.location.reload();
      data.userId = value.user.id;
    });
    data.upVote = true;
    Api.find('votes',null,`filter={"where":${JSON.stringify(data)}}`)
        .then( response => {
          if(response.data.length){
            Api.destroy('votes', response.data[0].id)
              .then( response => {
                this.setState({upvoted:false,downvoted:false})
                this.getVoteCount();
              }).catch(error => {
                this.getVoteCount();
              })
          }
        }).catch(error => {
          this.getVoteCount();
        })
  }
  deleteDownVote = () => {
    let data = {postId: this.props.id}
    ClientSession.getAuth((err, value) => {
      if(!value) return window.location.reload();
      data.userId = value.user.id;
    });
    data.upVote = false;
    Api.find('votes',null,`filter={"where":${JSON.stringify(data)}}`)
        .then( response => {
          if(response.data.length){
            Api.destroy('votes', response.data[0].id)
              .then( response => {
                this.setState({downvoted:false, upvoted:false})
                this.getVoteCount();
              }).catch(error => {
                this.getVoteCount();
              })
          }
        }).catch(error => {
          this.getVoteCount();
        })
  }
  downVote = () => {
    let data = {postId: this.props.id}
    ClientSession.getAuth((err, value) => {
      if(!value) return window.location.reload();
      data.userId = value.user.id;
    });
    let where = `where=${JSON.stringify(data)}`;
    data.upVote = false;
    Api.create('votes/upsertWithWhere', data, where)
        .then( response => {
          this.setState({downvoted:true, upvoted:false})
          this.getVoteCount();
          // this.props.enqueueSnackbar("Downvoted!", {variant:"info"});
        }).catch(error => {
          this.getVoteCount();
          // this.props.enqueueSnackbar("Error!", {variant:"error"});
        })
  };

  getVoteCount = () => {
    let filter = `filter={"where":{"postId":"${this.props.id}"}}`
    let count = 0;
    Api.find('votes', null, filter)
      .then( response => {
        if(!response.data.length){
          this.setState({voteCount: 0})
        }
        response.data.map( vote => {
          if(vote.upVote){
            count++;
          }
          else {
            count--;
          }
          this.setState({voteCount: count})
        })
      })
  }

  setVoteStatus = () => {
    let postId = this.props.id;
    ClientSession.getAuth((err, value) => {
      if(!value) return window.location.reload();
      let userId = value.user.id;
      let filter = `filter={"where":{"userId":"${userId}","postId":"${postId}"}}`
      Api.find('votes', null, filter)
          .then( response => {
            if(response.data.length && response.data[0]){
              this.setState({upvoted:response.data[0].upVote, downvoted: !response.data[0].upVote});
            }
          }).catch(error => console.log(error));
    });
  }

  saveToFavorite = () => {
    // save to favorite
  };

  topicClicked = topic => {
    this.props.changeTitle(topic);
    this.props.history.push("/" + topic);
  };

  handlePostClick = () => {
    //   this.props.history.push("/" + this.props.match.params.topic + )
  };
  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="Recipe" className={classes.avatar}>
              {this.props.user.firstname[0]}
            </Avatar>
          }
          action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          title={this.state.title}
          subheader={this.state.subheader}
        />
        <PdfViewer file={this.props.file} onClick={this.props.onItemClick}/>
        <CardContent>
          <Typography component="p">{this.props.description}</Typography>

          <Divider variant="middle" className={classes.divider} />
          <br />

          {this.state.topics.map((value, idx) => {
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
          })}
        </CardContent>
        <CardActions className={classes.actions} disableActionSpacing>

          <IconButton aria-label="vote count">{this.state.voteCount}</IconButton>
          <IconButton aria-label="Up vote " onClick={this.state.upvoted? this.deleteUpVote:this.upVote} color={this.state.upvoted?"secondary":"inherit"}>
            <ArrowUpward />
          </IconButton>
          <IconButton aria-label="Down vote " onClick={this.state.downvoted?this.deleteDownVote:this.downVote} color={this.state.downvoted?"secondary":"inherit"}>
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
      </Card>
    );
  }
}

SinglePost.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withRouter(withStyles(styles)(SinglePost));
