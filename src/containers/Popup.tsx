/*global chrome*/
import React, { Component } from 'react';
// @ts-ignore
import { Tab as ChromeTab } from 'chrome/tabs/Tab';
// Components
import TabPanel from '../components/TabPanel';
import MainTab from '../components/MainTab';
import Toast from '../components/Toast';
// Material UI
import AppBar from '@material-ui/core/AppBar';
import Button from '@material-ui/core/Button';
import { createMuiTheme } from '@material-ui/core/styles';
import SwipeableViews from 'react-swipeable-views';
import Tab from '@material-ui/core/Tab';
import Tabs from '@material-ui/core/Tabs';
import { ThemeProvider } from '@material-ui/styles';
// Style + Util
import * as Util from '../common/util';
import logo from '../img/v1.1-500x96.png'
import '../css/popup.scss';

export default class Popup extends Component {
    state = {
        domain: "",
        hasDomain: false,
        isEnabled: false,
        curTab: 0,
        whitelist: []
    };

    theme = createMuiTheme({
        palette: {
            primary: {
                main: '#ffec00'
            },
            secondary: {
                main: '#fa8d74'
            },
        },
        overrides: {
            MuiTab: {
                selected: {
                    background: '#ffc814',
                },
            },
            MuiTabs: {
                root: {
                    background: '#ffec00',
                },
            },
        },
    });

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
            isEnabled: enabled
        });
        chrome.storage.sync.set({
            isSummarizerEnabled: enabled
        });
        // TODO: message passing to rerun contentscript?
        // chrome.tabs.query({active: true, currentWindow: true}, function(tabs: ChromeTab[]) {
        //     console.log("SEND MESSAGE???");
        //     chrome.tabs.sendMessage(tabs[0].id, {request: "runContentScript"}, function(response) {
        //         console.log("RECEIVED RESPONSE");
        //     });
        // });
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
                    domain,
                    hasDomain,
                    isEnabled,
                    whitelist: summaryDomainWhitelist
                });
            });
        });
    };

    componentDidMount() {
        this.updateState();
    };

    render() {
        const { domain, hasDomain, isEnabled, curTab } = this.state;
        const whitelistToggleText = (hasDomain ? `Remove` : `Add`) + " Domain";
        return(
            <ThemeProvider theme={this.theme}>
                <div className="container">
                    <div className="logo-container">
                        <img className="logo" src={logo} alt="Logo"/>
                    </div>
                    <AppBar position="static" color="default">
                        <Tabs
                          value={curTab}
                          onChange={this.handleChangeTab}
                          indicatorColor="secondary"
                          textColor="secondary"
                          centered
                          aria-label="tab navigation"
                        >
                          <Tab className="tab-label" label="Apply" {...this.a11yProps(0)} />
                          <Tab className="tab-label" label="Site List" {...this.a11yProps(1)} />
                          <Tab className="tab-label" label="Options" {...this.a11yProps(2)} />
                        </Tabs>
                    </AppBar>
                    <SwipeableViews
                        className="tab-panel" 
                        index={curTab}
                        onChangeIndex={this.handleChangeIndex}
                    >
                        <TabPanel value={curTab} index={0}>
                          <MainTab
                            isEnabled={isEnabled}
                            toggleDomain={this.toggleDomain}
                            toggleEnable={this.toggleEnable}
                            whitelistToggleText={whitelistToggleText}
                            domain={domain}
                          />
                        </TabPanel>
                        <TabPanel value={curTab} index={1}>
                          Item Two
                        </TabPanel>
                        <TabPanel value={curTab} index={2}>
                          Item Three
                        </TabPanel>
                    </SwipeableViews>
                    <div className="summ-footer">
                        <Button className="misc-button" size="small" color="secondary">Donate</Button>
                        <Button className="misc-button" size="small" color="secondary">Feedback</Button>
                    </div>
                </div>
            </ThemeProvider>
        );
    }
}