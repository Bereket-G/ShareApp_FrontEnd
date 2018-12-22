import React from "react";
import PropTypes from "prop-types";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import Card from "@material-ui/core/Card";
import CardHeader from "@material-ui/core/CardHeader";
import CardContent from "@material-ui/core/CardContent";
// import CardActions from "@material-ui/core/CardActions";
// import Avatar from "@material-ui/core/Avatar";
import IconButton from "@material-ui/core/IconButton";
import Typography from "@material-ui/core/Typography";
import red from "@material-ui/core/colors/red";
// import FavoriteIcon from "@material-ui/icons/Favorite";
// import ShareIcon from "@material-ui/icons/Share";
import MoreVertIcon from "@material-ui/icons/MoreVert";
import { withSnackbar } from 'notistack';
import Api from "../../api";
import ClientSession from '../../api/client-session';

const styles = theme => ({
  card: {
    maxWidth: 350,
    minWidth: 280,
    float: "right",
    marginRight: "5%",
    marginTop: "2%"
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
  }
});

class Topic extends React.Component {
  state = { expanded: false, topic:{}, subscribed: false };

  componentDidMount(){
    this.getTopic();
  }

  getTopic = () => {
    let filter =`filter={"where":{"name":"${this.props.topicTitle}"}}`
    Api.find('topics', null, filter)
          .then( response => {
            if(response.data.length)
              this.setSubscriptionStatus(response.data[0])
              this.setState({topic: response.data[0]})
          }).catch( error => console.log(error))
  }

  subscribe = () => {
    let data = {topicId: this.state.topic.id}
    ClientSession.getAuth((err, value) => {
      if(!value) return window.location.reload();
      data.userId = value.user.id;
    });
    Api.create('subscriptions/upsertWithWhere', data, `where=${JSON.stringify(data)}`)
        .then( response => {
          this.setState({subscribed:true});
          this.props.enqueueSnackbar("Subscribed to the topic Successfully!", {variant:"success"});
        }).catch(error => {
          this.props.enqueueSnackbar("Unable to subscribe to topic, please try again!", {variant:"error"});
        })
  }


  unsubscribe = () => {
    let data = {topicId: this.state.topic.id}
    ClientSession.getAuth((err, value) => {
      if(!value) return window.location.reload();
      data.userId = value.user.id;
    });
    Api.find('subscriptions',null,`filter={"where":${JSON.stringify(data)}}`)
        .then( response => {
          if(response.data.length){
            Api.destroy('subscriptions', response.data[0].id)
              .then( response => {
                this.setState({subscribed:false})
                this.props.enqueueSnackbar("Unsubscribed Successfully!", {variant:"success"});
              }).catch(error => {
                this.props.enqueueSnackbar("Error, please try again!", {variant:"error"});
              })
          }
        }).catch(error => {
          this.props.enqueueSnackbar("Error, please try again!", {variant:"error"});
        })
  }


  setSubscriptionStatus = (topic) => {
    let m_topic = topic || this.state.topic;
    ClientSession.getAuth((err, value) => {
      if(!value) return window.location.reload();
      let userId = value.user.id;
      let filter = `filter={"where":{"userId":"${userId}","topicId":"${m_topic.id}"}}`
      Api.find('subscriptions', null, filter)
          .then( response => {
            if(response.data.length){
              this.setState({subscribed:true});
            }
          }).catch(error => console.log(error));
    });
  }


  render() {
    const { classes } = this.props;

    return (
      <Card className={classes.card}>
        <CardHeader
          action={
            <IconButton>
              <MoreVertIcon />
            </IconButton>
          }
          title={this.props.topicTitle}
        />

        <CardContent style={{ justifyContent: "center", alignItems: "center" }}>
          <Typography component="p">{this.props.topicDesc}</Typography>

          {this.props.topicTitle === "Home"?"":
          <Button
            style={{ width: "100%" }}
            variant="contained"
            color={this.state.subscribed?"default":"primary"}
            className={classes.button}
            onClick={this.state.subscribed?this.unsubscribe:this.subscribe}
            >
            {this.state.subscribed?"UN":""}SUBSCRIBE
          </Button>}
        </CardContent>
      </Card>
    );
  }
}

Topic.propTypes = {
  classes: PropTypes.object.isRequired
};

export default withSnackbar(withStyles(styles)(Topic));
