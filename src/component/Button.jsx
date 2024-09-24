import styled from 'styled-components';

const StyledButton = styled.button`
  background-color:transparent;
  border: none;
  color: white;
  padding: 10px 10px;
  text-align: center;
  text-decoration: none;
  display: inline-block;
  font-size: 2rem;
  cursor: pointer;
  outline: none;
  -webkit-tap-highlight-color: transparent; 
  border-radius: 50%; // Circular buttons
   &:focus {
    outline: none;
    border: none;
  }
   transition: transform 0.1s ease; // Smooth transition for transform property

  &:active {
    transform: scale(1.1); // Scales up the button when active (pressed)
  }
  }
`;

const StyledButtonContainer = styled.div`
    display:flex;
    flex-direction:column;
    font-weight:600;
    background:transparent; 
    align-items:center   
`
const StyledButtonLabel = styled.p`
    margin: 1px 0px;
`
const Button = (props) => (

    <StyledButtonContainer>
        <StyledButton onClick={props.onClick}>
            {props.label}
        </StyledButton>
        <StyledButtonLabel>{props.labelBottom}</StyledButtonLabel>
  </StyledButtonContainer>
);

export default Button;
