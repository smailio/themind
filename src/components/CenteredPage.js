import styled from 'styled-components';

export default styled.div`
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  align-items: center;
  height: 100vh;
  max-width: 400px;
  margin-right: auto;
  margin-left: auto;
  flex-shrink: 0;
  ${props => (props.columnar ? 'flex-direction : column' : '')};
  ${props => (props.rows ? 'flex-direction : row' : '')};
`;
