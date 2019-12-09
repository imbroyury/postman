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
});

const FORM_INPUTS = {
  requestUrl: 'requestUrl',
  requestMethod: 'requestMethod',
  contentType: 'contentType',
  requestBody: 'requestBody',
};

const QUERY_PARAM_COUNT = 5;
const HEADERS_COUNT = 5;

function AddRequest() {
  const classes = useStyles();

  const [inputs, setInputs] = useState({
    [FORM_INPUTS.contentType]: CONTENT_TYPES[0],
    [FORM_INPUTS.requestMethod]: METHODS[0],
    [FORM_INPUTS.requestUrl]: '',
    [FORM_INPUTS.requestBody]: '',
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

  const getQueryParamsInputs = () =>
    new Array(QUERY_PARAM_COUNT)
          .fill(null)
          .map((_, i) => (<Grid container item key={i}>
            <TextField
              placeholder="Key"
              name={`query-param-key-${i}`}
              value={inputs[`query-param-key-${i}`] || ''}
              onChange={handleInputChange}
            />
            <TextField
              placeholder="Value"
              name={`query-param-value-${i}`}
              value={inputs[`query-param-value-${i}`] || ''}
              onChange={handleInputChange}
            />
          </Grid>))

  return (<Grid container>
    <Paper className={classes.paper}>
        <Typography variant="h4" gutterBottom>Add new request</Typography>
        <form noValidate autoComplete="off" onSubmit={handleSubmit}>
          <Grid container>
            <TextField 
              label="Request URL"
              name={FORM_INPUTS.requestUrl}
              value={inputs[FORM_INPUTS.requestUrl]}
              onChange={handleInputChange}
              type="url"
              required
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
          <Typography>Params</Typography>
          { getQueryParamsInputs() }
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
              name={FORM_INPUTS.requestBody}
              value={inputs[FORM_INPUTS.requestBody]}
              onChange={handleInputChange}
              multiline
              rows="4"
            />
          </Grid>
          <Grid container>
            <Typography>Headers</Typography>
            {
              new Array(HEADERS_COUNT)
                .fill(null)
                .map((_, i) => (<Grid container item key={i}>
                  <TextField
                    placeholder="Key"
                    name={`headers-key-${i}`}
                    value={inputs[`headers-key-${i}`] || ''}
                    onChange={handleInputChange}
                  />
                  <TextField
                    placeholder="Value"
                    name={`headers-value-${i}`}
                    value={inputs[`headers-value-${i}`] || ''}
                    onChange={handleInputChange}
                  />
                </Grid>))
            }
          </Grid>
          <Button type="submit" variant="contained" color="primary">Add request</Button>
        </form>
    </Paper>
  </Grid>);
}

export default AddRequest;
