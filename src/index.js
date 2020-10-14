import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Button(props) {
  return (
    <button className='calculator-button' onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class History extends React.Component {
  renderCalculationRecord(i) {
    return (
      <li key={i}>
        <span onClick={() => this.props.recordOnClick(i, "firstNumber")}>
          {this.props.history[i].firstNumber}
        </span>
        {" " + this.props.history[i].operation + " "}
        <span onClick={() => this.props.recordOnClick(i, "secondNumber")}>
          {this.props.history[i].secondNumber}
        </span>
        {" = "}
        <span onClick={() => this.props.recordOnClick(i, "result")}>
          {this.props.history[i].result}
        </span>
      </li>
    );
  }

  render() {
    let history = [];
    for (let i = 0; i < this.props.history.length; i++) {
      history.push(this.renderCalculationRecord(i));
    }

    return (
      <div id='history-area'>
        <ul>{history}</ul>
        <button id="clearHistoryButton" onClick={() => this.props.clearHistory()}>Clear History</button>
      </div>
    );
  }
}

class Display extends React.Component {
  render() {
    return (
      <div id='display-area'>
        <span id='prev'>
          {this.props.firstNumber} {this.props.operator}
        </span>
        <span id='cur'>{this.props.secondNumber}</span>
      </div>
    );
  }
}

class MainButtonPanel extends React.Component {
  renderDigitPanel() {
    let panel = [];
    for (let i = 9; i >= 1; i--) {
      panel.push(
        <Button
          key={i}
          value={i}
          onClick={() => this.props.handleDigitButton(i)}
        />
      );
    }
    panel.push(
      <Button key='.' value='.' onClick={() => this.props.addDot()} />
    );
    panel.push(
      <Button
        key='0'
        value={0}
        onClick={() => this.props.handleDigitButton(0)}
      />
    );
    panel.push(
      <Button
        key='+-'
        value='+/-'
        onClick={() => this.props.changeSign()}
      />
    );
    return <div id='digit-panel'>{panel}</div>;
  }

  render() {
    return (
      <div id='main-button-area'>
        <Button value='C' onClick={() => this.props.clear()} />
        <Button value='<<' onClick={() => this.props.correct()} />
        <Button
          value='/'
          onClick={() => this.props.handleOperation("/")}
        />
        <Button
          value='*'
          onClick={() => this.props.handleOperation("*")}
        />
        <Button
          value='+'
          onClick={() => this.props.handleOperation("+")}
        />
        <Button
          value='-'
          onClick={() => this.props.handleOperation("-")}
        />
        <Button value='=' onClick={() => this.props.calculate()} />
        {this.renderDigitPanel()}
      </div>
    );
  }
}

class Calculator extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      current: {
        firstNumber: "",
        secondNumber: "",
        operation: "",
        result: "",
      },
      history: [],
    };
  }

  clear() {
    this.setState({
      current: {
        firstNumber: "",
        secondNumber: "",
        operator: "",
        result: "",
      },
    });
  }

  correct() {
    const secondNumber = this.state.current.secondNumber;
    if (
      typeof secondNumber === "number" ||
      (!secondNumber.indexOf("-") && secondNumber.length < 3) ||
      secondNumber.length < 2
    ) {
      this.setState({
        current: {
          secondNumber: "",
          firstNumber: this.state.current.firstNumber,
          operation: this.state.current.operation,
        },
      });
    } else {
      this.setState({
        current: {
          secondNumber: secondNumber.slice(0, secondNumber.length - 1),
          firstNumber: this.state.current.firstNumber,
          operation: this.state.current.operation,
        },
      });
    }
  }

  handleOperation(operator) {
    this.setState({
      current: {
        firstNumber:
          this.state.current.secondNumber === ""
            ? 0
            : this.state.current.secondNumber,
        secondNumber: "",
        operation: operator,
      },
    });
  }

  handleDigitButton(digit) {
    if (this.state.current.secondNumber === "0") {
      this.setState({
        current: {
          secondNumber: digit,
          firstNumber: this.state.current.firstNumber,
          operation: this.state.current.operation,
        },
      });
    } else {
      this.setState({
        current: {
          secondNumber:
            typeof this.state.current.secondNumber === "number"
              ? "" + digit
              : this.state.current.secondNumber.concat(digit),
          firstNumber: this.state.current.firstNumber,
          operation: this.state.current.operation,
        },
      });
    }
  }

  addDot() {
    const curDigit =
      !this.state.current.secondNumber.length ||
      typeof this.state.current.secondNumber === "number"
        ? "0"
        : this.state.current.secondNumber;
    if (curDigit.indexOf(".") < 0) {
      this.setState({
        current: {
          secondNumber: curDigit.concat("."),
          firstNumber: this.state.current.firstNumber,
          operation: this.state.current.operation,
        },
      });
    }
  }

  changeSign() {
    this.setState({
      current: {
        secondNumber: "" + -this.state.current.secondNumber,
        firstNumber: this.state.current.firstNumber,
        operation: this.state.current.operation,
      },
    });
  }

  historyRecordOnClick(i, calculationPart) {
    this.setState({
      current: {
        firstNumber: this.state.current.firstNumber,
        secondNumber: this.state.history[i][calculationPart],
        operation: this.state.current.operation,
      },
    });
  }

  clearHistory() {
    this.setState({
      history: [],
    });
  }

  calculate() {
    let result;
    switch (this.state.current.operation) {
      case "/":
        if (
          this.state.current.secondNumber &&
          this.state.current.secondNumber !== "0"
        )
          result =
            this.state.current.firstNumber /
            this.state.current.secondNumber;
        break;
      case "*":
        result =
          this.state.current.firstNumber * this.state.current.secondNumber;
        break;
      case "+":
        result =
          Number(this.state.current.firstNumber) +
          Number(this.state.current.secondNumber);
        break;
      case "-":
        result =
          this.state.current.firstNumber - this.state.current.secondNumber;
        break;
      default:
        break;
    }
    if (result !== undefined) {
      const history = this.state.history;
      console.log(result);
      this.setState(
        {
          current: {
            firstNumber: Number(this.state.current.firstNumber),
            secondNumber: Number(this.state.current.secondNumber),
            operation: this.state.current.operation,
            result: Math.round(result * 1e10) / 1e10,
          },
        },
        () => {
          this.setState({
            history: history.concat(this.state.current),
          });
          this.setState({
            current: {
              firstNumber: "",
              secondNumber: this.state.current.result,
              operation: "",
              result: "",
            },
          });
        }
      );
    }
  }

  render() {
    return (
      <div id='calculator-area'>
        <Display
          firstNumber={this.state.current.firstNumber}
          secondNumber={this.state.current.secondNumber}
          operator={this.state.current.operation}
        />
        <MainButtonPanel
          clear={() => this.clear()}
          correct={() => this.correct()}
          handleDigitButton={(i) => this.handleDigitButton(i)}
          handleOperation={(i) => this.handleOperation(i)}
          addDot={() => this.addDot()}
          changeSign={() => this.changeSign()}
          calculate={() => this.calculate()}
        />
        <History
          history={this.state.history}
          recordOnClick={(i, calculationPart) =>
            this.historyRecordOnClick(i, calculationPart)}
          clearHistory ={() => this.clearHistory()}
        />
      </div>
    );
  }
}

ReactDOM.render(<Calculator />, document.getElementById("root"));
