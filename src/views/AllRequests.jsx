import React, { useState, useEffect } from 'react';
import {
  Button,
  Chip,
  Grid,
  Paper,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails
} from '@material-ui/core';
import ExpandMoreIcon from '@material-ui/icons/ExpandMore';
import { makeStyles } from '@material-ui/core/styles';

const useStyles = makeStyles({
  paper: {
    padding: '20px',
  },
  method: {
    marginRight: '20px',
  }
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
  }, []) // componentDidMount - empty dependency array

  const renderError = () => (<Paper className={classes.paper}>
    <Typography variant="h4">Error while fetching requests</Typography>
  </Paper>)

  const renderNoRequests = () => (<Paper className={classes.paper}>
    <Typography variant="h4">No requests fetched</Typography>
  </Paper>)

  return (<Grid container>
    {error && renderError()}
    {requests.length === 0 && renderNoRequests()}
    {
      requests.map(request =>
        (<ExpansionPanel key={request._id}>
          <ExpansionPanelSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel1a-content"
            id="panel1a-header"
          >
            <Grid container alignItems="center">
              <Chip label={request.requestMethod} color="primary" className={classes.method} />
              <Typography variant="subtitle2"> {request.requestUrl}</Typography>
            </Grid>
          </ExpansionPanelSummary>
          <ExpansionPanelDetails>
            <Grid container>
              {
                Object
                  .entries(request)
                  .map(([k, v]) => (<Grid item container key={k}>
                    <Typography>{k} - {JSON.stringify(v)}</Typography>
                  </Grid>))
              }
              <Button variant="outlined" color="primary">Run</Button>
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>)
      )
    }
  </Grid>);
}

export default AllRequests;
