import React from 'react';
import { 
  Button,
  Paper, 
  Table, 
  TableBody, 
  TableHead, 
  TableRow, 
  TableCell,
  MenuItem,
  Select,
  OutlinedInput,
  FormControl,
  Tooltip,
  IconButton
 } from '@material-ui/core'
 import { withStyles } from '@material-ui/core/styles';
 import { Edit, CloudDownload, ArrowForward } from '@material-ui/icons';

 const styles = () => ({
  select: {
		width: '85%',
    margin: '0 auto'
  },
  selectItem: {
    fontSize: 14
  }
 });

const ViatraTable = ({ classes }) => {

  const styles = {
    table: {
      width: '70%',
      margin: '100px auto'
    },
    tableHead: {
      fontSize: 18,
      fontWeight: 'lighter'
    },
    tableBody: {
      fontSize: 14,
      height: 100,
      fontWeight: 'lighter'
    }
  }

  const renderDataRow = (data) => {
    return data.map(el => (
      <TableRow>
        <TableCell style={styles.tableBody} align="center">
          Model 1
        </TableCell>

        <TableCell style={styles.tableBody} align="center">
          <div style={{ display: 'flex' }}>
            <FormControl className={classes.select} variant="outlined">
              <Select
                className={classes.selectItem}
                value={8}
                input={<OutlinedInput name="config" />}
                autoWidth
              >
                <MenuItem className={classes.selectItem} value={8}>generation.vsconfig</MenuItem>
                <MenuItem className={classes.selectItem} value={20}>config.vsconfig</MenuItem>
                <MenuItem className={classes.selectItem} value={30}>bloom_model.vsconfig</MenuItem>
              </Select>
            </FormControl>
            <Tooltip title={<p style={{ fontSize: 12, marginTop: 6 }}>Edit Config File</p>}>
              <IconButton style={{ margin: 'auto 4px', transform: 'scale(0.9)' }}>
                <Edit />
              </IconButton>
            </Tooltip>
          </div>
        </TableCell>

        <TableCell style={styles.tableBody} align="center">
          output.xmi &nbsp; <ArrowForward style={{ paddingTop: 12 }} /> &nbsp; generation.vsconfig <br/>
          <Tooltip title={<p style={{ fontSize: 12, marginTop: 6 }}>Download Output</p>}>
            <IconButton style={{ transform: 'scale(0.93)', marginTop: 8 }} variant="flat">
              <CloudDownload />
            </IconButton>
          </Tooltip>
        </TableCell>
      </TableRow>
    ));
  }
    
  return (
    <Paper elevation={8} style={{ margin: '25px auto', width: '80%', borderRadius: 8 }}>
      <Table >
      <TableHead>
        <TableRow>
          <TableCell style={styles.tableHead} align="center">Meta-Model</TableCell>
          <TableCell style={styles.tableHead} align="center">Config</TableCell>
          <TableCell style={styles.tableHead} align="center">Output</TableCell>
        </TableRow>
      </TableHead>
      <TableBody>
          {renderDataRow([1, 2, 3, 4, 5])}
      </TableBody>
    </Table>
    </Paper>
  ) 
}
 
export default withStyles(styles)(ViatraTable);