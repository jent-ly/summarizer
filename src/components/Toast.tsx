import React, { Component } from 'react';

type ToastProps = {
    floatTime: number,
    content: string,
    hidden: boolean
}

export default class Toast extends Component {
    render() {
        return (
            <div className="summ-toast summ-toast-hidden" id="statusDisplay">Summarizer disabled... Refresh to see
                changes.
            </div>
        );
    }
}