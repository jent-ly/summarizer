import React, { Component } from 'react';
import Box from '@material-ui/core/Box';
import Button from '@material-ui/core/Button';
import FormGroup from '@material-ui/core/FormGroup';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

type MainTabProps = {
    isEnabled: boolean,
    toggleDomain: () => void,
    toggleEnable: () => void,
    whitelistToggleText: string,
    domain: string
}

export default class MainTab extends Component<MainTabProps, {}>  {
    render() {
        const { isEnabled, toggleDomain, toggleEnable, whitelistToggleText, domain } = this.props;
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
            </FormGroup>
        );
    }
}