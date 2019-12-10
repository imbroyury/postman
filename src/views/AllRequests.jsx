import React, { useState, useEffect } from 'react';
import {
  Paper,
  Grid,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
});

function AllRequests() {
  const classes = useStyles();

  const [requests, setRequests] = useState([]);

  useEffect(() => {
    // TODO: Can't perform a React state update on an unmounted component.
    fetch('http://localhost:8280/get-all-requests')
      .then(response => response.json())
      .then(requests => setRequests(requests));
  })

  return (<Grid container>
    <Paper className={classes.paper}>
      {
        requests.map(request =>
          <Grid container key={request._id}>
            {
              Object
                .entries(request)
                .map(([k, v]) => <Grid item key={k}>{k} - {JSON.stringify(v)}</Grid>)
            }
          </Grid>)
      }
    </Paper>
  </Grid>);
}

export default AllRequests;
