import React from 'react';
import ReactDOM from 'react-dom';
import AddRequest from './views/AddRequest.jsx';
import AllRequests from './views/AllRequests.jsx';
import {
  BrowserRouter as Router,
  Redirect,
  Switch,
  Route,
  Link,
} from "react-router-dom";
import {
    Drawer,
    List,
    ListItem,
    ListItemText,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const drawerWidth = 180;

const useStyles = makeStyles(theme => ({
  drawer: {
    width: drawerWidth,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  view: {
    marginLeft: drawerWidth,
  },
}));

const routes = [
  {
    View: AllRequests,
    path: '/all-requests',
    linkLabel: 'All requests',
  },
  {
    View: AddRequest,
    path: '/add-request',
    linkLabel: 'Add request',
  }
]

const Root = () => {
  const classes = useStyles();

  return (<Router>
    <Drawer
      variant="permanent"
      anchor="left"
      className={classes.drawer}
      classes={{paper: classes.drawerPaper}}
    >
      <List>
        {
          routes.map(route => (
              <ListItem button component={Link} to={route.path} key={route.path}>
                  <ListItemText>{route.linkLabel}</ListItemText>
              </ListItem>
          ))
        }
      </List>
    </Drawer>
    <main className={classes.view}>
      <Switch>
        {
          routes.map(route => (
            <Route path={route.path} key={route.path}>
                <route.View />
            </Route>
          ))
        }
      </Switch>
    </main>
    <Redirect to="/all-requests" />
  </Router>)
}

ReactDOM.render(<Root />, document.getElementById('root'));
