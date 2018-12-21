import React from 'react';
import Loadable from 'react-loadable'
// import Container from './containers';

function Loading() {
    return <div>Loading...</div>;
}

const Posts = Loadable({
  loader: () => import('./views/post/Posts'),
  loading: Loading,
});

const PostView = Loadable({
    loader: () => import('./views/post/PostView'),
    loading: Loading,
  });
  

// https://github.com/ReactTraining/react-router/tree/master/packages/react-router-config
const routes = [
  { path: '/', exact: true, name: 'Home', component: Posts },
  { path: '/:topic', exact: true, name: 'Home', component: Posts },
  { path: '/:topic/:id', exact: true, name: 'Home', component: PostView },
  

]
export default routes;
