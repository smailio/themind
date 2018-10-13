import styled from "styled-components";

export default styled.button`
  position: relative;
  vertical-align: top;
  width: 100%;
  height: 50px;
  padding: 5px 0 0 0;
  font-size: 22px;
  color: white;
  text-align: center;
  text-shadow: 0 1px 2px rgba(0, 0, 0, 0.25);
  background: #f22613;
  border: 0;
  border-bottom: 8px solid #96281b;
  cursor: pointer;
  -webkit-box-shadow: inset 0 -2px #96281b;
  box-shadow: inset 0 -2px #96281b;

  :active {
    top: 1px;
    outline: none;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
`;
