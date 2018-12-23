import React, { Component } from 'react'
import Avatar from "@material-ui/core/Avatar";
import PropTypes from "prop-types";
import Typography from '@material-ui/core/Typography';

export default class Comment extends Component {

    render() {
        return (
            <div style={{ width : "80%", marginLeft : "50px", marginBottom : "15px"}}>
              <Avatar aria-label="Recipe" style={{float : "left" }}>
                  {this.props.username.charAt(0)} {/* //TODO: USER AVATAR*/}
              </Avatar>

              <div style={{marginLeft : "10px", paddingLeft : "45px"}}>

                <Typography style={{fontSize : 14}} component="h2">
                    {this.props.username}
                </Typography>
                <Typography style={{fontSize : 12}} color="textSecondary" gutterBottom>
                    {this.props.body}
                </Typography>

              </div>
            </div>
        )
    }
}

Comment.propTypes = {
    username: PropTypes.string.isRequired,
    body: PropTypes.string.isRequired
};