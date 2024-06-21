import React, { useState } from 'react';
import './App.css';

function Calculator() {
  const [output, setOutput] = useState("0");
  const [equation, setEquation] = useState([]);

  //clear
  const handleClear = () => {
    setOutput("0");
    setEquation([]);
  };

  //num
  const handleNumbers = (e) => {
    const val = e.target.value;
    if (output === "0") {
      setOutput(val);
    } else {
      setOutput(output.replace(/[*/+-]/g, "").concat(val));
    }
  };


  const handleDecimal = () => {
    if (output.search(/[.]/g) < 0) {
      setOutput(output.concat("."));
    }
  };

  //op
  const handleOperator = (operator) => {
    const val = operator.target.value;
    if (Number.isNaN(Number(output))) {
      equation[equation.length - 1] = val;
      setEquation([...equation]);
      setOutput(val);
    } else {
      if (val === "^") {
        setEquation([...equation, output, "^"]);
        setOutput("0");
      } else {
        setEquation([...equation, output, val]);
        setOutput(val);
      }
    }
  };

  const handleEquals = () => {
    const finalEquation = [...equation, output];
    let result = 0;

    // Evaluate ^ before other operators
    const evaluateExponentiation = (equation) => {
      let tempEquation = [...equation];
      for (let i = 1; i < tempEquation.length; i += 2) {
        if (tempEquation[i] === "^") {
          const base = Number(tempEquation[i - 1]);
          const exponent = Number(tempEquation[i + 1]);
          const computed = Math.pow(base, exponent);
          tempEquation.splice(i - 1, 3, computed.toString());
          i -= 2; // Adjust index to account for splice
        }
      }
      return tempEquation;
    };

    // Evaluate remaining operators
    const evaluateOperators = (equation) => {
      let acc = Number(equation[0]);
      for (let i = 1; i < equation.length; i += 2) {
        const operator = equation[i];
        const operand = Number(equation[i + 1]);
        switch (operator) {
          case "*":
            acc *= operand;
            break;
          case "/":
            acc /= operand;
            break;
          case "+":
            acc += operand;
            break;
          case "-":
            acc -= operand;
            break;
          default:
            break;
        }
      }
      return acc;
    };
    
    // Evaluate exponentiation first
    const evaluatedExponentiation = evaluateExponentiation(finalEquation);
    // Then evaluate other operators
    result = evaluateOperators(evaluatedExponentiation);

    setOutput(result.toString());
    setEquation([]);
  };

  //scifi
  const handleScientificFunction = (func) => {
    let result;
    switch (func) {
      case "sin":
        result = Math.sin(Number(output)).toString();
        break;
      case "cos":
        result = Math.cos(Number(output)).toString();
        break;
      case "tan":
        result = Math.tan(Number(output)).toString();
        break;
      case "per":
        result = output / 100;
        break;
      case "pi":
        result = Math.PI.toString();
        break;
      case "rand":
        result = Math.random().toString();
        break;
      case "sinh":
        result = Math.sinh(output).toString();
        break;
      case "cosh":
        result = Math.cosh(output).toString();
        break;
      case "tanh":
        result = Math.tanh(output).toString();
        break;
      case "x":
        result = Math.pow(10, output).toString();
        break;
      case "onex":
        result =  (1/output).toString();
        break;
      case "ex":
        result = (output) => Math.exp(output).toString();
        break;
      case "square":
        result =  (output*output).toString();
        break;
      case "cube":
        result = (output*output*output).toString();
        break;
      case "sqrt":
        result = Math.sqrt(Number(output)).toString();
        break;
      case "cuberoot":
        result = Math.cbrt(output).toString();
        break;
      case "ln":
        result = Math.log(output).toString();
        break;
      case "log":
        result = Math.log10(output).toString();
        break;
      case "e":
        result = (2.718281828459045).toString();
        break;
      case "ee":
        result = convertToScientificNotation(output);
        break;
      case "fact":
        result = factorial(Number(output)).toString();
        break;
      default:
        result = "";
        break;
    }
    setOutput(result);
  };
//m
   const handleMemory = (type) => {
    switch (type) {
      case "M+":
        setMemory(memory + Number(output));
        break;
      case "M-":
        setMemory(memory - Number(output));
        break;
      case "MR":
        setOutput(memory.toString());
        break;
      case "MC":
        setMemory(0);
        break;
      default:
        break;
    }
  };
// fact
  const factorial = (num) => {
    if (num === 0 || num === 1) {
      return 1;
    }
    let result = 1;
    for (let i = 2; i <= num; i++) {
      result *= i;
    }
    return result;
  };

//ee
  function convertToScientificNotation(number) {
    // Handle cases where number is 0 or NaN
    if (number === 0) {
      return "0";
    } else if (isNaN(number)) {
      return "NaN";
    }
  
    // Get the exponent (b) by finding the number of decimal places to the right of the leading (most significant) digit
    // (excluding zeros after the decimal point)
    let exponent = 0;
    const numberString = number.toString();
    const decimalIndex = numberString.indexOf(".");
    if (decimalIndex > 0) {
      exponent = numberString.length - decimalIndex - 1;
    }
  
    // Extract the significand (a) by removing the decimal point and trailing zeros
    let significand = numberString.replace(".", "");
    while (significand[significand.length - 1] === "0" && significand.length > 1) {
      significand = significand.slice(0, -1); // Remove trailing zeros
    }
  
    // Adjust the exponent if the leading digit is not between 1 and 10 (e.g., for very large or small numbers)
    if (Math.abs(number) >= 10) {
      exponent++;
      significand = significand.slice(0, 1); // Take the first digit as the leading digit
    } else if (Math.abs(number) < 1) {
      exponent--;
      significand = "0." + significand; // Add leading zero and decimal point for numbers less than 1
    }
  
    return `${significand}E+${exponent}`;
  }

  return (
    <div className="calculator">
      <div className="output">
        <h2 id="display">{output}</h2>
      </div>
      <div className="buttons">
        <button  className='b'>(</button>
        <button className='b'>)</button>
        <button className="b" id="mc" onClick={() => handleMemory("MC")}>mc</button>
        <button className="b" id="mplus" onClick={() => handleMemory("M+")}>m+</button>
        <button className="b" id="mminus" onClick={() => handleMemory("M-")}>m-</button>
        <button className="b" id="mr" onClick={() => handleMemory("MR")}>mr</button>
        <button id="clear" onClick={handleClear}>AC</button>
        <button id="modular" value="%" className='orange' onClick={() => handleScientificFunction("per")}>%</button>
        <button id="divide" value="/" onClick={handleOperator}>÷</button>
        <button id="nd" className="b" onClick={() => handleScientificFunction("nd")}>2<sup>nd</sup></button>
        <button id="square" className='b' onClick={() => handleScientificFunction("square")}>x<sup>2</sup></button>
        <button id="cube" className="b" onClick={() => handleScientificFunction("cube")}>x<sup>3</sup></button>
        <button id="xysquare" className="b">x<sup>y</sup></button>
        <button id="ex" className="b" onClick={()=> handleScientificFunction("ex")}>e<sup>x</sup></button>
        <button id="10x" className="b" onClick={() => handleScientificFunction("x")}>10<sup>x</sup></button>
        <button value="7" onClick={handleNumbers}>7</button>
        <button value="8" onClick={handleNumbers}>8</button>
        <button value="9" onClick={handleNumbers}>9</button>
        <button id="multiply" className='orange' value="*" onClick={handleOperator}>x</button>
        <button id="onex" className='b' onClick={() => handleScientificFunction("onex")}><sup>1</sup>/x</button>
        <button id="sqrt" className='b' onClick={() => handleScientificFunction("sqrt")}><sup>2</sup>√x</button>
        <button id="cuberoot" className='b' onClick={() => handleScientificFunction("cuberoot")}><sup>3</sup>√x</button>
        <button id="xysquare" className='b'><sup>x</sup>√y</button>
        <button id="nlog" className='b' onClick={() => handleScientificFunction("ln")}>ln</button>
        <button id="log" className='b' onClick={() => handleScientificFunction("log")}>log<sub>10</sub></button>
        <button value="4" onClick={handleNumbers}>4</button>
        <button value="5" onClick={handleNumbers}>5</button>
        <button value="6" onClick={handleNumbers}>6</button>
        <button id="subtract" className='orange' value="-" onClick={handleOperator}>-</button>
        <button id="fact" className="b" onClick={() => handleScientificFunction("fact")}>x!</button>
        <button id="sin" className='b' onClick={() => handleScientificFunction("sin")}>sin</button>
        <button id="cos" className='b' onClick={() => handleScientificFunction("cos")}>cos</button>
        <button id="tan" className='b' onClick={() => handleScientificFunction("tan")}>tan</button>
        <button id="e" className='b' onClick={() => handleScientificFunction("e")}>e</button>
        <button id="EE" className='b' onClick={() => handleScientificFunction("ee")}>EE</button>
        <button value="1" onClick={handleNumbers}>1</button>
        <button value="2" onClick={handleNumbers}>2</button>  
        <button value="3" onClick={handleNumbers}>3</button>
        <button id="add"  className='orange' value="+" onClick={handleOperator}>+</button>
        <button id="rand" className="b" onClick={() => handleScientificFunction("rand")}>Rand</button>
        <button id="sinh" className="b" onClick={() => handleScientificFunction("sinh")}>sinh</button>
        <button id="cosh" className="b" onClick={() => handleScientificFunction("cosh")}>cosh</button>
        <button id="tanh" className="b" onClick={() => handleScientificFunction("tanh")}>tanh</button>
        <button id="pi" className="b" onClick={() => handleScientificFunction("pi")}>π</button>
        <button id="ln" className="b" value="^" onClick={handleOperator}>^</button>
        <button id="zero"value="0" onClick={handleNumbers}>0</button>
        <button id="decimal" value="." onClick={handleDecimal}>.</button>
        <button id="equals" className='orange' value="=" onClick={handleEquals}>=</button>
      </div>
    </div>
  );
}

export default Calculator;
