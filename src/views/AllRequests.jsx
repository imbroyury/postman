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
  TableHead,
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
  requestResult: {
    border: '1px solid rgba(95, 69, 120, 0.1)',
    borderRadius: '3px',
    maxHeight: '300px',
    padding: '30px',
    overflow: 'auto',
    marginTop: '20px',
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

  const renderRequestState = (requestId) => {
    const { status, result } = requestStates[requestId];

    if (status === STATUSES.uninitialized) return null;

    if (status === STATUSES.running) return (<Grid container>
      <CircularProgress />
    </Grid>);

    if (status === STATUSES.error) return (<Grid container>
      <Typography>An error occured while running your request</Typography>
    </Grid>);

    return (<Grid container>
      <code className={classes.requestResult}>
        <div>Status: {result.status}</div><br></br>
        <div>Headers: {JSON.stringify(result.headers)}</div><br></br>
        <div>{JSON.stringify(result.body)}</div>
      </code>
    </Grid>)
  }

  const renderError = () => (<Paper className={classes.paper}>
    <Typography variant="h4">Error while fetching requests</Typography>
  </Paper>);

  const renderNoRequests = () => (<Paper className={classes.paper}>
    <Typography variant="h4">No requests fetched</Typography>
  </Paper>);

  const renderKeyValueTable = (list) => (<Table size="small" className={classes.table}>
    <TableHead>
      <TableRow>
        <TableCell className={classes.tableCell}>Key</TableCell>
        <TableCell className={classes.tableCell}>Value</TableCell>
      </TableRow>
    </TableHead>
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
          <Typography variant="body1">Content-Type: {request.contentType}</Typography>
        </Grid>
        <Grid item container>
          <Typography variant="body1">Body:</Typography>
          <Grid container><code>{request.body}</code></Grid>
        </Grid>
        <Grid item container>
          <Typography variant="body1">Query parameters:</Typography>
          <Grid container>{renderKeyValueTable(request.queryParams)}</Grid>
        </Grid>
        <Grid item container>
          <Typography variant="body1">Headers:</Typography>
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
    </ExpansionPanelDetails>
  </ExpansionPanel>)

  return (<Grid container>
    {error && renderError()}
    {(requests.length === 0 && !error) && renderNoRequests()}
    {requests.map(renderRequest)}
  </Grid>);
}

export default AllRequests;
