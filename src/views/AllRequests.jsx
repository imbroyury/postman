import React, { useState, useEffect } from 'react';
import {
  Paper,
  Grid,
  Typography,
} from '@material-ui/core';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
});

function AllRequests() {
  const classes = useStyles();

  const [requests, setRequests] = useState([]);
  const [error, setError] = useState();

  useEffect(() => {
    // TODO: Can't perform a React state update on an unmounted component.
    fetch('http://localhost:8280/get-all-requests')
      .then(response => response.json())
      .then(requests => setRequests(requests))
      .catch(e => setError(e));
  }, [])

  return (<Grid container>
    {error && <Typography variant="h4">Error while fetching requests</Typography>}
    {requests.length === 0 && <Typography variant="h4">No requests currently created</Typography>}
      {
        requests.map(request =>
        <Paper className={classes.paper} key={request._id}>
          <Grid container>
            {
              Object
                .entries(request)
                .map(([k, v]) => <Grid item key={k}>{k} - {JSON.stringify(v)}</Grid>)
            }
          </Grid>
        </Paper>)
      }
  </Grid>);
}

export default AllRequests;
