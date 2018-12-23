import React, { Component } from 'react'
import TextField from '@material-ui/core/TextField';
import PropTypes from 'prop-types';

export default class NewComment extends Component {

    constructor (props){
        super(props);
        this.state = {
            new_comment_body : ""
        }
    }


    render() {
        return (
            <div style={{ width : "80%", marginLeft : "30px", marginBottom : "15px"}}>

              <div style={{marginLeft : "10px", paddingLeft : "45px"}}>
                  <TextField
                      id="standard-search"
                      label="Type your comment"
                      type="search"
                      margin="normal"
                      value={this.state.new_comment_body}
                      onChange={(e) => {
                          this.setState( { new_comment_body: e.target.value});
                      }}
                      onKeyDown={(e) => {
                          if(e.keyCode === 13){
                              this.setState({new_comment_body : ""});
                              this.props.submit(this.state.new_comment_body);
                          }
                      }}
                  />
              </div>
            </div>
        )
    }
}

NewComment.propTypes = {
    submit: PropTypes.func.isRequired
};

