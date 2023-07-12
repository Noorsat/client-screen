import React, { FunctionComponent, useState, MutableRefObject } from "react";
import Keyboard from "react-simple-keyboard";
import "react-simple-keyboard/build/css/index.css";
import layout from "simple-keyboard-layouts/build/layouts/russian";
import './index.scss';

interface IProps {
  onChangeAll?: (inputs: any) => void;
  keyboardRef: MutableRefObject<any>;
  inputName: string;
}

const KeyboardWrapper: FunctionComponent<IProps> = ({
  onChangeAll,
  keyboardRef,
  inputName,
}) => {
  const [layoutName, setLayoutName] = useState("default");

  const onKeyPress = (button: string) => {
    if (button === "{shift}" || button === "{lock}") {
      setLayoutName(layoutName === "default" ? "shift" : "default");
    }
  };

  return (
    <Keyboard
      keyboardRef={(r: any) => (keyboardRef.current = r)}
      layoutName={layoutName}
      inputName={inputName}
      onChangeAll={onChangeAll}
      onKeyPress={onKeyPress}
      onRender={() => console.log("Rendered")}
      theme={'hg-theme-default myTheme1'}
      // theme={'hg-theme-default'}
      {...layout}
    />
  );
};

export default KeyboardWrapper;
