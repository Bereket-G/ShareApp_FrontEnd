import React, { Component } from "react";
import SinglePost from "./SinglePost";
import Topic from "../topic/Topic";
import Api from "../../api";

export default class Posts extends Component {
  constructor(props) {
    super(props);
    this.state = {
      open: false,
      posts: [],
      topics: [],
      topicTitle: this.props.match.params.topic || "Home"
    };
  }
  componentDidMount() {
    this.props.changeTitle(this.props.match.params.topic || "Home");
    this.getPosts();
  }
  onClick = key => {
    this.setState({
      topicTitle: key
    });
  };
  getPosts = () => {
    let m_topic = this.props.match.params.topic;
    Api.find("posts", null, `filter={"include":"user"}`)
      .then(response => {
        let posts = [];
        response.data.map((post, idx) => {
          return Api.findRelated("posts", "topics", post.id).then(response => {
            post.topic = response.data;
            if(!m_topic){
              posts.push(post);
            }
            else{
              post.topic.map( item => {
                if(item.name === m_topic){
                  return posts.push(post);
                }
                return null;
              })
            }
            this.setState({ posts });
          });
        });
      })
      .catch(error => console.log(error));
  };

  render() {
    const list = this.state.posts;
    console.log(this.state.topicTitle === "Home", this.state.topicTitle);
    return (
      <div>
        <br />
        <br />
        <br />
        <Topic
          topicTitle={this.props.match.params.topic || 'Home'}
          topicDesc={
            this.state.topicTitle === "Home"
              ? "Welcome to myEdu community!"
              : this.state.topicDescription
          }
        />
        <div style={{ width: "80%" }}>
          {list.map((item, idx) => {
            return (
              <div key={idx}>
                <br />
                <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                  <SinglePost
                    changeTitle={this.props.changeTitle}
                    enqueueSnackbar={this.props.enqueueSnackbar}
                    onClick={this.onClick}
                    key={item.id}
                    id={item.id}
                    user={item.user}
                    title={item.title}
                    description={item.description}
                    file={item.file}
                    topics={item.topic}
                    createdAt={item.createdAt}
                  />
                </div>
              </div>
            );
          })}
        </div>
        <br />
        <br />
        <br />
        <br />
      </div>
    );
  }
}
