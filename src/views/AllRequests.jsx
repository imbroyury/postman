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
}

const AllRequests = () => {
  const classes = useStyles();

  const [requests, setRequests] = useState([]);
  const [error, setError] = useState();
  const [requestResults, setRequestResults] = useState({});

  useEffect(() => {
    fetch('http://localhost:8280/get-all-requests')
      .then(response => response.json())
      .then(requests => {
        setRequestResults(requests.reduce((res, req) => {
          res[req._id] = {
            status: STATUSES.uninitialized
          };
          return res;
        }, {}));
        setRequests(requests);
      })
      .catch(e => setError(e));
  }, []) // componentDidMount - empty dependency array

  const runRequest = (requestId) => {
    setRequestResults(currentResults => ({
      ...currentResults,
      [requestId]: {
        status: STATUSES.running,
      }
    }));

    fetch(`http://localhost:8280/run-request?requestId=${requestId}`)
      .then(response => response.json())
      .then(result => {
        setRequestResults(currentResults => ({
          ...currentResults,
          [requestId]: {
            status: STATUSES.done,
            result,
          }
        }));
      });
  };

  const renderRequestState = (requestId) => {
    const { status, result } = requestResults[requestId];
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
              <Button
                variant="outlined"
                color="primary"
                onClick={() => runRequest(request._id)}
                disabled={requestResults[request._id].status === STATUSES.running}
              >
                Run
              </Button>
              { renderRequestState(request._id) }
            </Grid>
          </ExpansionPanelDetails>
        </ExpansionPanel>)
      )
    }
  </Grid>);
}

export default AllRequests;
