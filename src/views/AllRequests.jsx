import React, { useState, useEffect } from 'react';
import {
  Button,
  Chip,
  CircularProgress,
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
  },
  requestResult: {
    boxShadow: 'inset 0 0 5px #000000',
    maxHeight: '300px',
    padding: '30px',
    overflow: 'auto',
  }
});

const STATUSES = {
  uninitialized: 'uninitialized',
  running: 'running',
  done: 'done',
  error: 'error',
};

const AllRequests = () => {
  const classes = useStyles();

  const [requests, setRequests] = useState([]);
  const [error, setError] = useState();
  const [requestStates, setRequestStates] = useState({});

  const initRequestStates = requests =>
    setRequestStates(
      requests
        .reduce((states, request) => ({ ...states, [request._id]: { status: STATUSES.uninitialized }}), {})
    );

  useEffect(() => {
    fetch('http://localhost:8280/get-all-requests')
      .then(response => response.json())
      .then(requests => {
        initRequestStates(requests);
        setRequests(requests);
      })
      .catch(e => setError(e));
  }, []) // componentDidMount - empty dependency array

  const setRequestState = (requestId, status, result) =>
    setRequestStates(currentResults => ({
      ...currentResults,
      [requestId]: {
        status,
        result,
      }
    }));

  const runRequest = (requestId) => {
    setRequestStates(currentResults => ({
      ...currentResults,
      [requestId]: {
        status: STATUSES.running,
      }
    }));

    fetch(`http://localhost:8280/run-request?requestId=${requestId}`)
      .then(response => response.json())
      .then(result => setRequestState(requestId, STATUSES.done, result))
      .catch(e => setRequestState(requestId, STATUSES.error, e));
  };

  const renderRequestState = (requestId) => {
    const { status, result } = requestStates[requestId];

    if (status === STATUSES.uninitialized) return null;

    if (status === STATUSES.running) return (<Grid container>
      <CircularProgress />
    </Grid>);

    return (<Grid container>
      <code className={classes.requestResult}>{JSON.stringify(result)}</code>
    </Grid>)
  }

  const renderError = () => (<Paper className={classes.paper}>
    <Typography variant="h4">Error while fetching requests</Typography>
  </Paper>)

  const renderNoRequests = () => (<Paper className={classes.paper}>
    <Typography variant="h4">No requests fetched</Typography>
  </Paper>)

  const renderRequest = (request) => (<ExpansionPanel key={request._id}>
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
      <Grid container alignItems="center">
        <Chip label={request.method} color="primary" className={classes.method} />
        <Typography variant="subtitle2"> {request.url}</Typography>
      </Grid>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <Grid container>
        <Grid item container><Typography variant="body2">Content-Type: {request.contentType}</Typography></Grid>
        <Grid item container><Typography variant="body2">Body: {request.body}</Typography></Grid>
        <Grid item container><Typography variant="body2">Query parameters: {JSON.stringify(request.queryParams)}</Typography></Grid>
        <Grid item container><Typography variant="body2">Headers: {JSON.stringify(request.headers)}</Typography></Grid>
        <Button
          variant="outlined"
          color="primary"
          onClick={() => runRequest(request._id)}
          disabled={requestStates[request._id].status === STATUSES.running}
        >
          Run
        </Button>
        { renderRequestState(request._id) }
      </Grid>
    </ExpansionPanelDetails>
  </ExpansionPanel>)

  return (<Grid container>
    {error && renderError()}
    {requests.length === 0 && renderNoRequests()}
    {requests.map(renderRequest)}
  </Grid>);
}

export default AllRequests;
