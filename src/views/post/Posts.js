import React, { Component } from "react";
import SinglePost from "./SinglePost";
import Topic from "../topic/Topic";

export default class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      posts: [
        { title: "Post 1" },
        { title: "Post 2" },
        { title: "Post 3" },
        { title: "Post 4" },
        { title: "Post 5" },
        { title: "Post 6" },
        { title: "Post 7" },
        { title: "Post 8" }
      ],
      isHidden: false,
      topicTitle: this.props.match.params.topic || "Home"
    };
  }

  onClick = key => {
    if (!this.state.isHidden) {
      this.setState({
        topicTitle: key
      });
    }
    console.log(key);
  };

  componentDidMount() {
    this.props.changeTitle(this.props.match.params.topic || "Home");
  }
  render() {
    const list = this.state.posts;
    return (
      <div>
        <Topic topicTitle={this.state.topicTitle} topicDesc={this.state.topicDescription} />
        <div style={{ width: "80%" }}>
          {list.map((item, idx) => {
            return (
              <div key={idx}>
                <br />
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <SinglePost
                    changeTitle={this.props.changeTitle}
                    key={idx}
                    title={item.title}
                    onClick={this.onClick}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }
}
