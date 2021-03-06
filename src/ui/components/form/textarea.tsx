import React, { FunctionComponent, forwardRef } from "react";

import classnames from "classnames";
import style from "./input.module.scss";

export interface TextareaProps {
  color?: "primary" | "info" | "success" | "warning" | "danger";
  label?: string;
  leftIconRender?: FunctionComponent;
  rightIconRender?: FunctionComponent;
  error?: string;
}

// eslint-disable-next-line react/display-name
export const TextArea = forwardRef<
  HTMLTextAreaElement,
  TextareaProps &
    React.DetailedHTMLProps<
      React.TextareaHTMLAttributes<HTMLTextAreaElement>,
      HTMLTextAreaElement
    >
>((props, ref) => {
  const { color, label, leftIconRender, rightIconRender, error } = props;

  const attributes = { ...props };
  delete attributes.color;
  delete attributes.label;
  delete attributes.leftIconRender;
  delete attributes.rightIconRender;
  delete attributes.error;
  delete attributes.children;

  return (
    <div className="field">
      {label ? <label className="label">{label}</label> : null}
      <div
        className={classnames("control", {
          "has-icons-left": leftIconRender !== undefined,
          "has-icons-right": rightIconRender !== undefined || error
        })}
      >
        <textarea
          {...attributes}
          ref={ref}
          className={classnames(
            props.className,
            "textarea",
            style.input,
            color ? `is-${color}` : undefined,
            !color && error ? "is-danger" : undefined
          )}
        />
        {leftIconRender ? (
          <span className="icon is-small is-left">{leftIconRender}</span>
        ) : null}
        {rightIconRender ? (
          <span className="icon is-small is-right">{rightIconRender}</span>
        ) : null}
        {!rightIconRender && error ? (
          <span className="icon is-small is-right">
            <i className="fas fa-exclamation-triangle has-text-danger" />
          </span>
        ) : null}
        {props.children}
      </div>
      {error ? <p className="help is-danger">{error}</p> : null}
    </div>
  );
});
