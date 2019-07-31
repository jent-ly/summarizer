import PropTypes from "prop-types";
import React, { Component } from "react";

interface IToastProps {
    content: string;
    hidden: boolean;
}

export default class Toast extends Component<IToastProps, {}>  {
    public render() {
        const { content, hidden } = this.props;
        const classString = "summ-toast" + ( hidden ? " summ-toast-hidden" : "");
        return (
            <div className={classString} id="statusDisplay">
                {content}
            </div>
        );
    }
}
