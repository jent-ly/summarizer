import Button from "@material-ui/core/Button";
import FormControlLabel from "@material-ui/core/FormControlLabel";
import FormGroup from "@material-ui/core/FormGroup";
import Switch from "@material-ui/core/Switch";
import React, { Component } from "react";
import thumbsDown from "../img/thumbs-down.png";
import thumbsUp from "../img/thumbs-up.png";

interface IMainTabProps {
    isEnabled: boolean;
    toggleDomain: () => void;
    toggleEnable: () => void;
    hasDomain: boolean;
    domain: string;
    submitFeedback: (score: number, description: string) => void;
    feedbackSent: boolean;
}

export default class MainTab extends Component<IMainTabProps, {}>  {

    public state = {
        feedbackText: "",
    };
    private defaultFeedbackText = "Optionally tell us why :)";

    public handleChange = (event: any) => {
        this.setState({feedbackText: event.target.value});
    }

    public render() {
        const { isEnabled, toggleDomain, toggleEnable, hasDomain, domain, submitFeedback, feedbackSent } = this.props;
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
                <div className="feedback-container">
                { hasDomain && isEnabled && !feedbackSent &&
                    <>
                    <div className="feedback-container-title">
                        How is the summary on this site?
                    </div>
                    <textarea
                        className="feedback-container-textarea"
                        name="feedbackdescription"
                        placeholder={this.defaultFeedbackText}
                        value={this.state.feedbackText}
                        onChange={this.handleChange}
                        cols={25}
                        rows={4} />
                    <div className="feedback-button-container">
                        <Button
                            className="feedback-button"
                            color="secondary"
                            onClick={(event) => submitFeedback(1, this.state.feedbackText)}>
                            <img className="feedback-button-icon" src={thumbsUp} alt="thumbs-up"/>
                        </Button>
                        <Button
                            className="feedback-button"
                            color="secondary"
                            onClick={(event) => submitFeedback(0, this.state.feedbackText)}>
                            <img className="feedback-button-icon" src={thumbsDown} alt="thumbs-down"/>
                        </Button>
                    </div>
                    </>
                }
                { feedbackSent &&
                    <div className="feedback-confirm">
                        Thanks for your feedback!
                    </div>
                }
                </div>
            </FormGroup>
        );
    }
}
