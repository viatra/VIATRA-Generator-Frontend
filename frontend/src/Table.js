import React, {Component} from 'react'
import {BootstrapTable, TableHeaderColumn} 
       from 'react-bootstrap-table'
import './css/react-bootstrap-table-all.min.css'
import DropdownButton from 'react-bootstrap/DropdownButton'
import Dropdown from 'react-bootstrap/Dropdown'
 
 

function getData() {
    var data = []
    for (var i = 0; i < 10; ++i) {
      data[i] = { metamodel:'meta_model_'+i,cfile: 'config_file_'+ i,omodel: i}
    }
   
    return data
  }

  function actionsBtn(cell,row){
    return (<div><button><a onClick={()=>{alert("Functionality not implemented")}}>Edit this config</a></button></div>)
  }

  function outputModelLink(cell,row){
    return (<div><a href="https://www.google.com"><u>Click here</u></a> to fetch model number {row['omodel']}</div>)
  }
 
  function configFileBtn(cell,row){
    return(<DropdownButton
      title={'View Files'}
      variant={'secondary'}
      id={`dropdown-variants-secondary`}
      key={'secondary'}
    >
      <Dropdown.Item>CFile1</Dropdown.Item>
      <Dropdown.Item>CFile2</Dropdown.Item>
      <Dropdown.Item>CFile3</Dropdown.Item>
    </DropdownButton>);
  }
 
function isExpandableRow(row) {
  return true;
}
 
function expandRow(row) {
  return (
    <p>{row['metamodel']} was configured on {Date()}, please click <b><u><a href="https://www.google.com">here</a></u></b> to re-generate.</p>
  );
}
 
 
class Table extends Component {
  render() {
    const options = {
      expandRowBgColor: 'yellow',
      expanding: [0] // initially expanded
    }
    return (
      <div>
        <BootstrapTable data={getData()} striped
                        // expandableRow={isExpandableRow}
                        expandComponent={expandRow}
                        expandColumnOptions={ 
                            {expandColumnVisible: true}}
                        options={options}
        >
          <TableHeaderColumn isKey dataField='metamodel'

          >
            MetaModel
          </TableHeaderColumn>

          <TableHeaderColumn dataField='omodel'
                    dataFormat={outputModelLink}
          >
            Output Model
          </TableHeaderColumn>
          <TableHeaderColumn dataField='cfile'
          dataFormat={configFileBtn}
          >
            Config File
          </TableHeaderColumn>
          <TableHeaderColumn dataField='actions'
          dataFormat={actionsBtn}
          >
            Action 
          </TableHeaderColumn>
        </BootstrapTable>
      </div>
    )
  }
}
 
export default Table