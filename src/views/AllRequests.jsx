import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Button,
  Chip,
  CircularProgress,
  Grid,
  Paper,
  Typography,
  ExpansionPanel,
  ExpansionPanelSummary,
  ExpansionPanelDetails,
  Table,
  TableRow,
  TableCell,
  TableBody,
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
  requestPanel: {
    width: 'calc(100vw - 230px)',
  },
  requestBody: {
    border: '1px solid rgba(95, 69, 120, 0.1)',
    borderRadius: '3px',
    maxHeight: '300px',
    padding: '20px',
    overflow: 'auto',
  },
  runButton: {
    margin: '20px 0',
  },
  table: {
    width: '400px',
  },
  tableCell: {
    width: '50%',
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
    axios.get('/get-all-requests')
      .then(({ data: requests }) => {
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

    axios.get(`/run-request?requestId=${requestId}`)
      .then(({ data: result }) => setRequestState(requestId, STATUSES.done, result))
      .catch(e => setRequestState(requestId, STATUSES.error, e));
  };

  const renderResponseHeaders = (headers) => {
    return (<Table size="small">
      <TableBody>
        {
          Object.entries(headers).map(([key, value]) => (<TableRow key={key}>
              <TableCell align="left">{key}</TableCell>
              <TableCell align="left">{value}</TableCell>
            </TableRow>))
        }
      </TableBody>
    </Table>)
  }

  const renderRequestState = (requestId) => {
    const { status, result } = requestStates[requestId];

    if (status === STATUSES.uninitialized) return null;

    if (status === STATUSES.running) return (<Grid container>
      <CircularProgress />
    </Grid>);

    if (status === STATUSES.error) return (<Grid container>
      <Typography>An error occured while running your request</Typography>
    </Grid>);

    return (
      <Grid container>
        <Grid container>
          <Typography variant="subtitle2" gutterBottom>Response: </Typography>
        </Grid>
        <Grid container>
          <Grid container>
            <Typography variant="body2" gutterBottom>Status: {result.status}</Typography>
          </Grid>
          <Grid container>
            <Typography variant="body2" gutterBottom>Content-Type: {result.contentType}</Typography>
          </Grid>
          <Grid container>
            <Typography variant="body2" gutterBottom>Headers:</Typography>
            { renderResponseHeaders(result.headers) }
          </Grid>
          <Grid container>
            <Grid container>
              <Typography variant="body2" gutterBottom>Body: </Typography>
            </Grid>
            <code className={classes.requestBody}>
              {JSON.stringify(result.body)}
            </code>
          </Grid>
        </Grid>
      </Grid>
    )
  }

  const renderError = () => (<Paper className={classes.paper}>
    <Typography variant="h4">Error while fetching requests</Typography>
  </Paper>);

  const renderNoRequests = () => (<Paper className={classes.paper}>
    <Typography variant="h4">No requests fetched</Typography>
  </Paper>);

  const renderKeyValueTable = (list) => (<Table size="small" className={classes.table}>
    <TableBody>
      {list.map(({ key, value }) => (
        <TableRow key={key}>
          <TableCell align="left"><code>{key}</code></TableCell>
          <TableCell align="left"><code>{value}</code></TableCell>
        </TableRow>
      ))}
    </TableBody>
  </Table>)

  const renderRequest = (request) => (<ExpansionPanel key={request._id} className={classes.requestPanel}>
    <ExpansionPanelSummary expandIcon={<ExpandMoreIcon />}>
      <Grid container alignItems="center">
        <Chip label={request.method} color="primary" className={classes.method} />
        <Typography variant="subtitle2">{request.url}</Typography>
      </Grid>
    </ExpansionPanelSummary>
    <ExpansionPanelDetails>
      <Grid container>
        <Grid item container>
          <Typography variant="subtitle2" gutterBottom>Request: </Typography>
        </Grid>
        <Grid item container>
          <Grid item container>
            <Typography variant="body2" gutterBottom>Content-Type: {request.contentType}</Typography>
          </Grid>
          <Grid item container>
            <Typography variant="body2" gutterBottom>Body: <code>{request.body}</code></Typography>
          </Grid>
          <Grid item container>
            <Typography variant="body2" gutterBottom>Query parameters:</Typography>
            <Grid container>{renderKeyValueTable(request.queryParams)}</Grid>
          </Grid>
          <Grid item container>
            <Typography variant="body2" gutterBottom>Headers:</Typography>
            <Grid container>{renderKeyValueTable(request.headers)}</Grid>
          </Grid>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => runRequest(request._id)}
            disabled={requestStates[request._id].status === STATUSES.running}
            className={classes.runButton}
          >
            Run
          </Button>
          { renderRequestState(request._id) }
        </Grid>
      </Grid>
    </ExpansionPanelDetails>
  </ExpansionPanel>)

  return (<Grid container>
    {error && renderError()}
    {(requests.length === 0 && !error) && renderNoRequests()}
    {requests.map(renderRequest)}
  </Grid>);
}

export default AllRequests;
