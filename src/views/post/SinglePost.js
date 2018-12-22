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
      subheader: moment(this.props.createdAt).format("MMM DD, YYYY HH:mm"),
      topics: this.props.topics
    };
  }

  handleExpandClick = () => {
    this.setState(state => ({ expanded: !state.expanded }));
  };

  upVote = () => {
    this.setState({ voteCount: this.state.voteCount + 1 });
  };

  downVote = () => {
    this.setState({ voteCount: this.state.voteCount - 1 });
  };

  saveToFavorite = () => {
    // save to favorite
  };

  topicClicked = topic => {
    this.props.changeTitle(topic);
    this.props.history.push("/" + topic);
    this.props.onClick(topic);
  };

  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          avatar={
            <Avatar aria-label="Recipe" className={classes.avatar}>
              R {/* //TODO: USER AVATAR*/}
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
        <PdfViewer file={this.props.file} />
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

          <IconButton aria-label="Up vote " onClick={this.upVote}>
            <ArrowUpward />
          </IconButton>
          <IconButton aria-label="Down vote " onClick={this.downVote}>
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
