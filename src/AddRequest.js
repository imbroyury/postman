import React, { useState } from 'react';
import {
  TextField,
  Typography,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Grid,
} from '@material-ui/core';

import { makeStyles } from '@material-ui/core/styles';

const METHODS = [
  'GET', 'POST', 'PUT',
  'HEAD','DELETE', 'PATCH', 'OPTIONS',
];

const CONTENT_TYPES = [
  'text/html',
  'multipart/form-data'
];

const useStyles = makeStyles({
  paper: {
    padding: '20px',
  },
  select: {
    minWidth: '150px',
  },
});

const FORM_INPUTS = {
  requestUrl: 'requestUrl',
  requestMethod: 'requestMethod',
  contentType: 'contentType'
}

function AddRequest() {
  const [inputs, setInputs] = useState({
    [FORM_INPUTS.contentType]: CONTENT_TYPES[0],
    [FORM_INPUTS.requestMethod]: METHODS[0],
    [FORM_INPUTS.requestUrl]: '',
  });

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    console.log(inputs);
  }

  const handleInputChange = (event) => {
    event.persist();
    setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}));
  }

  const classes = useStyles();

  return (<Grid container>
  <Paper className={classes.paper}>
      <Typography variant="h4">Add new request</Typography>
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container>
          <TextField 
            label="Request URL"
            variant="outlined"
            name={FORM_INPUTS.requestUrl}
            value={inputs[FORM_INPUTS.requestUrl]}
            onChange={handleInputChange}
          />
        </Grid>
        <Grid container>
          <FormControl>
            <InputLabel>Request Method</InputLabel>
            <Select
              name={FORM_INPUTS.requestMethod}
              value={inputs[FORM_INPUTS.requestMethod]}
              onChange={handleInputChange}
              className={classes.select}
            >
              {
                METHODS.map(method => <MenuItem key={method} value={method}>{method}</MenuItem>)
              }
            </Select>
          </FormControl>
        </Grid>
        <Grid container>
          <FormControl>
            <InputLabel>Content Type</InputLabel>
            <Select
              name={FORM_INPUTS.contentType}
              value={inputs[FORM_INPUTS.contentType]}
              onChange={handleInputChange}
              className={classes.select}
            >
              {
                CONTENT_TYPES.map(contentType =>
                  <MenuItem key={contentType} value={contentType}>{contentType}</MenuItem>
                )
              }
            </Select>
          </FormControl>
        </Grid>
        <Grid container>
          <TextField
            label="Request Body"
            multiline
            rows="4"
          />
        </Grid>
      </form>
    </Paper>
  </Grid>);
}

export default AddRequest;
