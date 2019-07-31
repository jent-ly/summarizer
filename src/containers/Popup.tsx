/*global chrome*/
// Material UI
import AppBar from "@material-ui/core/AppBar";
import Button from "@material-ui/core/Button";
import { createMuiTheme } from "@material-ui/core/styles";
import Tab from "@material-ui/core/Tab";
import Tabs from "@material-ui/core/Tabs";
import { ThemeProvider } from "@material-ui/styles";
// @ts-ignore
import { Tab as ChromeTab } from "chrome/tabs/Tab";
import React, { Component } from "react";
import SwipeableViews from "react-swipeable-views";
// Style + Util
import ListTab from "../components/ListTab";
import MainTab from "../components/MainTab";
import OptionsTab from "../components/OptionsTab";
// Components
import TabPanel from "../components/TabPanel";
import "../css/popup.scss";
import logo from "../img/v1.5-1000x220.png";

export default class Popup extends Component {
    public state = {
        curTab: 0,
        domain: "",
        hasDomain: false,
        highlightColor: {
            b: 0,
            g: 255,
            r: 255,
        },
        isEnabled: false,
        whitelist: [],
    };

    public theme = createMuiTheme({
        overrides: {
            MuiInputBase: {
                root: {
                    fontSize: "12px",
                },
            },
            MuiSlider: {
                root: {
                    padding: "0",
                    width: "75%",
                },
            },
            MuiTab: {
                selected: {
                    background: "#ffc814",
                },
            },
            MuiTabs: {
                root: {
                    background: "#ffec00",
                },
            },
        },
        palette: {
            primary: {
                main: "#ffec00",
            },
            secondary: {
                main: "#fa8d74",
            },
        },
    });

    public a11yProps = (index: number) => {
      return {
        "aria-controls": `nav-tabpanel-${index}`,
        "id": `nav-tab-${index}`,
      };
    }

    public handleChangeTab = (ev: any, newTab: number) => {
        this.setState({
            curTab: newTab,
        });
    }

    public handleChangeIndex = (newIndex: number) => {
        this.setState({
            curTab: newIndex,
        });
    }

    public refreshOrUpdate = (refresh?: boolean) => {
        if (refresh) {
            chrome.tabs.query({active: true, currentWindow: true}, (tabs: ChromeTab[]) => {
                chrome.tabs.update(tabs[0].id, {url: tabs[0].url});
            });
        }
        this.updateState();
    }

    public toggleEnable = () => {
        const enabled = !this.state.isEnabled;
        this.setState({
            isEnabled: enabled,
        });
        chrome.storage.sync.set({
            isSummarizerEnabled: enabled,
        });
    }

    public addDomain = (domain: string, refresh?: boolean) => {
        chrome.storage.sync.get({
            summaryDomainWhitelist: [],
        }, ({summaryDomainWhitelist}) => {
            const whitelist = new Set(summaryDomainWhitelist);
            whitelist.add(domain);
            chrome.storage.sync.set({
                // @ts-ignore - spread operator on Set
                summaryDomainWhitelist: [...whitelist],
            }, () => {
                this.refreshOrUpdate(refresh);
            });
        });
    }

    public removeDomain = (domain: string, refresh?: boolean) => {
        chrome.storage.sync.get({
            summaryDomainWhitelist: [],
        }, ({summaryDomainWhitelist}) => {
            const whitelist = new Set(summaryDomainWhitelist);
            whitelist.delete(domain);
            chrome.storage.sync.set({
                // @ts-ignore - spread operator on Set
                summaryDomainWhitelist: [...whitelist],
            }, () => {
                this.refreshOrUpdate(refresh);
            });
        });
    }

    public toggleDomain = () => {
        const hasDomain = !this.state.hasDomain;
        this.setState({
            hasDomain,
        });
        chrome.tabs.query({active: true, currentWindow: true}, (tabs: ChromeTab[]) => {
            const url = new URL(tabs[0].url!);
            if (this.state.hasDomain) {
                this.addDomain(url.hostname, true);
            } else {
                this.removeDomain(url.hostname, true);
            }
        });
    }

    public applyHighlightColor = (newColor: object) => {
        chrome.storage.sync.set({
            color: newColor,
        }, () => {
            chrome.tabs.query({active: true, currentWindow: true}, (tabs: ChromeTab[]) => {
                this.refreshOrUpdate(this.state.hasDomain);
            });
        });
    }

    public updateState = () => {
        chrome.storage.sync.get({
            color: {
                b: 0,
                g: 255,
                r: 255,
            },
            isSummarizerEnabled: false,
            summaryDomainWhitelist: [],
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
                    highlightColor,
                    isEnabled,
                    whitelist: summaryDomainWhitelist,
                });
            });
        });
    }

    public componentDidMount() {
        this.updateState();
    }

    public render() {
        const { domain, hasDomain, isEnabled, curTab, whitelist, highlightColor } = this.state;
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
