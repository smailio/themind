import { css } from "styled-components";
import styled from "styled-components";

export default styled.div`
  display: flex;
  margin: 5px;
  ${props => (props.full ? "width : 100%" : "")};
  ${props => (props.centered ? "justify-content : center" : "")};
  ${props =>
    props.width
      ? css`
          width: ${props => props.width + "px"};
        `
      : ""};
  ${props =>
    props.height
      ? css`
          height: ${props => props.height + "px"};
        `
      : ""};
`;
