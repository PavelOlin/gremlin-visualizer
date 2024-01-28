import { ACTIONS, SERVER_HOST } from '../constants';

const initialState = {
  host: SERVER_HOST,
  port: '8182',
  queryType: 'raw',
  query: 'g.V()',
  queryBuilderService: null,
  queryBuilderTracing: false,
  queryBuilderTracingSteps: 1,
  queryBuilderTracingDirection: 'out',
  error: null
};

export const reducer =  (state=initialState, action)=>{
  switch (action.type){
    case ACTIONS.SET_HOST: {
      return { ...state, host: action.payload }
    }
    case ACTIONS.SET_PORT: {
      return { ...state, port: action.payload }
    }
    case ACTIONS.SET_QUERY_TYPE: {
      return { ...state, queryType: action.payload }
    }
    case ACTIONS.SET_QUERY: {
      return { ...state, query: action.payload, error: null }
    }
    case ACTIONS.SET_QUERY_BUILDER_SERVICE: {
      return { ...state, queryBuilderService: action.payload, error: null }
    }
    case ACTIONS.SET_QUERY_BUILDER_TRACING: {
      const tracing = _.get(action, 'payload', true);
      return { ...state, queryBuilderTracing: tracing, error: null }
    }
    case ACTIONS.SET_QUERY_BUILDER_TRACING_STEPS: {
      return { ...state, queryBuilderTracingSteps: action.payload, error: null }
    }
    case ACTIONS.SET_QUERY_BUILDER_TRACING_DIRECTION: {
      return { ...state, queryBuilderTracingDirection: action.payload, error: null }
    }
    case ACTIONS.SET_ERROR: {
      return { ...state, error: action.payload }
    }
    default:
      return state;
  }
};
