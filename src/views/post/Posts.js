import React, { Component } from 'react';
import SinglePost from "./SinglePost";
import Api from '../../api';

export default class Posts extends Component {
    constructor(props){
        super(props);
        this.state = {
            open: false,
            posts: [],
            topics: [],
        }
    }
    componentDidMount(){
        this.props.changeTitle(this.props.match.params.topic || "Home");
        this.getPosts();
    }
    getPosts = () => {
        Api.find('posts')
                .then( response => {
                    let posts = []
                    response.data.map( (post, idx) => {
                        return Api.findRelated('posts',"topics", post.id)
                            .then( response => {
                                post.topic = response.data
                                posts.push(post);
                                this.setState({posts});
                            })
                    })
                }).catch ( error => console.log(error))
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
                        <SinglePost changeTitle = {this.props.changeTitle} key={item.id} title={item.title} description={item.description} file={item.file} topics={item.topic}/>
                    </div>
                    </div>
                );
            })
        }
      </div>
    )
  }
}
