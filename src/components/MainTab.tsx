import Button from "@material-ui/core/Button";
import Fab from "@material-ui/core/Fab";
import ThumbUpIcon from "@material-ui/icons/ThumbUp";
import ThumbDownIcon from "@material-ui/icons/ThumbDown";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Switch from "@material-ui/core/Switch";
import React, { Component } from "react";

interface IMainTabProps {
    isEnabled: boolean;
    toggleDomain: () => void;
    toggleEnable: () => void;
    hasDomain: boolean;
    domain: string;
    submitFeedbackApiCall: (score: number, description: string) => void;
}

export default class MainTab extends Component<IMainTabProps, {}>  {
    private defaultFeedbackText = "Optionally tell us why :)";
    
    public state = {
        feedbackText: "",
    };

    public handleChange = (event: any) => {
        this.setState({feedbackText: event.target.value});
    }

    public render() {
        const { isEnabled, toggleDomain, toggleEnable, hasDomain, domain, submitFeedbackApiCall } = this.props;
        const whitelistToggleText = (hasDomain ? `Remove` : `Add`) + " Domain";
        return (
            <FormGroup className="summ-option-container">
                <FormControlLabel
                    className="summ-option-checkbox"
                    control={
                        <Switch
                            checked={isEnabled}
                            onChange={toggleEnable} />
                    }
                    label="Enable Summarizer"
                />
                <Button
                    className="summ-option-add-button"
                    variant="contained"
                    color="secondary"
                    onClick={toggleDomain}>
                    <div className="add-remove-button-text">
                        {whitelistToggleText}
                    </div>
                    <div className="add-remove-domain">
                        {`"${domain}"`}
                    </div>
                </Button>

                { hasDomain && isEnabled &&
                <div className="feedback-container">
                    <div className="feedback-container-title">How is the summary on this site?</div>

                    <textarea className="feedback-container-textarea" name="feedbackdescription" placeholder={this.defaultFeedbackText} value={this.state.feedbackText} onChange={this.handleChange} cols={25} rows={5} />

                    <div className="feedback-button-container">
                        <Fab className="feedback-button" color="default"
                            onClick={(event) => submitFeedbackApiCall(1, this.state.feedbackText)}>
                            <ThumbUpIcon />
                        </Fab>
                        <Fab className="feedback-button" color="secondary"
                            onClick={(event) => submitFeedbackApiCall(0, this.state.feedbackText)}>
                            <ThumbDownIcon />
                        </Fab>
                    </div>
                </div>
                }
            </FormGroup>
        );
    }
}
