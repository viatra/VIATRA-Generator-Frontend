import React from 'react';
import { 
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

const ViatraTable = ({ 
  history,
  classes, 
  data, 
  selectedValues, 
  handleSelectChange, 
  handleDownload 
}) => {

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
    return data.map((run, index) => {
      const currentConfig = run.runs[selectedValues[index]].config;
      const currentOutput = run.runs[selectedValues[index]].output;

      return (
        <TableRow key={index}>
          <TableCell style={styles.tableBody} align="center">
            {run.metamodel}
          </TableCell>
  
          <TableCell style={styles.tableBody} align="center">
            <div style={{ display: 'flex' }}>
              <FormControl className={classes.select} variant="outlined">
                <Select
                  onChange={e => handleSelectChange(index, e)}
                  className={classes.selectItem}
                  value={selectedValues[index]}
                  input={<OutlinedInput labelWidth={0} name="config" />}
                  autoWidth
                >
                  {run.runs.map((el, index) => {
                    return <MenuItem key={index} className={classes.selectItem} value={index}>
                      {el.config}
                    </MenuItem>
                  })}
                </Select>
              </FormControl>
              <Tooltip title={<p style={{ fontSize: 12, marginTop: 6 }}>Edit Config File</p>}>
                <IconButton
                  onClick={() => 
                    history.push(`/edit/${currentConfig}`, { logicalName: run.logicalName })
                  }
                  style={{ margin: 'auto 4px', transform: 'scale(0.9)' }}
                >
                  <Edit />
                </IconButton>
              </Tooltip>
            </div>
          </TableCell>
  
          <TableCell style={styles.tableBody} align="center">
            {currentOutput}
             &nbsp; <ArrowForward style={{ paddingTop: 12 }} />
             &nbsp; {currentConfig} <br/>
            <Tooltip title={<p style={{ fontSize: 12, marginTop: 6 }}>Download Output</p>}>
              <IconButton 
                onClick={() => handleDownload(currentOutput)} 
                style={{ transform: 'scale(0.93)', marginTop: 8 }} 
                variant="flat"
              >
                <CloudDownload />
              </IconButton>
            </Tooltip>
          </TableCell>
        </TableRow>
      )
    });
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
          {renderDataRow(data)}
      </TableBody>
    </Table>
    </Paper>
  ) 
}
 
export default withStyles(styles)(ViatraTable);