import LogglyTracker from './logger';

const logger = new LogglyTracker();
logger.setKey("723b2a2a-32f9-467d-aa8a-8c03dc2b94c6");
logger.setAppCode("DBA")
logger.setDeviceInfo("deviceId", "googleId")
logger.setMixPanelId("mixPanelId")
logger.setUserId("userId")
logger.setAppInfo(23, "2.3.4", "debug")
logger.addCommonProperty("key1", "value1");
logger.addCommonProperty("key2", "value2");
export default logger;