/*global chrome*/
import React, { Component } from 'react';
// @ts-ignore
import { Tab as ChromeTab } from 'chrome/tabs/Tab';
// Components
import TabPanel from '../components/TabPanel';
import MainTab from '../components/MainTab';
import ListTab from '../components/ListTab';
import OptionsTab from '../components/OptionsTab';
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
import logo from '../img/v1.5-1000x220.png'
import '../css/popup.scss';

export default class Popup extends Component {
    state = {
        domain: "",
        hasDomain: false,
        isEnabled: false,
        curTab: 0,
        whitelist: [],
        highlightColor: {
            r: 255,
            g: 255,
            b: 0
        }
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
            MuiInputBase: {
                root: {
                    fontSize: '12px',
                },
            },
            MuiSlider: {
                root: {
                    width: '75%',
                    padding: '0',
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
        this.setState({
            curTab: newTab
        });
    }

    handleChangeIndex = (newIndex: number) => {
        this.setState({
            curTab: newIndex
        });
    }

    refreshOrUpdate = (refresh?: boolean) => {
        if (refresh) {
            chrome.tabs.query({active: true, currentWindow: true}, (tabs: ChromeTab[]) => {
                chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
            });
        }
        this.updateState();
    }

    toggleEnable = () => {
        const enabled = !this.state.isEnabled;
        this.setState({
            isEnabled: enabled
        });
        chrome.storage.sync.set({
            isSummarizerEnabled: enabled
        });
    };

    addDomain = (domain: string, refresh?: boolean) => {
        chrome.storage.sync.get({
            summaryDomainWhitelist: []
        }, ({summaryDomainWhitelist}) => {
            let whitelist = new Set(summaryDomainWhitelist);
            whitelist.add(domain);
            chrome.storage.sync.set({
                // @ts-ignore - spread operator on Set
                summaryDomainWhitelist: [...whitelist]
            }, () => {
                this.refreshOrUpdate(refresh);
            });
        });
    };

    removeDomain = (domain: string, refresh?: boolean) => {
        chrome.storage.sync.get({
            summaryDomainWhitelist: []
        }, ({summaryDomainWhitelist}) => {
            let whitelist = new Set(summaryDomainWhitelist);
            whitelist.delete(domain);
            chrome.storage.sync.set({
                // @ts-ignore - spread operator on Set
                summaryDomainWhitelist: [...whitelist]
            }, () => {
                this.refreshOrUpdate(refresh);
            });
        });
    };

    toggleDomain = () => {
        const hasDomain = !this.state.hasDomain;
        this.setState({
            hasDomain
        });
        chrome.tabs.query({active: true, currentWindow: true}, (tabs: ChromeTab[]) => {
            const url = new URL(tabs[0].url!);
            if (this.state.hasDomain) {
                this.addDomain(url.hostname, true);
            } else {
                this.removeDomain(url.hostname, true);
            }
        });
    };

    applyHighlightColor = (newColor: Object) => {
        chrome.storage.sync.set({
            color: newColor
        }, () => {
            chrome.tabs.query({active: true, currentWindow: true}, (tabs: ChromeTab[]) => {
                const url = new URL(tabs[0].url!);
                this.refreshOrUpdate(this.state.hasDomain);
            });
        });
    }

    updateState = () => {
        chrome.storage.sync.get({
            summaryDomainWhitelist: [],
            isSummarizerEnabled: false,
            color: {
                r: 255,
                g: 255,
                b: 0
            }
        }, (storage) => {
            const {summaryDomainWhitelist, isSummarizerEnabled: isEnabled, color: highlightColor} = storage;
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
                    whitelist: summaryDomainWhitelist,
                    highlightColor
                });
            });
        });
    };

    componentDidMount() {
        this.updateState();
    };

    render() {
        const { domain, hasDomain, isEnabled, curTab, whitelist, highlightColor } = this.state;
        const whitelistToggleText = (hasDomain ? `Remove` : `Add`) + " Domain";
        console.log("RENDER: ", highlightColor)
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
                          <ListTab
                            whitelist={whitelist}
                            addDomain={this.addDomain}
                            removeDomain={this.removeDomain}
                          />
                        </TabPanel>
                        <TabPanel value={curTab} index={2}>
                          <OptionsTab
                            highlightColor={highlightColor}
                            applyHighlightColor={this.applyHighlightColor}
                          />
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
