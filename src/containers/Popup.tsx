/*global chrome*/
import React, { Component } from 'react';
import * as Util from '../common/util'
import '../css/popup.css';
// @ts-ignore
import Tab from 'chrome/tabs/Tab';
import Toast from '../components/Toast'

export default class Popup extends Component {

    state = {
        domain: null,
        hasDomain: false,
        isEnabled: false,
        toastVisible: false
    };

    toggleEnable = () => {
        const enabled = !this.state.isEnabled;
        this.setState({
            ...this.state,
            isEnabled: enabled
        });
        chrome.storage.sync.set({
            isSummarizerEnabled: enabled
        }, () => {
            if (enabled) {
                Util.displayStatus('Summarizer enabled! Refresh to see changes.');
            } else {
                Util.displayStatus('Summarizer disabled... Refresh to see changes.');
            }
        });
    };

    toggleDomain = () => {
        console.log('toggle domain', this.state.hasDomain);
        const hasDomain = !this.state.hasDomain;
        this.setState({
            ...this.state,
            hasDomain
        });
        chrome.tabs.query({active: true, currentWindow: true}, (tabs: Tab[] ) => {
            const url = new URL(tabs[0].url!);
            if (this.state.hasDomain) {
                Util.addDomain(url.hostname);
            } else {
                Util.removeDomain(url.hostname);
            }
        });
    };

    updateState = () => {
        chrome.storage.sync.get({
            summaryDomainWhitelist: [],
            isSummarizerEnabled: false
        }, (storage) => {
            const {summaryDomainWhitelist, isSummarizerEnabled: isEnabled} = storage;
            const whitelist = new Set (summaryDomainWhitelist);
            chrome.tabs.query({active: true, currentWindow: true}, (tabs: Tab[]) => {
                let hasDomain = false;
                const {hostname: domain} = new URL(tabs[0].url!);
                if (whitelist.has(domain)) {
                    hasDomain = true;
                }
                this.setState({
                    ...this.state,
                    domain,
                    hasDomain,
                    isEnabled
                });
            });
        });
    };

    componentDidMount() {
        this.updateState();
    };

    render() {
        const { domain, hasDomain, isEnabled } = this.state;
        const whitelistToggleText = hasDomain ? `Remove "${domain}"` : `Add "${domain}"`;
        return(
            <div>
                <div className="container">
                    <div className="goose-icon"/>
                    <h1 className="title">Summarizer</h1>
                    <div className="summ-option-container">
                        <div className="summ-option-group">
                            <p className="summ-option-label">Enable Summarizer</p>
                            <div className="summ-option-checkbox">
                                <input
                                    type="checkbox"
                                    id="enableSummarizer"
                                    checked={isEnabled}
                                    onChange={() => this.toggleEnable()}/>
                                <label htmlFor="enableSummarizer"/>
                            </div>
                        </div>
                        <hr className="summ-option-hr"/>
                        <div className="summ-option-group">
                            <button className="summ-option-button" id="whitelistToggle" onClick={() => this.toggleDomain()}>
                                {whitelistToggleText}
                            </button>
                        </div>
                    </div>
                </div>
                <Toast/>
            </div>
        );
    }
}