import React from 'react';
import { connect } from 'react-redux';
import { Button, TextField, MenuItem, FormControlLabel, Switch }  from '@material-ui/core';
import axios from 'axios';
import { ACTIONS, QUERY_ENDPOINT, COMMON_GREMLIN_ERROR } from '../../constants';
import { onFetchQuery } from '../../logics/actionHelper';

class Header extends React.Component {
  clearGraph() {
    this.props.dispatch({ type: ACTIONS.CLEAR_GRAPH });
    this.props.dispatch({ type: ACTIONS.CLEAR_QUERY_HISTORY });
  }

  buildQuery() {
    let queryStr = this.props.query;
    if (this.props.queryType === 'builder') {
      queryStr = 'g.V().hasLabel("' + this.props.queryBuilderService + '")';
      if (this.props.queryBuilderTracing) {
        queryStr += '.emit()'
        let directionStr = 'both()';
        if (this.props.queryBuilderTracingDirection === 'in') {
          directionStr = 'inE().outV()'
        } else if (this.props.queryBuilderTracingDirection === 'out') {
          directionStr = 'out()'
        }
        queryStr = queryStr + '.until(loops().is(eq(' + this.props.queryBuilderTracingSteps + '))).repeat(' + directionStr + ')'
      }
    }
    return queryStr;
  }

  sendQuery() {
    this.clearGraph();

    this.props.dispatch({ type: ACTIONS.SET_ERROR, payload: null });

    let queryStr = this.buildQuery();
    console.info('Gremlin query = [' + queryStr + ']');

    axios.post(
      QUERY_ENDPOINT,
      { host: this.props.host, port: this.props.port, query: queryStr, nodeLimit: this.props.nodeLimit },
      { headers: { 'Content-Type': 'application/json' } }
    ).then((response) => {
      onFetchQuery(response, this.props.query, this.props.nodeLabels, this.props.dispatch);
    }).catch((error) => {
      this.props.dispatch({ type: ACTIONS.SET_ERROR, payload: COMMON_GREMLIN_ERROR });
    });
  }

  onHostChanged(host) {
    this.props.dispatch({ type: ACTIONS.SET_HOST, payload: host });
  }

  onPortChanged(port) {
    this.props.dispatch({ type: ACTIONS.SET_PORT, payload: port });
  }

  onQueryTypeChanged(queryType) {
    this.props.dispatch({ type: ACTIONS.SET_QUERY_TYPE, payload: queryType});
  }

  onQueryChanged(query) {
    this.props.dispatch({ type: ACTIONS.SET_QUERY, payload: query });
  }

  onServiceChanged(service) {
    this.props.dispatch({ type: ACTIONS.SET_QUERY_BUILDER_SERVICE, payload: service });
  }

  onTracingChanged(tracing) {
    this.props.dispatch({ type: ACTIONS.SET_QUERY_BUILDER_TRACING, payload: tracing });
  }

  onTracingStepsChanged(steps) {
    this.props.dispatch({ type: ACTIONS.SET_QUERY_BUILDER_TRACING_STEPS, payload: steps });
  }

  onTracingDirectionChanged(direction) {
    this.props.dispatch({ type: ACTIONS.SET_QUERY_BUILDER_TRACING_DIRECTION, payload: direction });
  }

  isQueryBuilderEnabled() {
    return this.props.queryType === 'builder';
  }

  isQueryRawEnabled() {
    return this.props.queryType === 'raw';
  }

  isQueryBuilderTracingEnabled() {
    return this.isQueryBuilderEnabled() && this.props.queryBuilderTracing === true;
  }

  render(){
    return (
      <div className={'header'}>
        <form noValidate autoComplete="off">
          <TextField value={this.props.host} onChange={(event => this.onHostChanged(event.target.value))} id="standard-basic" label="Host" style={{width: '10%', padding: '5px'}} />
          <TextField value={this.props.port} onChange={(event => this.onPortChanged(event.target.value))} id="standard-basic" label="Port" style={{width: '10%', padding: '5px'}} />
          <TextField value={this.props.queryType} onChange={(event => this.onQueryTypeChanged(event.target.value))} select id="standard-basic" label="Query type" style={{width: '10%', padding: '5px'}}>
            <MenuItem value="raw">Raw</MenuItem>
            <MenuItem value="builder">Builder</MenuItem>
          </TextField>
          <br />
          { this.isQueryBuilderEnabled() &&
          <TextField value={this.props.queryBuilderService} onChange={(event => this.onServiceChanged(event.target.value))} select id="standard-basic" label="Service" style={{width: '10%', padding: '5px'}}>
            <MenuItem value="app-registry">app-registry</MenuItem>
            <MenuItem value="address-service">address-service</MenuItem>
            <MenuItem value="crpt-auth">crpt-auth</MenuItem>
            <MenuItem value="crpt-cryto">crpt-crypto</MenuItem>
            <MenuItem value="crpt-delegation-registry">crpt-delegation-registry</MenuItem>
            <MenuItem value="crpt-notification">crpt-notification</MenuItem>
            <MenuItem value="crpt-nsi">crpt-nsi</MenuItem>
            <MenuItem value="crpt-ogv-registry">crpt-ogv-registry</MenuItem>
            <MenuItem value="crpt-org-info">crpt-org-info</MenuItem>
            <MenuItem value="crpt-prim">crpt-prim</MenuItem>
            <MenuItem value="crpt-tn-ved">crpt-tn-ved</MenuItem>
            <MenuItem value="doc-signer">doc-signer</MenuItem>
            <MenuItem value="egais-service">egais-service</MenuItem>
            <MenuItem value="elk-processor">elk-processor</MenuItem>
            <MenuItem value="gismt-administration">gismt-administration</MenuItem>
            <MenuItem value="machine-reading-delegations">machine-reading-delegations</MenuItem>
            <MenuItem value="lk-admin">lk-admin</MenuItem>
            <MenuItem value="lp/facade">lp/facade</MenuItem>
            <MenuItem value="mod-info">mod-info</MenuItem>
            <MenuItem value="token-service">token-service</MenuItem>
            <MenuItem value="true-api">true-api</MenuItem>
            <MenuItem value="united-auth">united-auth</MenuItem>
          </TextField>
          }
          { this.isQueryBuilderEnabled() &&
          <FormControlLabel
            control={
              <Switch checked={this.props.queryBuilderTracing} onChange={() => { this.onTracingChanged(!this.props.queryBuilderTracing); }} value="physics" color="primary" />
            }
            label="Tracing"
            style={{width: 'auto', padding: '5px'}}
          />
          }
          { this.isQueryBuilderTracingEnabled() &&
          <TextField value={this.props.queryBuilderTracingSteps} onChange={(event => this.onTracingStepsChanged(event.target.value))} id="standard-basic" label="Steps" style={{width: '10%', padding: '5px'}} />
          }
          { this.isQueryBuilderTracingEnabled() &&
          <TextField value={this.props.queryBuilderTracingDirection} onChange={(event => this.onTracingDirectionChanged(event.target.value))} select id="standard-basic" label="Direction" style={{width: '10%', padding: '5px'}}>
            <MenuItem value="in">In</MenuItem>
            <MenuItem value="out">Out</MenuItem>
            <MenuItem value="both">Both</MenuItem>
          </TextField>
          }
          <br />
          { this.isQueryRawEnabled() &&
          <TextField value={this.props.query} onChange={(event => this.onQueryChanged(event.target.value))} id="standard-basic" label="raw gremlin query" style={{width: '60%', padding: '5px'}} />
          }
          <Button variant="contained" color="primary" onClick={this.sendQuery.bind(this)} style={{width: '150px', padding: '5px'}} >Execute</Button>
          {/*<Button variant="outlined" color="secondary" onClick={this.clearGraph.bind(this)} style={{width: '150px'}} >Clear Graph</Button>*/}
        </form>

        <br />
        <div style={{color: 'red', padding: '5px'}}>{this.props.error}</div>
      </div>

    );
  }
}

export const HeaderComponent = connect((state)=>{
  return {
    host: state.gremlin.host,
    port: state.gremlin.port,
    queryType: state.gremlin.queryType,
    query: state.gremlin.query,
    queryBuilderService: state.gremlin.queryBuilderService,
    queryBuilderTracing: state.gremlin.queryBuilderTracing,
    queryBuilderTracingSteps: state.gremlin.queryBuilderTracingSteps,
    queryBuilderTracingDirection: state.gremlin.queryBuilderTracingDirection,
    error: state.gremlin.error,
    nodes: state.graph.nodes,
    edges: state.graph.edges,
    nodeLabels: state.options.nodeLabels,
    nodeLimit: state.options.nodeLimit
  };
})(Header);