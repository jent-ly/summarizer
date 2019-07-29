/*global chrome*/
import React, { Component } from 'react';
// @ts-ignore
import { Tab as ChromeTab } from 'chrome/tabs/Tab';
// Components
import TabPanel from '../components/TabPanel';
import Toast from '../components/Toast';
// Material UI
import AppBar from '@material-ui/core/AppBar';
import SwipeableViews from 'react-swipeable-views';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
// Style + Util
import * as Util from '../common/util';
import '../css/popup.scss';

export default class Popup extends Component {

    state = {
        domain: null,
        hasDomain: false,
        isEnabled: false,
        toastVisible: false,
        curTab: 0
    };


    a11yProps = (index: number) => {
      return {
        id: `nav-tab-${index}`,
        'aria-controls': `nav-tabpanel-${index}`,
      };
    }

    handleChangeTab = (ev: any, newTab: number) => {
        console.log('change tab??', newTab);
        this.setState({
            curTab: newTab
        });
    }

    handleChangeIndex = (newIndex: number) => {
        this.setState({
            curTab: newIndex
        });
    }

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
        chrome.tabs.query({active: true, currentWindow: true}, (tabs: ChromeTab[] ) => {
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
            chrome.tabs.query({active: true, currentWindow: true}, (tabs: ChromeTab[]) => {
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
        const { domain, hasDomain, isEnabled, curTab } = this.state;
        const whitelistToggleText = hasDomain ? `Remove "${domain}"` : `Add "${domain}"`;
        return(
            <div>
                <div className="container">
                    <div className="goose-icon"/>
                    <h1 className="title">Summarizer</h1>
                    <AppBar position="static" color="default">
                        <Tabs
                          value={curTab}
                          onChange={this.handleChangeTab}
                          indicatorColor="primary"
                          textColor="primary"
                          variant="fullWidth"
                          aria-label="tab navigation"
                        >
                          <Tab className="tab-label" label="Apply" {...this.a11yProps(0)} />
                          <Tab className="tab-label" label="Site List" {...this.a11yProps(1)} />
                          <Tab className="tab-label" label="Options" {...this.a11yProps(2)} />
                        </Tabs>
                    </AppBar>
                    <SwipeableViews
                        index={curTab}
                        onChangeIndex={this.handleChangeIndex}
                    >
                        <TabPanel value={curTab} index={0}>
                          Item One
                        </TabPanel>
                        <TabPanel value={curTab} index={1}>
                          Item Two
                        </TabPanel>
                        <TabPanel value={curTab} index={2}>
                          Item Three
                        </TabPanel>
                    </SwipeableViews>
                </div>
                <Toast/>
            </div>
        );
    }
}

// <div className="summ-option-container">
//                         <div className="summ-option-group">
//                             <p className="summ-option-label">Enable Summarizer</p>
//                             <div className="summ-option-checkbox">
//                                 <input
//                                     type="checkbox"
//                                     id="enableSummarizer"
//                                     checked={isEnabled}
//                                     onChange={() => this.toggleEnable()}/>
//                                 <label htmlFor="enableSummarizer"/>
//                             </div>
//                         </div>
//                         <hr className="summ-option-hr"/>
//                         <div className="summ-option-group">
//                             <button className="summ-option-button" id="whitelistToggle" onClick={() => this.toggleDomain()}>
//                                 {whitelistToggleText}
//                             </button>
//                         </div>
//                     </div>