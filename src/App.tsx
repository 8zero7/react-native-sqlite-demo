/**
 * React Native SQLite Demo
 * Copyright (c) 2018 Bruce Lefebvre <bruce@brucelefebvre.com>
 * https://github.com/blefebvre/react-native-sqlite-demo/blob/master/LICENSE
 */
import React, { Component } from "react";
import { AppState, StyleSheet, SafeAreaView } from "react-native";
import { database } from "./database/Database";
import { AllLists } from "./components/AllLists";

interface State {
  appState: string;
  databaseIsReady: boolean;
}

export default class App extends Component<object, State> {
  constructor(props: any) {
    super(props);
    this.state = {
      appState: AppState.currentState,
      databaseIsReady: false
    };
    this.handleAppStateChange = this.handleAppStateChange.bind(this);
  }

  public componentDidMount() {
    // App is starting up
    this.appIsNowRunningInForeground();
    this.setState({
      appState: "active"
    });
    // Listen for app state changes
    AppState.addEventListener("change", this.handleAppStateChange);
  }

  public componentWillUnmount() {
    // Remove app state change listener
    AppState.removeEventListener("change", this.handleAppStateChange);
  }

  public render() {
    // Once the database is ready, show the Lists
    if (this.state.databaseIsReady) {
      return (
        <SafeAreaView style={styles.container}>
          <AllLists />
        </SafeAreaView>
      );
    }
    // Else, show nothing. TODO: show a loading spinner
    return null;
  }

  // Handle the app going from foreground to background, and vice versa.
  private handleAppStateChange(nextAppState: string) {
    if (
      this.state.appState.match(/inactive|background/) &&
      nextAppState === "active"
    ) {
      // App has moved from the background (or inactive) into the foreground
      this.appIsNowRunningInForeground();
    } else if (
      this.state.appState === "active" &&
      nextAppState.match(/inactive|background/)
    ) {
      // App has moved from the foreground into the background (or become inactive)
      this.appHasGoneToTheBackground();
    }
    this.setState({ appState: nextAppState });
  }

  // Code to run when app is brought to the foreground
  private appIsNowRunningInForeground() {
    console.log("App is now running in the foreground!");
    return database.open().then(() =>
      this.setState({
        databaseIsReady: true
      })
    );
  }

  // Code to run when app is sent to the background
  private appHasGoneToTheBackground() {
    console.log("App has gone to the background.");
    database.close();
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1
  }
});