import React, { Component } from 'react';
import PropTypes from 'prop-types';

type ToastProps = {
    content: string,
    hidden: boolean
}

export default class Toast extends Component<ToastProps, {}>  {
    render() {
        const { content, hidden } = this.props;
        const classString = "summ-toast" + ( hidden ? " summ-toast-hidden" : "");
        return (
            <div className={classString} id="statusDisplay">
                {content}
            </div>
        );
    }
}