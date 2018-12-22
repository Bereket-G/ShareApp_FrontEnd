import React, { Component } from 'react';
import SinglePost from "./SinglePost";

export default class Posts extends Component {
    constructor(props){
        super(props);
        this.state = {
            open: false,
            posts: [{title: "Post 1"},{title: "Post 2"},{title: "Post 3"},{title: "Post 4"},{title: "Post 5"},{title: "Post 6"},{title: "Post 7"},{title: "Post 8"}]
        }
    }
    componentDidMount(){
        this.props.changeTitle(this.props.match.params.topic || "Home");
    }
  render() {
      const list = this.state.posts
    return (
      <div>
        {
            list.map((item, idx) => {
                return (
                    <div key={idx} >
                    <br />
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <SinglePost changeTitle = {this.props.changeTitle} key={idx} title={item.title}/>
                    </div>
                    </div>
                );
            })
        }
      </div>
    )
  }
}
