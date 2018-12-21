import React, { Component } from 'react';
import SinglePost from "./SinglePost";

export default class Posts extends Component {
    constructor(props){
        super(props);
        this.state = {

        }
    }
    componentDidMount(){
        this.props.changeTitle(this.props.match.params.topic || "Home");
    }
  render() {
      const list = [1,2,3,4,5,6,7,8,9,0];
    return (
      <div>
        {
            list.map((item, idx) => {
                return (
                    <div key={idx} >
                    <br />
                    <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
                        <SinglePost key={idx} />
                    </div>
                    </div>
                );
            })
        }
      </div>
    )
  }
}
