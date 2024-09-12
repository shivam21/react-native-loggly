# react-native-loggly
React Native logger to push log to loggly v2

## Installation
const logger = new LogglyTracker(); <br />
logger.setKey(LOGGLY_TOKEN); <br />

Note: LOGGLY_TOKEN to be kept in secrets <br />

## Usage
logger.logData("Test Log");

## Send Tags to Loggly
logger.log("tag", "Test Log");

## Send Log Priority Level
logger.log("tag", "Test Log", LogLevel.WARN); <br />

Available values for LogLevel: <br />
DEBUG, WARN, ERROR, INFO

## Send CommonProperties with each log
logger.addCommonProperty("lang", i18next?.language);

## Send Properties
logger.setUserId(userId); <br />
logger.setMixPanelId(id); <br />
logger.setAppCode(Config.APP_CODE) <br />
logger.setAppInfo(Config.VERSION_CODE, Config.VERSION_NAME, Config.BUILD_TYPE)