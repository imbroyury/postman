import React, { useState } from 'react';
import {
  Button,
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
import useKeyValuePairsArray from '../hooks/useKeyValuePairsArray';

const METHODS = [
  'GET', 'POST', 'PUT',
  'HEAD','DELETE', 'PATCH', 'OPTIONS',
];

const CONTENT_TYPES = [
  'application/javascript',
  'application/octet-stream',
  'application/ogg',
  'application/pdf',
  'application/xhtml+xml',
  'application/json',
  'application/xml',
  'application/zip',
  'application/x-www-form-urlencoded',
  'text/css',
  'text/csv',
  'text/html',
  'text/plain',
  'text/xml',
  'multipart/form-data'
];

const useStyles = makeStyles({
  paper: {
    padding: '20px',
  },
  select: {
    minWidth: '150px',
  },
  container: {
    padding: '10px 10px 10px 0',
  },
  button: {
    marginTop: '10px',
  }
});

const FORM_INPUTS = {
  requestUrl: 'requestUrl',
  requestMethod: 'requestMethod',
  contentType: 'contentType',
  requestBody: 'requestBody',
};

function AddRequest() {
  const classes = useStyles();

  const [inputs, setInputs] = useState({
    [FORM_INPUTS.contentType]: CONTENT_TYPES[0],
    [FORM_INPUTS.requestMethod]: METHODS[0],
    [FORM_INPUTS.requestUrl]: '',
    [FORM_INPUTS.requestBody]: '',
  });

  const [queryParams, editQueryParam, addQueryParam] = useKeyValuePairsArray(1);
  const [headers, editHeader, addHeader] = useKeyValuePairsArray(1);

  const handleSubmit = (event) => {
    if (event) {
      event.preventDefault();
    }
    console.log(inputs);
    console.log(queryParams);
    console.log(headers);

    fetch('http://localhost:8280/add-request', {
      method: 'POST',
      body: JSON.stringify({
        ...inputs,
        queryParams,
        headers,
      }),
      headers: {
        'Content-Type': 'application/json'
      }
    });
  }

  const handleInputChange = (event) => {
    event.persist();
    setInputs(inputs => ({...inputs, [event.target.name]: event.target.value}));
  }

  const handleQueryParamChange = (index, field) => (event) => {
    event.persist();
    editQueryParam(index, field, event.target.value);
  }

  const handleHeaderChange = (index, field) => (event) => {
    event.persist();
    editHeader(index, field, event.target.value);
  } 

  const getQueryParamsInputs = () =>
    queryParams
          .map((queryParam, i) => (<Grid container item key={i}>
            <TextField
              placeholder="key"
              value={queryParam.key}
              onChange={handleQueryParamChange(i, 'key')}
            />
            <TextField
              placeholder="value"
              value={queryParam.value}
              onChange={handleQueryParamChange(i, 'value')}
            />
          </Grid>))

  const getHeaderInputs = () =>
    headers
          .map((header, i) => (<Grid container item key={i}>
            <TextField
              placeholder="key"
              value={header.key}
              onChange={handleHeaderChange(i, 'key')}
            />
            <TextField
              placeholder="value"
              value={header.value}
              onChange={handleHeaderChange(i, 'value')}
            />
          </Grid>))

  return (<Grid container>
    <Paper className={classes.paper}>
      <Typography variant="h4" gutterBottom>Add new request</Typography>
      <form noValidate autoComplete="off" onSubmit={handleSubmit}>
        <Grid container className={classes.container}>
          <Grid item>
            <TextField 
              label="Request URL"
              name={FORM_INPUTS.requestUrl}
              value={inputs[FORM_INPUTS.requestUrl]}
              onChange={handleInputChange}
              type="url"
              required
            />
          </Grid>
        </Grid>
        <Grid container className={classes.container}>
          <Grid item>
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
          <Grid item>
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
        </Grid>
        <Grid container>
          <Grid item>
              <TextField
                label="Request Body"
                name={FORM_INPUTS.requestBody}
                value={inputs[FORM_INPUTS.requestBody]}
                onChange={handleInputChange}
                multiline
                rows="4"
              />
            </Grid>
        </Grid>
        <Grid container className={classes.container}>
          <Typography variant="subtitle1">Query params</Typography>
          { getQueryParamsInputs() }
          <Button onClick={addQueryParam}  variant="contained" className={classes.button}>Add param</Button>
        </Grid>
        <Grid container className={classes.container}>
          <Typography variant="subtitle1">Headers</Typography>
          { getHeaderInputs() }
          <Button onClick={addHeader} variant="contained" className={classes.button}>Add header</Button>
        </Grid>
        <Button type="submit" variant="contained" color="primary">Add request</Button>
      </form>
    </Paper>
  </Grid>);
}

export default AddRequest;
